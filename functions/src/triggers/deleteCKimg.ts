/* eslint-disable @typescript-eslint/camelcase */
import * as functions from 'firebase-functions';
import { XmlEntities } from 'html-entities';
import init from '../init';

// eslint-disable-next-line import/prefer-default-export
export const News = functions.database.ref('/news').onUpdate(async change => {
  const news = change.after.val() as {
    game: string;
    website: string;
  };
  const app = init();
  const bucket = app.storage().bucket();
  const entities = new XmlEntities();
  const [files] = await bucket.getFiles({ prefix: 'CKEditor Images/' });
  files.forEach(async file => {
    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(file.name)}?alt=media&token=${
      file.metadata.metadata.firebaseStorageDownloadTokens
    }`;
    if (
      !entities.decode(news.game).includes(downloadUrl) &&
      !entities.decode(news.website).includes(downloadUrl)
    ) {
      await file.delete();
    }
  });
});
