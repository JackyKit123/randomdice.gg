import React, { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import firebase from 'firebase/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Dashboard from '@components/Dashboard';
import LoadingScreen from '@components/Loading';
import { ConfirmedSubmitNotification, popupContext } from '@components/PopUp';
import { WikiContent } from 'types/database';
import { fetchWiki } from 'misc/firebase';

export default function editIntro(): JSX.Element {
  const dispatch = useDispatch();
  const { openPopup } = useContext(popupContext);
  const database = firebase.database();
  const dbRef = database.ref('/wiki/intro');
  const [content, setContent] = useState<WikiContent['intro']>();

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
    await database.ref('/last_updated/wiki').set(new Date().toISOString());
    await dbRef.set(content);
    fetchWiki(dispatch);
  };

  return (
    <Dashboard className='intro'>
      {['PvP', 'Co-op', 'Crew', 'Arena', 'Store'].map(type => (
        <div className='block' key={type}>
          <h3>{type}</h3>
          <CKEditor
            editor={ClassicEditor}
            data={content[type as 'PvP' | 'Co-op' | 'Crew']}
            config={{
              heading: {
                options: [
                  {
                    model: 'paragraph',
                    title: 'Paragraph',
                    class: 'content p',
                  },
                  {
                    model: 'heading3',
                    view: 'h3',
                    title: 'Heading 3',
                    class: 'content h3',
                  },
                  {
                    model: 'heading4',
                    view: 'h4',
                    title: 'Heading 4',
                    class: 'content h4',
                  },
                ],
              },
              toolbar: [
                'heading',
                '|',
                'undo',
                'redo',
                '|',
                'bold',
                'italic',
                'numberedList',
                'bulletedList',
                '|',
                'link',
              ],
            }}
            onBlur={(
              _: unknown,
              editor: {
                getData: () => string;
              }
            ): void => {
              content[type as 'PvP' | 'Co-op' | 'Crew'] = editor.getData();
              setContent({
                ...content,
              });
            }}
          />
        </div>
      ))}
      <button
        type='button'
        className='submit'
        onClick={(): void =>
          openPopup(
            <ConfirmedSubmitNotification
              promptText='Are you sure to want to submit all the content for game introduction?'
              confirmHandler={handleSubmit}
            />
          )
        }
      >
        <FontAwesomeIcon icon={faCheck} />
      </button>
    </Dashboard>
  );
}
