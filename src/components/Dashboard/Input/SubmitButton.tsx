import { faCheck, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConfirmedSubmitNotification, popupContext } from 'components/PopUp';
import React, { useContext } from 'react';

interface Props {
  isInvalid?: boolean;
  submitPromptText: string;
  onSubmit: () => void | Promise<void>;
  type: 'submit' | 'delete';
}

export default function SubmitButton({
  isInvalid,
  submitPromptText,
  onSubmit,
  type,
}: Props): JSX.Element {
  const { openPopup } = useContext(popupContext);

  return (
    <button
      disabled={isInvalid}
      type='button'
      className={type}
      onClick={(): void =>
        openPopup(
          <ConfirmedSubmitNotification
            promptText={submitPromptText}
            confirmHandler={async (): Promise<void> => {
              if (type === 'submit' && isInvalid) return;
              await onSubmit();
            }}
          />
        )
      }
    >
      {type === 'delete' && <FontAwesomeIcon icon={faTrashAlt} />}
      {type === 'submit' && <FontAwesomeIcon icon={faCheck} />}
    </button>
  );
}
