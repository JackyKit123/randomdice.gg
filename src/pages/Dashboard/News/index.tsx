import React, { useState, useEffect, Fragment, useContext } from 'react';
import { useDispatch } from 'react-redux';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import firebase from 'firebase/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Dashboard from '@components/Dashboard';
import LoadingScreen from '@components/Loading';
import { ConfirmedSubmitNotification, popupContext } from '@components/PopUp';
import MyUploadAdapter from 'misc/ckeditorUploadAdapter';
import { fetchNews } from 'misc/firebase';

export default function editPatchNote(): JSX.Element {
  const dispatch = useDispatch();
  const { openPopup } = useContext(popupContext);
  const database = firebase.database();
  const dbRef = database.ref('/news');
  const [content, setContent] = useState<{ game: string; website: string }>();

  useEffect(() => {
    dbRef.once('value').then(snapshot => setContent(snapshot.val()));
  }, []);

  if (!content) {
    return (
      <Dashboard>
        <LoadingScreen />
      </Dashboard>
    );
  }

  const handleSubmit = async (): Promise<void> => {
    await Promise.all([
      database.ref('/last_updated/news').set(new Date().toISOString()),
      dbRef.set(content),
    ]);
    fetchNews(dispatch);
  };

  return (
    <Dashboard className='news'>
      {['Game', 'Website'].map(type => (
        <Fragment key={type}>
          <h3>Update {type} News</h3>
          <CKEditor
            editor={ClassicEditor}
            onInit={(editor: {
              plugins: {
                get(
                  arg: 'FileRepository'
                ): {
                  createUploadAdapter(loader: { file: Promise<File> }): void;
                };
              };
            }): void => {
              // eslint-disable-next-line no-param-reassign
              editor.plugins.get('FileRepository').createUploadAdapter = (
                loader
              ): MyUploadAdapter => new MyUploadAdapter(loader);
            }}
            data={content[type.toLowerCase() as 'game' | 'website']}
            config={{
              removePlugins: ['heading'],
              toolbar: [
                'undo',
                'redo',
                '|',
                'bold',
                'italic',
                'numberedList',
                'bulletedList',
                '|',
                'link',
                '|',
                'imageUpload',
                'imageTextAlternative',
                'mediaembed',
              ],
            }}
            onBlur={(
              _: unknown,
              editor: {
                getData: () => string;
              }
            ): void => {
              content[
                type.toLowerCase() as 'game' | 'website'
              ] = editor.getData();
              setContent({ ...content });
            }}
          />
        </Fragment>
      ))}
      <button
        type='button'
        className='submit'
        onClick={(): void => {
          openPopup(
            <ConfirmedSubmitNotification
              promptText='Are you sure to want to update the news?'
              confirmHandler={handleSubmit}
            />
          );
        }}
      >
        <FontAwesomeIcon icon={faCheck} />
      </button>
    </Dashboard>
  );
}
