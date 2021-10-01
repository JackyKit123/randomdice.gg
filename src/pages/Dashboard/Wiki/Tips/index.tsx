import React, { useState, useEffect, useRef, useContext } from 'react';
import { useDispatch } from 'react-redux';
import firebase from 'firebase/app';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import Dashboard from '@components/Dashboard';
import LoadingScreen from '@components/Loading';
import { ConfirmedSubmitNotification, popupContext } from '@components/PopUp';
import { Guide } from 'types/database';
import { fetchWiki } from 'misc/firebase';
import MyUploadAdapter from 'misc/ckeditorUploadAdapter';

export default function editGuides(): JSX.Element {
  const dispatch = useDispatch();
  const { openPopup } = useContext(popupContext);
  const selectRef = useRef(null as null | HTMLSelectElement);
  const database = firebase.database();
  const dbRef = database.ref('/wiki/tips');
  const [guides, setGuides] = useState<Guide[]>();

  const initialState = {
    id: -1,
    level: 'Beginners' as Guide['level'],
    title: '',
    content: '',
  };
  const [activeEdit, setActiveEdit] = useState({ ...initialState });

  useEffect(() => {
    dbRef.once('value').then(snapshot => setGuides(snapshot.val()));
  }, []);

  if (!guides) {
    return (
      <Dashboard>
        <LoadingScreen />
      </Dashboard>
    );
  }

  const emptyTitle = activeEdit.title.length <= 0;
  const invalidTitleChar = /(;|\/|\?|:|@|=|&)/.test(activeEdit.title);

  const handleSubmit = async (): Promise<void> => {
    if (activeEdit) {
      let updateGuides = false;
      const result = guides.map(guide => {
        if (guide.id === activeEdit.id) {
          updateGuides = true;
          return activeEdit;
        }
        return guide;
      });
      if (!updateGuides) {
        result.push(activeEdit);
      }
      database.ref('/last_updated/wiki').set(new Date().toISOString());
      dbRef.set(result);
      fetchWiki(dispatch);
      setGuides(result);
      setActiveEdit({ ...initialState });
      if (selectRef.current) {
        selectRef.current.value = '?';
      }
    }
  };

  const handleDelete = async (): Promise<void> => {
    const originalGuides = guides.find(guide => guide.id === activeEdit.id);
    if (originalGuides) {
      const result = guides.filter(guide => guide.id !== activeEdit.id);
      database.ref('/last_updated/wiki').set(new Date().toISOString());
      dbRef.set(result);
      fetchWiki(dispatch);
      setGuides(result);
      setActiveEdit({ ...initialState });
      if (selectRef.current) {
        selectRef.current.value = '?';
      }
    }
  };

  return (
    <Dashboard className='guide'>
      <h3>Update Guide Information</h3>
      <label htmlFor='select-guides'>
        Select A Guide:
        <select
          ref={selectRef}
          id='select-guides'
          onChange={(evt): void => {
            if (evt.target.value === '?') {
              setActiveEdit({ ...initialState });
            } else {
              const foundGuides = guides.find(
                guide => guide.title === evt.target.value
              );
              if (foundGuides) {
                setActiveEdit({ ...foundGuides });
              } else {
                guides.sort((a, b) => b.id - a.id);
                let newId = guides.findIndex((guide, i) => guide.id !== i);
                if (newId === -1) {
                  newId = guides.length;
                }
                const clone = { ...initialState };
                clone.id = newId;
                setActiveEdit(clone);
              }
            }
          }}
        >
          <option>?</option>
          {guides.map(guide => (
            <option key={guide.id}>{guide.title}</option>
          ))}
          <option>Add a New Tip</option>
        </select>
      </label>
      {activeEdit.id < 0 ? null : (
        <>
          <form onSubmit={(evt): void => evt.preventDefault()}>
            <label htmlFor='guides-image'>
              Title:
              <input
                defaultValue={activeEdit.title}
                key={`guides${activeEdit.id}-title`}
                type='text'
                className={invalidTitleChar || emptyTitle ? 'invalid' : ''}
                onChange={(evt): void => {
                  activeEdit.title = evt.target.value;
                  setActiveEdit({ ...activeEdit });
                }}
              />
            </label>
            {emptyTitle ? (
              <div className='invalid-warning'>Title cannot be empty.</div>
            ) : null}
            {invalidTitleChar ? (
              <div className='invalid-warning'>
                You entered an invalid character, <strong>; / ? : @ = &</strong>{' '}
                are forbidden characters
              </div>
            ) : null}
            <label htmlFor='guides-level'>
              Level:
              <select
                defaultValue={activeEdit.level}
                onChange={(evt): void => {
                  activeEdit.level = evt.target.value as
                    | 'Beginners'
                    | 'Intermediate'
                    | 'Advanced';
                  setActiveEdit({ ...activeEdit });
                }}
              >
                <option>Beginners</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>
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
              data={activeEdit.content}
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
                activeEdit.content = editor.getData();
                setActiveEdit({
                  ...activeEdit,
                });
              }}
            />
          </form>
          <hr className='divisor' />
          <button
            disabled={invalidTitleChar || emptyTitle}
            type='button'
            className='submit'
            onClick={(): void =>
              openPopup(
                <ConfirmedSubmitNotification
                  promptText='Are you sure to want to update the information for this guide?'
                  confirmHandler={handleSubmit}
                />
              )
            }
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
          <button
            disabled={invalidTitleChar || emptyTitle}
            type='button'
            className='submit'
            onClick={(): void =>
              openPopup(
                <ConfirmedSubmitNotification
                  promptText='Are you sure to want to delete this guide?'
                  confirmHandler={handleDelete}
                />
              )
            }
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </>
      )}
    </Dashboard>
  );
}
