import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import firebase from 'firebase/app';
import Dashboard, {
  Image,
  NumberInput,
  Selector,
  SubmitButton,
  TextInput,
} from 'components/Dashboard';
import { Battlefield, WikiContent } from 'types/database';
import { fetchWiki } from 'misc/firebase';
import updateImage, { deleteImage } from 'misc/firebase/updateImage';

export default function editBattlefield(): JSX.Element {
  const dispatch = useDispatch();
  const selectRef = useRef(null as null | HTMLSelectElement);
  const database = firebase.database();
  const dbRef = database.ref('/wiki/battlefield');
  const [battlefieldInfo, setBattlefieldInfo] = useState<
    WikiContent['battlefield']
  >([]);
  const [battlefieldId, setBattlefieldId] = useState<Battlefield['id']>();
  const [battlefieldName, setBattlefieldName] = useState<Battlefield['name']>(
    ''
  );
  const [battlefieldImg, setBattlefieldImg] = useState<Battlefield['img']>('');
  const [battlefieldSource, setBattlefieldSource] = useState<
    Battlefield['source']
  >('');
  const [battlefieldDesc, setBattlefieldDesc] = useState<Battlefield['desc']>(
    ''
  );
  const [battlefieldBuffName, setBattlefieldBuffName] = useState<
    Battlefield['buffName']
  >('');
  const [battlefieldBuffValue, setBattlefieldBuffValue] = useState<
    Battlefield['buffValue']
  >(0);
  const [battlefieldBuffUnit, setBattlefieldBuffUnit] = useState<
    Battlefield['buffUnit']
  >('');
  const [battlefieldCupValue, setBattlefieldCupValue] = useState<
    Battlefield['buffCupValue']
  >(0);

  useEffect(() => {
    dbRef
      .once('value')
      .then(snapshot => setBattlefieldInfo(snapshot.val() || []));
  }, []);

  useEffect(() => {
    const battlefield = battlefieldInfo?.find(b => b.id === battlefieldId);
    setBattlefieldName(battlefield?.name ?? '');
    setBattlefieldBuffName(battlefield?.buffName ?? '');
    setBattlefieldBuffUnit(battlefield?.buffUnit ?? '');
    setBattlefieldBuffValue(battlefield?.buffValue ?? 0);
    setBattlefieldCupValue(battlefield?.buffCupValue ?? 0);
    setBattlefieldImg(battlefield?.img ?? '');
    setBattlefieldDesc(battlefield?.desc ?? '');
    setBattlefieldSource(battlefield?.source ?? '');
  }, [battlefieldId]);

  const invalidName = !battlefieldName?.length;
  const invalidImg = !battlefieldImg?.length;
  const invalidSource = !battlefieldImg?.length;
  const invalidBuffName = !battlefieldBuffName?.length;
  const invalidInput =
    invalidName || invalidImg || invalidSource || invalidBuffName;

  const update = async (newBattlefields: Battlefield[]): Promise<void> => {
    database.ref('/last_updated/wiki').set(new Date().toISOString());
    dbRef.set(newBattlefields);
    fetchWiki(dispatch);
    setBattlefieldInfo(newBattlefields);
    setBattlefieldId(-1);
    if (selectRef.current) {
      selectRef.current.value = '?';
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (typeof battlefieldId === 'undefined' || invalidInput) return;
    const oldBattlefield = battlefieldInfo.find(
      battlefield => battlefield.id === battlefieldId
    );
    const battlefield: Battlefield = {
      id: battlefieldId,
      name: battlefieldName.trim(),
      desc: battlefieldDesc.trim(),
      img: battlefieldImg,
      source: battlefieldSource.trim(),
      buffName: battlefieldBuffName.trim(),
      buffValue: battlefieldBuffValue,
      buffUnit: battlefieldBuffUnit.trim(),
      buffCupValue: battlefieldCupValue,
    };
    battlefield.img = await updateImage(
      battlefieldImg,
      'Battlefield Images',
      battlefieldName,
      oldBattlefield?.name
    );

    const result = battlefieldInfo.map(b =>
      b.id === battlefield.id ? battlefield : b
    );
    if (!result.some(b => b.id === battlefield.id)) {
      result.push(battlefield);
    }
    await update(result);
  };

  const handleDelete = async (): Promise<void> => {
    const oldBattlefield = battlefieldInfo.find(
      battlefield => battlefield.id === battlefieldId
    );
    if (oldBattlefield) {
      await deleteImage('Battlefield Images', oldBattlefield.name);
      const result = battlefieldInfo.filter(
        battlefield => battlefield.id !== battlefieldId
      );
      await update(result);
    }
  };

  return (
    <Dashboard className='battlefield' isDataReady={!!battlefieldInfo.length}>
      <h3>Update Battlefield Information</h3>
      <Selector
        name='Battlefield'
        selectRef={selectRef}
        data={battlefieldInfo}
        setActive={setBattlefieldId}
      />
      {typeof battlefieldId !== 'undefined' && (
        <form onSubmit={(evt): void => evt.preventDefault()}>
          <TextInput
            name='Name'
            isInvalid={invalidName}
            value={battlefieldName}
            setValue={setBattlefieldName}
            invalidWarningText='Battlefield Name should not be empty.'
          />
          <Image
            isInvalid={invalidImg}
            src={battlefieldImg}
            alt='battlefield'
            setSrc={setBattlefieldImg}
          />
          <TextInput
            name='Obtained from'
            isInvalid={invalidSource}
            value={battlefieldSource}
            setValue={setBattlefieldSource}
            invalidWarningText='Battlefield obtained source should not be empty.'
          />
          <TextInput
            name='Buff Name'
            isInvalid={invalidBuffName}
            value={battlefieldBuffName}
            setValue={setBattlefieldBuffName}
            invalidWarningText='Battlefield Buff Name should not be empty.'
          />
          <NumberInput
            name='Buff Value'
            value={battlefieldBuffValue}
            setValue={setBattlefieldBuffValue}
          />
          <TextInput
            name='Buff Unit'
            value={battlefieldBuffUnit}
            setValue={setBattlefieldBuffUnit}
          />
          <NumberInput
            name='Class Up Buff Value'
            value={battlefieldCupValue}
            setValue={setBattlefieldCupValue}
          />
          <TextInput
            type='rich-text'
            toolbar='basic'
            value={battlefieldDesc}
            setValue={setBattlefieldDesc}
          />

          <hr className='divisor' />
          <SubmitButton
            isInvalid={invalidInput}
            type='submit'
            submitPromptText='Are you sure to want to update the information for this battlefield?'
            onSubmit={handleSubmit}
          />
          <SubmitButton
            type='delete'
            submitPromptText='Are you sure to want to delete this battlefield?'
            onSubmit={handleDelete}
          />
        </form>
      )}
    </Dashboard>
  );
}
