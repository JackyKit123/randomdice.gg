import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import firebase from 'firebase/app';
import Dashboard, {
  Image,
  Selector,
  SubmitButton,
  TextInput,
} from 'components/Dashboard';
import { Boss, WikiContent } from 'types/database';
import { fetchWiki } from 'misc/firebase';
import updateImage, { deleteImage } from 'misc/firebase/updateImage';

export default function editBoss(): JSX.Element {
  const dispatch = useDispatch();
  const selectRef = useRef(null as null | HTMLSelectElement);
  const database = firebase.database();
  const dbRef = database.ref('/wiki/boss');
  const [bossInfo, setBossInfo] = useState<WikiContent['boss']>([]);
  const [bossId, setBossId] = useState<Boss['id']>();
  const [bossName, setBossName] = useState<Boss['name']>('');
  const [bossImg, setBossImg] = useState<Boss['img']>('');
  const [bossDesc, setBossDesc] = useState<Boss['desc']>('');

  useEffect(() => {
    dbRef.once('value').then(snapshot => setBossInfo(snapshot.val()));
  }, []);

  useEffect(() => {
    const boss = bossInfo?.find(b => b.id === bossId);
    setBossName(boss?.name ?? '');
    setBossImg(boss?.img ?? '');
    setBossDesc(boss?.desc ?? '');
  }, [bossId]);

  const invalidName = bossName.length <= 0;
  const invalidImg = bossImg.length <= 0;
  const invalidInput = invalidName || invalidImg;

  const update = async (bossList: Boss[]): Promise<void> => {
    await Promise.all([
      database.ref('/last_updated/wiki').set(new Date().toISOString()),
      dbRef.set(bossList),
    ]);
    fetchWiki(dispatch);
    setBossInfo(bossList);
    setBossId(-1);
    if (selectRef.current) {
      selectRef.current.value = '?';
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!bossId) return;
    const oldBoss = bossInfo.find(boss => boss.id === bossId);
    const boss: Boss = {
      id: bossId,
      name: bossName,
      img: await updateImage(bossImg, 'Boss Images', bossName, oldBoss?.name),
      desc: bossDesc,
    };
    const result = [
      ...(bossInfo.some(b => b.id === bossId) ? [boss] : []),
      ...bossInfo,
    ];
    await update(result);
  };

  const handleDelete = async (): Promise<void> => {
    const oldBoss = bossInfo.find(boss => boss.id === bossId);
    if (oldBoss) {
      await deleteImage('Boss Images', oldBoss.name);
      const result = bossInfo.filter(boss => boss.id !== bossId);
      await update(result);
    }
  };

  return (
    <Dashboard className='boss' isDataReady={!!bossInfo.length}>
      <h3>Update Boss Information</h3>
      <Selector
        name='Boss'
        selectRef={selectRef}
        data={bossInfo}
        setActive={setBossId}
      />
      {typeof bossId !== 'undefined' && (
        <form onSubmit={(evt): void => evt.preventDefault()}>
          <TextInput
            name='Name'
            value={bossName}
            setValue={setBossName}
            isInvalid={invalidName}
            invalidWarningText='Boss Name should not be empty.'
          />
          <Image
            src={bossImg}
            setSrc={setBossImg}
            alt='boss'
            isInvalid={invalidImg}
          />
          <TextInput
            type='rich-text'
            toolbar='basic'
            value={bossDesc}
            setValue={setBossDesc}
          />
          <hr className='divisor' />
          <SubmitButton
            type='submit'
            isInvalid={invalidInput}
            submitPromptText='Are you sure to want to update the information for this boss?'
            onSubmit={handleSubmit}
          />
          <SubmitButton
            type='submit'
            submitPromptText='Are you sure to want to delete this boss?'
            onSubmit={handleDelete}
          />
        </form>
      )}
    </Dashboard>
  );
}
