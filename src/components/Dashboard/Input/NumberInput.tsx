/* eslint-disable react/destructuring-assignment */
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';
import clsx from 'clsx';
import InvalidWarning from 'components/InvalidWarning';

interface BaseProps {
  name: string;
  className?: string;
  value?: number;
  setValue: Dispatch<SetStateAction<number>>;
  max?: number;
  min?: number;
  step?: number;
}

interface PropsWithInvalidWarning<TInvalid extends boolean | undefined>
  extends BaseProps {
  isInvalid?: TInvalid;
  invalidWarningText: string;
}

type Props<TInvalid extends boolean | undefined> = TInvalid extends undefined
  ? BaseProps
  : PropsWithInvalidWarning<TInvalid>;

const isPropsWithInvalidWarning = (
  props: Props<boolean | undefined>
): props is PropsWithInvalidWarning<boolean | undefined> =>
  typeof (props as PropsWithInvalidWarning<boolean | undefined>).isInvalid !==
  'undefined';

export default function TextInput<TInvalid extends boolean | undefined>(
  props: Props<TInvalid>
): JSX.Element {
  const { name, className, value, setValue, min, max, step } = props;

  const onChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void =>
      setValue(Number(evt.target.value)),
    [setValue]
  );

  return (
    <>
      <label htmlFor={name}>
        {name}:
        <input
          id={name}
          className={clsx([
            isPropsWithInvalidWarning(props) && props.isInvalid && 'invalid',
            className,
          ])}
          value={value}
          type='number'
          onChange={onChange}
          min={min}
          max={max}
          step={step}
        />
      </label>
      {isPropsWithInvalidWarning(props) && (
        <InvalidWarning
          isInvalid={!!props.isInvalid}
          invalidWarningText={props.invalidWarningText}
        />
      )}
    </>
  );
}
