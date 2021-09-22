import React from 'react';
import useRootStateSelector from 'Redux';
import { Die } from 'types/database';

export default function Dice({
  die,
}: {
  die: number | string | Die;
}): JSX.Element {
  const { dice } = useRootStateSelector('fetchFirebaseReducer');
  const targetDice = dice?.find(
    d =>
      d.id === die ||
      d.name === die ||
      (typeof die === 'object' && d.id === die.id)
  );

  return (
    <figure className='dice'>
      <img
        alt={`dice ${targetDice?.name || '?'}`}
        data-dice-rarity={targetDice?.rarity || '?'}
        src={
          targetDice?.img ||
          'https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/Dice%20Images%2FEmpty?alt=media&token=ccd57102-a890-44ba-b6f0-29e91c765f58'
        }
      />
    </figure>
  );
}
