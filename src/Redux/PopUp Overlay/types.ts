export const OPEN_POPUP = 'OPEN_POPUP';
export const CLOSE_POPUP = 'CLOSE_POPUP';

export interface PopUpState {
    name: string | null;
}

interface OpenPopUpAction {
    type: typeof OPEN_POPUP;
    payload: string;
}

interface ClosePopUpAction {
    type: typeof CLOSE_POPUP;
}

export type Action = OpenPopUpAction | ClosePopUpAction;
