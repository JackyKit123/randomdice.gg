import InvalidWarning from 'components/InvalidWarning';
import React, { Dispatch, SetStateAction } from 'react';

interface Props {
  isInvalid?: boolean;
  src: string;
  alt: string;
  setSrc: Dispatch<SetStateAction<string>>;
  extraImageProps?: Record<string, unknown>;
}

export default function Image({
  isInvalid,
  alt,
  src,
  setSrc,
  extraImageProps,
}: Props): JSX.Element {
  return (
    <>
      <label htmlFor={alt}>
        Image:
        <figure className={alt}>
          <img
            src={src}
            alt={alt}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...extraImageProps}
          />
        </figure>
        <input
          type='file'
          alt={alt}
          accept='image/*'
          className={isInvalid ? 'invalid' : ''}
          onChange={(evt): void => {
            if (evt.target.files) {
              const reader = new FileReader();
              const file = evt.target.files[0];
              reader.readAsDataURL(file);
              reader.onloadend = (): void => setSrc(reader.result as string);
            }
          }}
        />
      </label>
      <InvalidWarning
        isInvalid={!!isInvalid}
        invalidWarningText='Please upload an image in the correct format.'
      />
    </>
  );
}
