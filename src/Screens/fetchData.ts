import axios from 'axios';
import { Dispatch } from 'react';
import {
    FETCH_DECKS_SUCCESS,
    FETCH_DECKS_FAIL,
} from '../Components/Redux Storage/Fetch Decks/types';
import {
    FETCH_DICES_SUCCESS,
    FETCH_DICES_FAIL,
} from '../Components/Redux Storage/Fetch Dices/types';

export async function fetchDecks(dispatch: Dispatch<{}>): Promise<void> {
    const apiUrl = '' || process.env.REACT_APP_API_HOST;
    try {
        const res = await axios.get(`${apiUrl}/api/decks`);
        dispatch({ type: FETCH_DECKS_SUCCESS, payload: res.data.decks });
    } catch (err) {
        dispatch({ type: FETCH_DECKS_FAIL, payload: err });
    }
}

export async function fetchDices(dispatch: Dispatch<{}>): Promise<void> {
    const apiUrl = '' || process.env.REACT_APP_API_HOST;
    try {
        const res = await axios.get(`${apiUrl}/api/dice`);
        dispatch({ type: FETCH_DICES_SUCCESS, payload: res.data.dice });
    } catch (err) {
        dispatch({ type: FETCH_DICES_FAIL, payload: err });
    }
}
