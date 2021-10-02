/* eslint-disable react/destructuring-assignment */
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';
import clsx from 'clsx';
import InvalidWarning from 'components/InvalidWarning';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';

interface BaseProps {
  name?: string;
  className?: string;
  type?: 'text' | 'textarea' | 'rich-text';
  value?: string;
  setValue: Dispatch<SetStateAction<string>>;
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
  const { name, className, type = 'text', value, setValue } = props;

  const onChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void =>
      setValue(evt.target.value),
    [setValue]
  );

  return (
    <>
      <label htmlFor={name}>
        {name ? `${name}:` : null}
        {type === 'text' && (
          <input
            id={name}
            className={clsx([
              isPropsWithInvalidWarning(props) && props.isInvalid && 'invalid',
              className,
            ])}
            value={value}
            type='text'
            onChange={onChange}
          />
        )}
        {type === 'textarea' && (
          <textarea
            id={name}
            className={clsx([
              isPropsWithInvalidWarning(props) && props.isInvalid && 'invalid',
              className,
            ])}
            value={value}
            onChange={onChange}
          />
        )}
        {type === 'rich-text' && (
          <CKEditor
            editor={ClassicEditor}
            data={value}
            config={{
              removePlugins: ['Heading'],
              toolbar: ['undo', 'redo', '|', 'bold', 'italic', '|', 'link'],
            }}
            onBlur={(
              _: unknown,
              editor: {
                getData: () => string;
              }
            ): void => setValue(editor.getData())}
          />
        )}
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
