import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import firebase from 'firebase/app';
import Dashboard, {
  Image,
  Selector,
  SubmitButton,
  TextInput,
} from 'components/Dashboard';
import { Box, WikiContent } from 'types/database';
import { fetchWiki } from 'misc/firebase';
import updateImage, { deleteImage } from 'misc/firebase/updateImage';

export default function editBox(): JSX.Element {
  const dispatch = useDispatch();
  const selectRef = useRef(null as null | HTMLSelectElement);
  const database = firebase.database();
  const dbRef = database.ref('/wiki/box');
  const [boxInfo, setBoxInfo] = useState<WikiContent['box']>([]);
  const [boxId, setBoxId] = useState<Box['id']>();
  const [boxName, setBoxName] = useState<Box['name']>('');
  const [boxImg, setBoxImg] = useState<Box['name']>('');
  const [boxFrom, setBoxFrom] = useState<Box['name']>('');
  const [boxContain, setBoxContain] = useState<Box['name']>('');

  useEffect(() => {
    dbRef.once('value').then(snapshot => setBoxInfo(snapshot.val()));
  }, []);

  const invalidName = boxName.length <= 0;
  const invalidImg = boxImg.length <= 0;
  const invalidFrom = boxFrom.length <= 0;
  const invalidContain = boxContain.length <= 0;
  const invalidInput =
    invalidName || invalidImg || invalidFrom || invalidContain;

  const update = async (boxList: Box[]): Promise<void> => {
    await Promise.all([
      database.ref('/last_updated/wiki').set(new Date().toISOString()),
      dbRef.set(boxList),
    ]);
    fetchWiki(dispatch);
    setBoxInfo(boxList);
    setBoxId(-1);
    if (selectRef.current) {
      selectRef.current.value = '?';
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (typeof boxId === 'undefined' || invalidInput) return;
    const oldBox = boxInfo.find(box => box.id === boxId);
    const box: Box = {
      id: boxId,
      img: await updateImage(boxImg, 'Box Images', boxName, oldBox?.name),
      name: boxName,
      from: boxFrom,
      contain: boxContain,
    };
    const result = boxInfo.map(b => (b.id === box.id ? box : b));
    if (!boxInfo.some(b => b.id === box.id)) {
      result.push(box);
    }
    await update(result);
  };

  const handleDelete = async (): Promise<void> => {
    const oldBox = boxInfo.find(box => box.id === boxId);
    if (oldBox) {
      await deleteImage('Box Images', oldBox.name);
      const result = boxInfo.filter(box => box.id !== boxId);
      await update(result);
    }
  };

  return (
    <Dashboard className='box' isDataReady={!!boxInfo.length}>
      <h3>Update Box Information</h3>
      <Selector
        name='Box'
        selectRef={selectRef}
        data={boxInfo}
        setActive={setBoxId}
      />
      {typeof boxId !== 'undefined' && (
        <form onSubmit={(evt): void => evt.preventDefault()}>
          <TextInput
            name='Name'
            isInvalid={invalidName}
            invalidWarningText='Box Name should not be empty.'
            value={boxName}
            setValue={setBoxName}
          />
          <Image
            src={boxImg}
            setSrc={setBoxImg}
            alt='box'
            isInvalid={invalidImg}
          />
          <TextInput
            name='Obtained from'
            isInvalid={invalidFrom}
            invalidWarningText='Box origin should not be empty.'
            value={boxFrom}
            setValue={setBoxFrom}
          />
          <TextInput
            name='Contains'
            isInvalid={invalidContain}
            invalidWarningText='You can use the following text and convert the text to image.'
            value={boxContain}
            setValue={setBoxContain}
          />
          <span>
            You can use the following text and convert the text to image.
          </span>
          <span>
            {
              '{Gold} {Diamond} {Common Dice} {Rare Dice} {Unique Dice} {Legendary Dice} {Dice:Dice Name}'
            }
          </span>
          <hr className='divisor' />
          <SubmitButton
            type='submit'
            submitPromptText='Are you sure to want to update the information for this box?'
            onSubmit={handleSubmit}
          />
          <SubmitButton
            type='delete'
            submitPromptText='Are you sure to want to delete this box?'
            onSubmit={handleDelete}
          />
        </form>
      )}
    </Dashboard>
  );
}
