import React from 'react';

interface Props {
  isInvalid: boolean;
  invalidWarningText: string;
}

export default function InvalidWarning({
  isInvalid,
  invalidWarningText,
}: Props): JSX.Element {
  return isInvalid ? (
    <div className='invalid-warning'>{invalidWarningText}</div>
  ) : (
    <></>
  );
}
