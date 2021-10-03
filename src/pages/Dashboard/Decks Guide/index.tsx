import React, { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import firebase from 'firebase/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencilAlt,
  faTrashAlt,
  faCheck,
  faPlusCircle,
  faUndo,
  faArchive,
  faBoxOpen,
} from '@fortawesome/free-solid-svg-icons';
import Dashboard from 'components/Dashboard';
import Dice from 'components/Dice';
import useRootStateSelector from '@redux';
import { ConfirmedSubmitNotification, popupContext } from 'components/PopUp';
import { fetchDecksGuide } from 'misc/firebase';
import { DeckGuide, DeckGuides } from 'types/database';

export default function updateDecksGuide(): JSX.Element {
  const dispatch = useDispatch();
  const database = firebase.database();
  const dbRef = database.ref('/decks_guide');
  const { dice, wiki } = useRootStateSelector('fetchFirebaseReducer');
  const [guides, setGuides] = useState<DeckGuides>();
  const [activeEdit, setActiveEdit] = useState<DeckGuide>();
  const [guideToArchive, setGuideToArchive] = useState<number>();
  const [invalidGuideName, setInvalidGuideName] = useState(false);
  const { openPopup } = useContext(popupContext);

  useEffect(() => {
    dbRef.once('value').then(snapshot => setGuides(snapshot.val()));
  }, []);

  const confirmSubmit = async (): Promise<void> => {
    if (activeEdit && guides) {
      const clone = [...guides];
      clone.sort((a, b) => b.id - a.id);
      const i = clone.findIndex(guide => guide.id === activeEdit?.id);
      if (i === -1) {
        clone.push(activeEdit);
      } else {
        clone[i] = activeEdit;
      }
      setGuides(clone);
      await Promise.all([
        database.ref('/last_updated/decks_guide').set(new Date().toISOString()),
        dbRef.set(clone),
      ]);
      fetchDecksGuide(dispatch);
      setActiveEdit(undefined);
    }
  };

  const confirmArchive = async (): Promise<void> => {
    const archiveTarget = guides?.find(guide => guide.id === guideToArchive);
    if (archiveTarget) {
      archiveTarget.archived = !archiveTarget.archived;
      const newGuides = guides?.map(guide =>
        guide.id === guideToArchive ? archiveTarget : guide
      );
      setGuideToArchive(undefined);
      setGuides(newGuides);
      await Promise.all([
        database.ref('/last_updated/decks_guide').set(new Date().toISOString()),
        dbRef.set(newGuides),
      ]);
      fetchDecksGuide(dispatch);
    }
  };

  return (
    <Dashboard
      className='decks-guide'
      isDataReady={
        !!(guides?.length && dice?.length && wiki?.battlefield?.length)
      }
    >
      <p>
        To update a written deck guide, press the pencil button to navigate into
        the editor screen, once the you can update the deck of the guide. Once
        you are done, hit save and the deck guide will immediately go live.
      </p>
      {activeEdit ? (
        <table className='editing'>
          <tbody>
            <tr>
              <td colSpan={4}>
                <input
                  type='textbox'
                  className={invalidGuideName ? 'invalid' : ''}
                  defaultValue={activeEdit.name}
                  onChange={(evt): void => {
                    if (/(;|\/|\?|:|@|=|&)/.test(evt.target.value)) {
                      setInvalidGuideName(true);
                    } else {
                      if (invalidGuideName) {
                        setInvalidGuideName(false);
                      }
                      activeEdit.name = evt.target.value;

                      setActiveEdit({
                        ...activeEdit,
                      });
                    }
                  }}
                />
                {invalidGuideName ? (
                  <span className='invalid-warning'>
                    You entered an invalid character,{' '}
                    <strong>; / ? : @ = & are</strong>
                    forbidden characters
                  </span>
                ) : null}
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <select
                  defaultValue={activeEdit.type}
                  onChange={(evt): void => {
                    activeEdit.type = evt.target.value as
                      | 'PvP'
                      | 'Co-op'
                      | 'Crew';
                    setActiveEdit({
                      ...activeEdit,
                    });
                  }}
                >
                  <option>PvP</option>
                  <option>Co-op</option>
                  <option>Crew</option>
                </select>
              </td>
              <td colSpan={2}>
                <select
                  disabled={activeEdit.type === 'Crew'}
                  defaultValue={activeEdit.battlefield}
                  onChange={(evt): void => {
                    activeEdit.battlefield = Number(evt.target.value);
                    setActiveEdit({
                      ...activeEdit,
                    });
                  }}
                >
                  <option value={-1}>?</option>
                  {wiki.battlefield.map(battlefield => (
                    <option key={battlefield.id} value={battlefield.id}>
                      {battlefield.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            {activeEdit.diceList.map((dicelist, i) => (
              <tr
                className='dice-container'
                /* eslint-disable-next-line react/no-array-index-key */
                key={`dice-container-${i}`}
              >
                <td colSpan={3}>
                  {dicelist.map((die, j) => (
                    <select
                      /* eslint-disable-next-line react/no-array-index-key */
                      key={`${i}-${j}`}
                      defaultValue={die}
                      onChange={(evt): void => {
                        activeEdit.diceList[i][j] = Number(evt.target.value);
                        setActiveEdit({
                          ...activeEdit,
                        });
                      }}
                    >
                      <option value={-1}>?</option>
                      {dice.map(diceOption => (
                        <option key={diceOption.id} value={diceOption.id}>
                          {diceOption.name}
                        </option>
                      ))}
                    </select>
                  ))}
                </td>
                <td>
                  <button
                    disabled={activeEdit.diceList.length <= 1}
                    type='button'
                    className='archive'
                    onClick={(): void => {
                      activeEdit.diceList.splice(i, 1);
                      setActiveEdit({
                        ...activeEdit,
                      });
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={4}>
                <button
                  type='button'
                  className='add'
                  onClick={(): void => {
                    activeEdit.diceList.push(Array(5).fill('?'));
                    setActiveEdit({
                      ...activeEdit,
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faPlusCircle} />
                </button>
              </td>
            </tr>
            <tr>
              <td colSpan={4}>
                <div className='ckeditor-container'>
                  <CKEditor
                    editor={ClassicEditor}
                    data={activeEdit.guide}
                    config={{
                      removePlugins: ['Heading'],
                      toolbar: [
                        'undo',
                        'redo',
                        '|',
                        'bold',
                        'italic',
                        '|',
                        'link',
                        'mediaembed',
                      ],
                    }}
                    onChange={(
                      _: unknown,
                      editor: {
                        getData: () => string;
                      }
                    ): void => {
                      activeEdit.guide = editor.getData();
                      setActiveEdit({
                        ...activeEdit,
                      });
                    }}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={4}>
                <button
                  type='button'
                  className='submit'
                  disabled={invalidGuideName}
                  onClick={(): void =>
                    openPopup(
                      <ConfirmedSubmitNotification
                        promptText='Are you sure to want to submit this deck guide?'
                        confirmHandler={confirmSubmit}
                      />
                    )
                  }
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
                <button
                  type='button'
                  className='back'
                  onClick={(): void =>
                    openPopup(
                      <ConfirmedSubmitNotification
                        promptText='Are you sure to want to discard the changes your made and go back?'
                        confirmHandler={(): void => setActiveEdit(undefined)}
                      />
                    )
                  }
                >
                  <FontAwesomeIcon icon={faUndo} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <>
          <label htmlFor='add-guide'>
            Add a Deck Guide :{' '}
            <button
              type='button'
              onClick={(): void => {
                if (!guides) return;
                const clone = [...guides];
                clone.sort((a, b) => a.id - b.id);
                let newId = clone.findIndex((guide, i) => guide.id !== i);
                if (newId === -1) {
                  newId = clone.length;
                }
                setActiveEdit({
                  id: newId,
                  type: 'PvP',
                  name: '',
                  diceList: [Array(5).fill('?')],
                  guide: '',
                  battlefield: -1,
                  archived: false,
                });
              }}
            >
              <FontAwesomeIcon icon={faPlusCircle} />
            </button>
          </label>
          <table className='guide-menu'>
            <tbody>
              {guides?.map((guide, i) => (
                <tr key={guide.id} className={guide.archived ? 'archived' : ''}>
                  <td>{guide.type}</td>
                  <td>
                    {guide.name}
                    {guide.archived ? (
                      <>
                        <br />
                        (ARCHIVED)
                      </>
                    ) : null}
                  </td>
                  <td>
                    {guide.diceList.map(dicelist => (
                      <div
                        className='dice-container'
                        /* eslint-disable-next-line react/no-array-index-key */
                        key={`${dicelist.join()}${i}`}
                      >
                        {dicelist.map((die, j) => (
                          <Dice
                            /* eslint-disable-next-line react/no-array-index-key */
                            key={`${dicelist.join()}-${die}${j}`}
                            die={die}
                          />
                        ))}
                      </div>
                    ))}
                    {guide.battlefield > -1 && guide.type !== 'Crew' ? (
                      <div>
                        Battlefield:{' '}
                        {
                          wiki?.battlefield?.find(
                            battlefield => battlefield.id === guide.battlefield
                          )?.name
                        }
                      </div>
                    ) : null}
                  </td>
                  <td>
                    <button
                      type='button'
                      className='edit'
                      onClick={(): void => {
                        setActiveEdit({
                          id: guide.id,
                          type: guide.type,
                          name: guide.name,
                          diceList: guide.diceList,
                          guide: guide.guide,
                          battlefield: guide.battlefield,
                          archived: false,
                        });
                      }}
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                  </td>
                  <td>
                    <button
                      type='button'
                      className='archive'
                      onClick={(): void => {
                        setGuideToArchive(guide.id);
                        openPopup(
                          <ConfirmedSubmitNotification
                            promptText={`Are you sure to want to ${
                              guides.find(g => g.id === guideToArchive)
                                ?.archived
                                ? 'unarchive'
                                : 'archive'
                            } this guide?`}
                            confirmHandler={confirmArchive}
                          />
                        );
                      }}
                    >
                      <FontAwesomeIcon
                        icon={guide.archived ? faBoxOpen : faArchive}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Dashboard>
  );
}
