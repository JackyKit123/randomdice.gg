/* eslint-disable react/destructuring-assignment */
import React, { ChangeEvent, useCallback } from 'react';
import clsx from 'clsx';
import InvalidWarning from 'components/InvalidWarning';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import firebase from 'firebase/app';

interface BaseProps<TInput extends 'text' | 'textarea' | 'rich-text' = 'text'> {
  name?: string;
  className?: string;
  type?: TInput;
  value: string;
  setValue: (value: string) => void;
}

interface RichTextProps<TInput extends 'text' | 'textarea' | 'rich-text'>
  extends BaseProps<TInput> {
  toolbar: 'basic' | 'extra' | 'with-image';
}

interface PropsWithInvalidWarning<
  TInput extends 'text' | 'textarea' | 'rich-text',
  TInvalid extends boolean | undefined
> extends BaseProps<TInput> {
  isInvalid?: TInvalid;
  invalidWarningText: string;
}

type Props<
  TInput extends 'text' | 'textarea' | 'rich-text',
  TInvalid extends boolean | undefined
> = (TInput extends 'rich-text' ? RichTextProps<TInput> : BaseProps<TInput>) &
  (TInvalid extends undefined
    ? BaseProps<TInput>
    : PropsWithInvalidWarning<TInput, TInvalid>);

const isPropsWithInvalidWarning = <
  TInput extends 'text' | 'textarea' | 'rich-text'
>(
  props: Props<TInput, boolean | undefined>
): props is PropsWithInvalidWarning<TInput, boolean | undefined> =>
  typeof (props as PropsWithInvalidWarning<
    'text' | 'textarea' | 'rich-text',
    boolean | undefined
  >).isInvalid !== 'undefined';

const isRichTextTypeProps = (
  props: Props<'text' | 'textarea' | 'rich-text', boolean | undefined>
): props is RichTextProps<'rich-text'> =>
  (props as RichTextProps<'rich-text'>).type === 'rich-text';

class MyUploadAdapter {
  private loader: {
    file: Promise<File>;
  };

  constructor(loader: { file: Promise<File> }) {
    this.loader = loader;
  }

  public async upload(): Promise<{
    default: string;
  }> {
    try {
      const file = await this.loader.file;
      const upload = await firebase
        .storage()
        .ref('CKEditor Images/')
        .child(`${new Date().toISOString()}-${file.name}`)
        .put(file, {
          cacheControl: 'public,max-age=31536000',
        });
      const url = await upload.ref.getDownloadURL();
      return {
        default: url,
      };
    } catch {
      return {
        default: '',
      };
    }
  }
}

export default function TextInput<
  TInvalid extends boolean | undefined,
  TInput extends 'text' | 'textarea' | 'rich-text' = 'text'
>(props: Props<TInput, TInvalid>): JSX.Element {
  const { name, className, type = 'text', value, setValue } = props;

  const onChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void =>
      setValue(evt.target.value),
    [setValue]
  );

  const textInput = type === 'text' && (
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
  );

  const textAreaInput = type === 'textarea' && (
    <textarea
      id={name}
      className={clsx([
        isPropsWithInvalidWarning(props) && props.isInvalid && 'invalid',
        className,
      ])}
      value={value}
      onChange={onChange}
    />
  );

  let toolbar: string[] = [];

  if (isRichTextTypeProps(props)) {
    switch (props.toolbar) {
      case 'basic':
        toolbar = ['undo', 'redo', '|', 'bold', 'italic', '|', 'link'];
        break;
      case 'extra':
        toolbar = [
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
        ];
        break;
      case 'with-image':
        toolbar = [
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
        ];
        break;
      default:
    }
  }

  const richTextEditor = isRichTextTypeProps(props) && (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      key={name}
      onInit={(editor: {
        plugins: {
          get(
            arg: 'FileRepository'
          ): {
            createUploadAdapter(loader: { file: Promise<File> }): void;
          };
        };
        setData: (value: string) => void;
      }): void => {
        // eslint-disable-next-line no-param-reassign
        editor.plugins.get('FileRepository').createUploadAdapter = (
          loader
        ): MyUploadAdapter => new MyUploadAdapter(loader);
        editor.setData(value);
      }}
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
        removePlugins: props.toolbar === 'extra' ? [] : ['Heading'],
        toolbar,
      }}
      onBlur={(
        _: unknown,
        editor: {
          getData: () => string;
        }
      ): void => setValue(editor.getData())}
    />
  );

  const Input = (
    <>
      {textInput}
      {textAreaInput}
      {richTextEditor}
    </>
  );

  return (
    <>
      {name && type !== 'rich-text' ? (
        <label htmlFor={name}>
          {name}:{Input}
        </label>
      ) : (
        Input
      )}
      {isPropsWithInvalidWarning(props) && (
        <InvalidWarning
          isInvalid={!!props.isInvalid}
          invalidWarningText={props.invalidWarningText}
        />
      )}
    </>
  );
}
