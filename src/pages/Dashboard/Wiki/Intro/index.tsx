import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import firebase from 'firebase/app';
import Dashboard, { SubmitButton, TextInput } from 'components/Dashboard';
import { WikiContent } from 'types/database';
import { fetchWiki } from 'misc/firebase';
import useUnsavedWarning from 'pages/Dashboard/useUnsavedWarning';

export default function editIntro(): JSX.Element {
  const dispatch = useDispatch();
  const database = firebase.database();
  const [editState, setEditState] = useState<'init' | 'unedited' | 'edited'>(
    'init'
  );
  const dbRef = database.ref('/wiki/intro');
  const [pvpIntro, setPvpIntro] = useState('');
  const [coopIntro, setCoopIntro] = useState('');
  const [crewIntro, setCrewIntro] = useState('');
  const [arenaIntro, setArenaIntro] = useState('');
  const [storeIntro, setStoreIntro] = useState('');

  useEffect(() => {
    dbRef.once('value').then(snapshot => {
      const data: WikiContent['intro'] = snapshot.val();
      setPvpIntro(data.PvP);
      setCoopIntro(data['Co-op']);
      setCrewIntro(data.Crew);
      setArenaIntro(data.Arena);
      setStoreIntro(data.Store);
      setEditState('unedited');
    });
  }, []);

  useEffect(() => {
    if (editState !== 'init') {
      setEditState('edited');
    }
  }, [editState, pvpIntro, coopIntro, crewIntro, arenaIntro, storeIntro]);

  const handleSubmit = async (): Promise<void> => {
    await Promise.all([
      database.ref('/last_updated/wiki').set(new Date().toISOString()),
      dbRef.set({
        PvP: pvpIntro,
        'Co-op': coopIntro,
        Crew: crewIntro,
        Arena: arenaIntro,
        Store: storeIntro,
      }),
    ]);
    fetchWiki(dispatch);
    setEditState('unedited');
  };

  useUnsavedWarning(editState === 'edited');

  return (
    <Dashboard
      className='intro'
      isDataReady={
        !!(pvpIntro && coopIntro && crewIntro && arenaIntro && storeIntro)
      }
    >
      <div className='block'>
        <h3>PvP</h3>
        <TextInput
          type='rich-text'
          toolbar='extra'
          value={pvpIntro}
          setValue={setPvpIntro}
        />
      </div>
      <div className='block'>
        <h3>Co-op</h3>
        <TextInput
          type='rich-text'
          toolbar='extra'
          value={coopIntro}
          setValue={setCoopIntro}
        />
      </div>
      <div className='block'>
        <h3>Crew</h3>
        <TextInput
          type='rich-text'
          toolbar='extra'
          value={crewIntro}
          setValue={setCrewIntro}
        />
      </div>
      <div className='block'>
        <h3>Arena</h3>
        <TextInput
          type='rich-text'
          toolbar='extra'
          value={arenaIntro}
          setValue={setArenaIntro}
        />
      </div>
      <div className='block'>
        <h3>Store</h3>
        <TextInput
          type='rich-text'
          toolbar='extra'
          value={storeIntro}
          setValue={setStoreIntro}
        />
      </div>
      <SubmitButton
        type='submit'
        submitPromptText='Are you sure to want to submit all the content for game introduction?'
        onSubmit={handleSubmit}
      />
    </Dashboard>
  );
}
