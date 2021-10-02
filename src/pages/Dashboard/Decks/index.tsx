import React, { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import firebase from 'firebase/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencilAlt,
  faTrashAlt,
  faCheck,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import Dashboard from 'components/Dashboard';
import LoadingScreen from 'components/Loading';
import Dice from 'components/Dice';
import { ConfirmedSubmitNotification, popupContext } from 'components/PopUp';
import { fetchDecks } from 'misc/firebase';
import { Battlefield, Deck, DeckGuides, DeckList, Die } from 'types/database';
import useRootStateSelector from '@redux';
import FilterForm, { FilterContext, useDeckFilter } from 'components/Filter';
import AddDeckPopup from './AddDeckPopup';

function DeckRow({
  deckInfo,
  setActiveEdit,
  guides,
  battlefields,
}: {
  deckInfo: Deck;
  setActiveEdit: (deckInfo: Deck) => void;
  guides: DeckGuides;
  battlefields: Battlefield[];
}): JSX.Element {
  return (
    <>
      <td>{deckInfo.rating.default}</td>
      <td>{deckInfo.rating.c8}</td>
      <td>{deckInfo.rating.c9}</td>
      <td>{deckInfo.rating.c10}</td>
      <td>{deckInfo.type}</td>
      <td>
        {deckInfo.decks.map((deck, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className='deck-container' key={i}>
            {deck.map(die => (
              <Dice die={die} key={die} />
            ))}
          </div>
        ))}
      </td>
      <td>
        {
          battlefields.find(
            battlefield => battlefield.id === deckInfo.battlefield
          )?.name
        }
      </td>
      <td>
        <div className='deck-guide-labels'>
          {deckInfo.guide.map((guide, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i}>
              {guides.find(g => g.id === guide)?.name || 'Auto Detect'}
            </div>
          ))}
        </div>
      </td>
      <td>
        <button
          type='button'
          disabled={deckInfo.id < 0}
          onClick={(): void => setActiveEdit(deckInfo)}
        >
          <FontAwesomeIcon icon={faPencilAlt} />
        </button>
      </td>
    </>
  );
}

const MemoRow = React.memo(DeckRow);

