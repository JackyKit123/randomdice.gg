import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import firebase from 'firebase/app';
import Dashboard, { SubmitButton, TextInput } from 'components/Dashboard';
import { fetchNews } from 'misc/firebase';

export default function editPatchNote(): JSX.Element {
  const dispatch = useDispatch();
  const database = firebase.database();
  const dbRef = database.ref('/news');
  const [gameNews, setGameNews] = useState('');
  const [websiteNews, setWebsiteNews] = useState('');

  useEffect(() => {
    dbRef.once('value').then(snapshot => {
      const data = snapshot.val();
      setGameNews(data.game);
      setWebsiteNews(data.website);
    });
  }, []);

  const handleSubmit = async (): Promise<void> => {
    await Promise.all([
      database.ref('/last_updated/news').set(new Date().toISOString()),
      dbRef.set({
        game: gameNews,
        website: websiteNews,
      }),
    ]);
    fetchNews(dispatch);
  };

  return (
    <Dashboard className='news' isDataReady={!!gameNews && !!websiteNews}>
      <h3>Update Game News</h3>
      <TextInput
        type='rich-text'
        value={gameNews}
        setValue={setGameNews}
        toolbar='with-image'
      />
      <h3>Update Website News</h3>
      <TextInput
        type='rich-text'
        value={websiteNews}
        setValue={setWebsiteNews}
        toolbar='with-image'
      />
      <SubmitButton
        submitPromptText='Are you sure to want to update the news?'
        onSubmit={handleSubmit}
        type='submit'
      />
    </Dashboard>
  );
}
