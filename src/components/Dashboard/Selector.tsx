import React, { Dispatch, SetStateAction } from 'react';

interface Props {
  name: string;
  selectRef: React.LegacyRef<HTMLSelectElement>;
  data: ({ id: number; name: string } & unknown)[];
  setActive: Dispatch<SetStateAction<number | undefined>>;
}

export default React.forwardRef(function Selector({
  name,
  selectRef,
  data,
  setActive,
}: Props): JSX.Element {
  return (
    <label htmlFor={`select-${name.toLowerCase()}`}>
      Select A {name}:
      <select
        ref={selectRef}
        name={`select-${name.toLowerCase()}`}
        id={`select-${name.toLowerCase()}`}
        onChange={(evt): void => {
          if (evt.target.value === '?') {
            setActive(undefined);
          } else {
            const datumExist = data.find(
              datum => datum.name === evt.target.value
            );
            if (datumExist) {
              setActive(datumExist.id);
            } else {
              data.sort((a, b) => (a.id < b.id ? -1 : 1));
              let newId = data.findIndex((datum, i) => datum.id !== i);
              if (newId === -1) {
                newId = data.length;
              }
              setActive(newId);
            }
          }
        }}
      >
        <option>?</option>
        {data.map(datum => (
          <option key={datum.name}>{datum.name}</option>
        ))}
        <option>Add a New {name}</option>
      </select>
    </label>
  );
});
