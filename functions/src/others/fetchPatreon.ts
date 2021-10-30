/* eslint-disable @typescript-eslint/camelcase */
import * as functions from 'firebase-functions';
import firebase from 'firebase-admin';
import axios from 'axios';
import init from '../init';

const app = init();
const auth = app.auth();
const database = app.database();

interface Member {
  id: string;
  relationships: {
    currently_entitled_tiers: {
      data: { id: string }[];
    };
    user: {
      data: {
        id: string;
      };
    };
  };
}

type PatreonProfile = {
  id: string;
  name: string;
  img: string | undefined;
  tier: number;
} & {
  [uid: string]: object;
};

export default functions.pubsub.schedule('*/5 * * * *').onRun(async () => {
  const url = 'https://www.patreon.com/api/oauth2';
  const ref = database.ref('/token_storage/patreon');
  const refreshToken = (await ref.once('value')).val();

  const headers: { [key: string]: unknown } = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const {
    data: { access_token, refresh_token },
  } = await axios.post(
    `${url}/token`,
    `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=mcsy6u4brWts2SHqlVuV4jo_BVLO3Ynfa0HJsnYcozdqkOYv-lWhLz1x6BZzwQTq&client_secret=${
      functions.config().patreon.secret
    }`
  );

  headers.Authorization = `Bearer ${access_token}`;

  const [memberData, campaignData] = (
    await Promise.all([
      axios.get(
        `${url}/v2/campaigns/4696297/members?include=currently_entitled_tiers,user`,
        {
          headers,
        }
      ),
      axios.get(`${url}/v2/campaigns/4696297?include=tiers`, {
        headers,
      }),
      ref.set(refresh_token),
    ])
  ).map(res => res && res.data);

  const tierList = campaignData.included.map((tier: { id: string }) => tier.id);

  const [patreonList, users, existingProfiles] = await Promise.all([
    Promise.all(
      memberData.data.map(async (member: Member) => {
        const tierArr = member.relationships.currently_entitled_tiers.data.map(
          t => t.id
        );
        let tier = 0;
        for (let i = tierList.length; i > 0; i -= 1) {
          if (tierArr.includes(tierList[i - 1])) {
            tier = i;
          }
        }
        const userData = (
          await axios.get(
            `${url}/v2/members/${member.id}?fields%5Bmember%5D=full_name`,
            {
              headers,
            }
          )
        ).data;

        return {
          id: member.relationships.user.data.id,
          name: userData.data.attributes.full_name,
          tier,
        };
      }) as PatreonProfile[]
    ),
    (await database.ref('/users').once('value')).val() as {
      [key: string]: {
        'linked-account': { patreon?: string };
        'patreon-tier'?: number;
      };
    },
    (
      await database.ref(`/patreon_list`).once('value')
    ).val() as PatreonProfile[],
  ]);

  await Promise.all(
    patreonList.map(async (newProfile, i) => {
      const uid = Object.entries(users).find(
        ([, userData]) => userData['linked-account'].patreon === newProfile.id
      )?.[0];
      const existingProfile = existingProfiles.find(
        profile => profile.id === uid || profile.id === newProfile.id
      );

      let user: firebase.auth.UserRecord | undefined;
      try {
        if (!uid) {
          user = undefined;
        } else {
          user = await auth.getUser(uid);
        }
      } catch (err) {
        user = undefined;
      }
      const updated =
        existingProfiles?.findIndex(p => p.id === uid) !== i ||
        !existingProfile ||
        existingProfile.id !== uid ||
        existingProfile.tier !== newProfile.tier ||
        (user?.displayName && existingProfile.name !== user.displayName) ||
        existingProfile.img !== user?.photoURL;
      if (!updated) return;

      await Promise.all([
        ...(uid && user
          ? [
              database.ref(`/patreon_list/${i}`).set({
                id: uid,
                tier: newProfile.tier,
                name: user.displayName ?? newProfile.name,
                img: user.photoURL ?? null,
                [uid]: existingProfile?.[uid] ?? null,
              }),
              database.ref(`/users/${uid}/patreon-tier`).set(newProfile.tier),
            ]
          : [database.ref(`/patreon_list/${i}`).set(newProfile)]),
        database
          .ref('/last_updated/patreon_list')
          .set(new Date().toISOString()),
      ]);
    })
  );
});
