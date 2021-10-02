import { popupContext } from 'components/PopUp';
import React, { useContext, useState } from 'react';
import useRootStateSelector from '@redux';
import { Deck, DeckGuides, DeckList, Die } from 'types/database';

interface Props {
  decks: DeckList;
  guides: DeckGuides;
  sortDecksAndUpdate: (decks: DeckList) => Promise<void>;
}

export default function AddDeckPopup({
  decks,
  guides,
  sortDecksAndUpdate,
}: Props): JSX.Element {
  const {
    wiki: { battlefield: battlefields },
    dice,
  } = useRootStateSelector('fetchFirebaseReducer');
  const { closePopup } = useContext(popupContext);
  const initialNewDeckState = {
    id: -1,
    rating: {
      default: 0,
    } as Deck['rating'],
    type: 'PvP' as 'PvP' | 'Co-op' | 'Co-op (Solo)' | 'Co-op (Pair)' | 'Crew',
    decks: [[0, 1, 2, 3, 4]] as Die['id'][][],
    guide: [-1],
    battlefield: -1,
  };
  const [deckToAdd, setDeckToAdd] = useState(initialNewDeckState);
  const invalidRatingToAdd = !Object.values(deckToAdd.rating).every(
    rating => typeof rating === 'undefined' || (rating >= 0 && rating <= 10)
  );

  const addDeck = async (): Promise<void> => {
    const clone = {
      ...deckToAdd,
    };
    if (invalidRatingToAdd) {
      return;
    }
    decks.sort((a, b) => (a.id > b.id ? 1 : -1));
    const newId = decks.findIndex((deck, i) => deck.id - 1 !== i);
    if (newId === -1) {
      clone.id = decks.length + 1;
    } else {
      clone.id = newId + 1;
    }
    if (clone.type === 'Co-op (Pair)' || clone.type === 'Co-op (Solo)') {
      clone.type = 'Co-op';
    }
    sortDecksAndUpdate([...decks, clone as Deck]);
    closePopup();
  };

  return (
    <div className='add-deck'>
      <h3>Add A Deck</h3>
      <form onSubmit={(evt): void => evt.preventDefault()}>
        {['default', 'c8', 'c9', 'c10'].map(ratingType => (
          <label htmlFor={`${ratingType}-rating`} key={ratingType}>
            <div>
              {ratingType === 'default' ? 'Default' : 'Optional'} Rating
            </div>
            <div>
              {
                ({
                  default: '(c7 Legends, < 600%)',
                  c8: '(c8 Legends, 600% - 900%)',
                  c9: '(c9 Legends, 900% - 1200%)',
                  c10: '(c10+ Legends, > 1200%)',
                } as { [key: string]: string })[ratingType]
              }
            </div>
            <input
              defaultValue={ratingType === 'default' ? 0 : undefined}
              type='number'
              min={0}
              max={10}
              step={0.25}
              className={invalidRatingToAdd ? 'invalid' : ''}
              onChange={(evt): void => {
                const clone = {
                  ...deckToAdd,
                };
                clone.rating[ratingType as keyof Deck['rating']] = Number(
                  evt.target.value
                );
                setDeckToAdd(clone);
              }}
            />
          </label>
        ))}
        <label htmlFor='deck-type'>
          Deck Type:{' '}
          <select
            defaultValue='PvP'
            onChange={(evt): void => {
              const clone = {
                ...deckToAdd,
              };
              clone.type = evt.target.value as
                | 'PvP'
                | 'Co-op (Solo)'
                | 'Co-op (Pair)'
                | 'Crew';
              if (clone.type === 'Co-op (Pair)') {
                clone.decks = [...clone.decks, [0, 1, 2, 3, 4]];
              } else {
                clone.decks = [...clone.decks];
              }
              setDeckToAdd(clone);
            }}
          >
            <option>PvP</option>
            <option>Co-op (Solo)</option>
            <option>Co-op (Pair)</option>
            <option>Crew</option>
          </select>
        </label>
        {deckToAdd.type === 'Crew' ? null : (
          <label htmlFor='battlefield'>
            Battlefield:{' '}
            <select
              defaultValue={-1}
              onChange={(evt): void => {
                const clone = {
                  ...deckToAdd,
                };
                clone.battlefield = Number(evt.target.value);
                setDeckToAdd(clone);
              }}
            >
              <option value={-1}>?</option>
              {battlefields.map(battlefield => (
                <option key={battlefield.id} value={battlefield.id}>
                  {battlefield.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <label htmlFor='dice-list'>
          Dice List:{' '}
          <div>
            {Array(5)
              .fill('')
              .map((_, i) => (
                <select
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  defaultValue={i}
                  onChange={(evt): void => {
                    const clone = {
                      ...deckToAdd,
                    };
                    clone.decks[0][i] = Number(evt.target.value);
                    setDeckToAdd(clone);
                  }}
                >
                  {dice
                    .filter(
                      die =>
                        !deckToAdd.decks[0].find(
                          (dieId, j) => dieId === die.id && i !== j
                        )
                    )
                    .map(die => (
                      <option value={die.id} key={die.id}>
                        {die.name}
                      </option>
                    ))}
                </select>
              ))}
          </div>
        </label>
        <label htmlFor='associated-guide'>
          Associated Deck Guide:{' '}
          <select
            defaultValue='PvP'
            onChange={(evt): void => {
              const clone = {
                ...deckToAdd,
              };
              clone.guide[0] = Number(evt.target.value);
              setDeckToAdd(clone);
            }}
          >
            <option value={-1}>Auto detect</option>
            {guides.map(guide => (
              <option key={guide.id} value={guide.id}>
                {guide.name}
              </option>
            ))}
          </select>
        </label>
        {deckToAdd.type === 'Co-op (Pair)' ? (
          <>
            <label htmlFor='dice-list-coop-pair'>
              Co-op Deck Pair:{' '}
              <div>
                {Array(5)
                  .fill('')
                  .map((_, i) => (
                    <select
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      defaultValue={i}
                      onChange={(evt): void => {
                        const clone = {
                          ...deckToAdd,
                        };
                        clone.decks[1][i] = Number(evt.target.value);
                        setDeckToAdd(clone);
                      }}
                    >
                      {dice
                        .filter(
                          die =>
                            !deckToAdd.decks[1].find(
                              (dieId, j) => dieId === die.id && i !== j
                            )
                        )
                        .map(die => (
                          <option value={die.id} key={die.id}>
                            {die.name}
                          </option>
                        ))}
                    </select>
                  ))}
              </div>
            </label>
            <label htmlFor='associated-guide'>
              Associated Deck Guide:{' '}
              <select
                defaultValue='PvP'
                onChange={(evt): void => {
                  const clone = {
                    ...deckToAdd,
                  };
                  clone.guide[1] = Number(evt.target.value);
                  setDeckToAdd(clone);
                }}
              >
                <option value={-1}>Auto detect</option>
                {guides.map(guide => (
                  <option key={guide.id} value={guide.id}>
                    {guide.name}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : null}
        {invalidRatingToAdd ? (
          <span className='invalid-warning'>Invalid Rating Input.</span>
        ) : null}
      </form>
      <button onClick={addDeck} type='submit' disabled={invalidRatingToAdd}>
        Submit
      </button>
    </div>
  );
}
