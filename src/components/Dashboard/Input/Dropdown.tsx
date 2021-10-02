import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';

interface Props<TValue extends string> {
  name: string;
  className?: string;
  value?: TValue;
  options: TValue[];
  setValue: Dispatch<SetStateAction<TValue>>;
}

export default function Dropdown<TValue extends string>({
  name,
  className,
  value,
  options,
  setValue,
}: Props<TValue>): JSX.Element {
  const onChange = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>): void =>
      setValue(evt.target.value as TValue),
    [setValue]
  );

  return (
    <label htmlFor={name}>
      {name}:
      <select id={name} className={className} value={value} onChange={onChange}>
        {options.map(option => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