export default function updateDeck(): JSX.Element {
  const dispatch = useDispatch();
  const database = firebase.database();
  const { openPopup } = useContext(popupContext);
  const { dice, wiki } = useRootStateSelector('fetchFirebaseReducer');
  const { deckType, legendaryOwned, customSearch } = useContext(FilterContext);
  const [decks, setDecks] = useState<DeckList>([]);
  const [guides, setGuides] = useState<DeckGuides>([]);
  const [deckToDelete, setDeckToDelete] = useState({
    id: -1,
    dice: [[]] as Die['id'][][],
  });

  const initialEditState = {
    id: -1,
    rating: {
      default: 0,
    } as Deck['rating'],
    type: '-',
    decks: [[]],
    guide: [-1],
    battlefield: -1,
  } as Deck;
  const [activeEdit, setActiveEdit] = useState({ ...initialEditState });
  const invalidRating = !Object.values(activeEdit.rating).every(
    rating => typeof rating === 'undefined' || (rating >= 0 && rating <= 10)
  );
  const filteredDeck = useDeckFilter(decks);

  useEffect(() => {
    database
      .ref('/decks')
      .once('value')
      .then(snapshot => setDecks(snapshot.val()));
    database
      .ref('/decks_guide')
      .once('value')
      .then(snapshot => setGuides(snapshot.val()));
  }, []);

  const sortDecksAndUpdate = async (deckList: DeckList): Promise<void> => {
    deckList.sort((a, b) => {
      if (a.rating.default > b.rating.default) {
        return -1;
      }
      if (a.rating.default < b.rating.default) {
        return 1;
      }
      if (a.rating.default === b.rating.default) {
        if (a.id > b.id) {
          return 1;
        }
        return -1;
      }
      return 0;
    });
    await Promise.all([
      database.ref('/last_updated/decks').set(new Date().toISOString()),
      database.ref('/decks').set([...deckList]),
    ]);
    setDecks([...deckList]);
    fetchDecks(dispatch);
  };

  const updateDecks = async (): Promise<void> => {
    const updated = decks.map(deck =>
      deck.id === activeEdit.id ? activeEdit : deck
    );
    await sortDecksAndUpdate([...updated]);
    setActiveEdit({ ...initialEditState });
  };

  const deleteDeck = async (): Promise<void> => {
    const deleted = decks.filter(deck => deck.id !== deckToDelete.id);
    await sortDecksAndUpdate([...deleted]);
    setDeckToDelete({ id: -1, dice: [[]] as Die['id'][][] });
  };

  if (!dice?.length || !decks?.length || !wiki?.battlefield?.length) {
    return (
      <Dashboard>
        <LoadingScreen />
      </Dashboard>
    );
  }

  const invalidRatingPrompt = (
    <>
      <h3>Error</h3>
      <p>
        You need to fix the following errors before you can save your updated
        deck onto the database.
      </p>
      <span className='invalid-warning'>Invalid Rating Input.</span>
    </>
  );

  return (
    <Dashboard className='deck'>
      <h3>Update Deck List</h3>
      <p>
        To Edit the decks, press the edit button, once you are done editing,
        press the button again to save the data to the database.
      </p>
      <label htmlFor='add-deck'>
        Add a Deck :{' '}
        <button
          type='button'
          onClick={(): void => {
            openPopup(
              <AddDeckPopup
                sortDecksAndUpdate={sortDecksAndUpdate}
                decks={decks}
                guides={guides}
              />
            );
          }}
        >
          <FontAwesomeIcon icon={faPlusCircle} />
        </button>
      </label>
      {invalidRating ? (
        <span className='invalid-warning'>Invalid Rating Input.</span>
      ) : null}
      <hr className='divisor' />
      <h4>Filter</h4>
      <FilterForm withOptionalDeckType />
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Rating C7</th>
              <th>Rating C8</th>
              <th>Rating C9</th>
              <th>Rating C10</th>
              <th>Type</th>
              <th>Deck</th>
              <th>Battlefield</th>
              <th>Associated Deck Guide</th>
              <th>Toggle Edit</th>
              <th>Remove Deck</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeck
              .filter(
                deckInfo =>
                  (deckType === '?' ||
                    deckType === deckInfo.type.toLowerCase()) &&
                  deckInfo.decks.some(deck =>
                    deck.every(die =>
                      dice.find(d => d.id === die)?.rarity === 'Legendary'
                        ? legendaryOwned.includes(die)
                        : true
                    )
                  ) &&
                  (customSearch === -1
                    ? true
                    : deckInfo.decks.some(deck => deck.includes(customSearch)))
              )
              .concat(
                Array(9)
                  .fill(-10)
                  .map((i, j) => ({
                    id: i - j,
                    rating: {
                      default: 0,
                    },
                    type: '-',
                    decks: [[]],
                    guide: [-1],
                    battlefield: -1,
                  }))
              )
              .filter((deck, i) => !(deck.id < 0 && i > 8))
              .map(deckInfo => (
                <tr key={deckInfo.id}>
                  <td>{deckInfo.id < 0 ? '-' : deckInfo.id}</td>
                  {activeEdit.id === deckInfo.id ? (
                    <>
                      {['default', 'c8', 'c9', 'c10'].map(ratingType => (
                        <td key={ratingType}>
                          <input
                            type='number'
                            min={0}
                            max={10}
                            step={0.25}
                            defaultValue={
                              deckInfo.rating[
                                ratingType as keyof Deck['rating']
                              ]
                            }
                            className={invalidRating ? 'invalid' : ''}
                            onChange={(evt): void => {
                              const clone = {
                                ...activeEdit,
                              };
                              const cloneRating = {
                                ...clone.rating,
                              };
                              cloneRating[
                                ratingType as keyof Deck['rating']
                              ] = Number(evt.target.value);
                              clone.rating = cloneRating;
                              setActiveEdit(clone);
                            }}
                          />
                        </td>
                      ))}
                      <td>
                        <select
                          defaultValue={deckInfo.type}
                          onChange={(evt): void => {
                            const clone = {
                              ...activeEdit,
                            };
                            clone.type = evt.target.value as
                              | 'PvP'
                              | 'Co-op'
                              | 'Crew';
                            setActiveEdit(clone);
                          }}
                        >
                          <option>PvP</option>
                          <option>Co-op</option>
                          <option>Crew</option>
                        </select>
                      </td>
                      <td>
                        {deckInfo.decks.map((deck, i) => (
                          <div
                            className='edit-container'
                            // eslint-disable-next-line react/no-array-index-key
                            key={i}
                          >
                            {deck.map((die, j) => (
                              <select
                                // eslint-disable-next-line react/no-array-index-key
                                key={`${i}-${j}`}
                                defaultValue={die}
                                onChange={(evt): void => {
                                  const clone = {
                                    ...activeEdit,
                                  };
                                  clone.decks = clone.decks.map(
                                    (clonedDeck, ii) => {
                                      if (ii === i) {
                                        return clonedDeck.map(
                                          (cloneDie, jj) => {
                                            if (jj === j) {
                                              return Number(evt.target.value);
                                            }
                                            return cloneDie;
                                          }
                                        );
                                      }
                                      return clonedDeck;
                                    }
                                  );
                                  setActiveEdit(clone);
                                }}
                              >
                                {dice
                                  .filter(d => {
                                    const findExisted = activeEdit.decks[
                                      i
                                    ].findIndex(dieId => dieId === d.id);
                                    return (
                                      findExisted === -1 || findExisted === j
                                    );
                                  })
                                  .map(d => (
                                    <option
                                      value={d.id}
                                      // eslint-disable-next-line react/no-array-index-key
                                      key={`${i}-${j}-${d.id}`}
                                    >
                                      {d.name}
                                    </option>
                                  ))}
                              </select>
                            ))}
                          </div>
                        ))}
                      </td>
                      <td>
                        <select
                          defaultValue={deckInfo.battlefield}
                          disabled={activeEdit.type === 'Crew'}
                          onChange={(evt): void => {
                            const clone = {
                              ...activeEdit,
                            };
                            clone.battlefield = Number(evt.target.value);
                            setActiveEdit(clone);
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
                      <td>
                        {deckInfo.guide.map((guideId, i) => (
                          <select
                            // eslint-disable-next-line react/no-array-index-key
                            key={i}
                            defaultValue={guideId}
                            onChange={(evt): void => {
                              const clone = {
                                ...activeEdit,
                              };
                              clone.guide = clone.guide.map(
                                (clonedGuideId, ii) =>
                                  ii === i
                                    ? Number(evt.target.value)
                                    : clonedGuideId
                              );
                              setActiveEdit(clone);
                            }}
                          >
                            <option value={-1}>Auto Detect</option>
                            {guides.map(guide => (
                              <option key={guide.id} value={guide.id}>
                                {guide.name}
                              </option>
                            ))}
                          </select>
                        ))}
                      </td>
                      <td>
                        <button
                          type='button'
                          onClick={(): void => {
                            if (
                              activeEdit.rating.default !==
                                deckInfo.rating.default ||
                              activeEdit.rating.c8 !== deckInfo.rating.c8 ||
                              activeEdit.rating.c9 !== deckInfo.rating.c9 ||
                              activeEdit.rating.c10 !== deckInfo.rating.c10 ||
                              activeEdit.battlefield !== deckInfo.battlefield ||
                              activeEdit.decks.some((editedDeck, i) =>
                                editedDeck.some(
                                  (editedDie, j) =>
                                    editedDie !== deckInfo.decks[i][j]
                                )
                              ) ||
                              activeEdit.guide.some(
                                (guide, i) => guide !== deckInfo.guide[i]
                              )
                            ) {
                              if (invalidRating) {
                                openPopup(invalidRatingPrompt);
                              } else {
                                updateDecks();
                              }
                            } else {
                              setActiveEdit({
                                ...initialEditState,
                              });
                            }
                          }}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <MemoRow
                      deckInfo={deckInfo}
                      setActiveEdit={setActiveEdit}
                      guides={guides}
                      battlefields={wiki.battlefield}
                    />
                  )}
                  <td>
                    <button
                      disabled={deckInfo.id < 0}
                      type='button'
                      onClick={(): void => {
                        setDeckToDelete({
                          id: deckInfo.id,
                          dice: deckInfo.decks,
                        });
                        openPopup(
                          <ConfirmedSubmitNotification
                            promptText='Are you sure you want to delete this deck?'
                            confirmHandler={deleteDeck}
                          >
                            {deckToDelete.dice.map((deck, i) => (
                              // eslint-disable-next-line react/no-array-index-key
                              <div key={i}>
                                {deck.map(die => (
                                  <Dice key={die} die={die} />
                                ))}
                              </div>
                            ))}
                          </ConfirmedSubmitNotification>
                        );
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Dashboard>
  );
}
