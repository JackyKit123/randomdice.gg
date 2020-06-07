import axios from 'axios';
import { Dispatch } from 'react';
import { store } from '../../Components/Redux Storage/store';
import {
    FETCH_DECKS_SUCCESS,
    FETCH_DECKS_FAIL,
    CLEAR_ERRORS as CLEAR_ERRORS_1,
    Decks,
} from '../../Components/Redux Storage/Fetch Decks/types';
import {
    FETCH_DICES_SUCCESS,
    FETCH_DICES_FAIL,
    CLEAR_ERRORS as CLEAR_ERRORS_2,
    Dices,
} from '../../Components/Redux Storage/Fetch Dices/types';
import {
    FETCH_ALTS_SUCCESS,
    FETCH_ALTS_FAIL,
    CLEAR_ERRORS as CLEAR_ERRORS_3,
    Alts,
} from '../../Components/Redux Storage/Fetch Alt/types';
import {
    FETCH_GAPI_RESPONSE_FORM_FAIL,
    FETCH_GAPI_RESPONSE_FORM_SUCCESS,
    CLEAR_ERRORS as CLEAR_ERRORS_4,
} from '../../Components/Redux Storage/Google API Fetch Response Form/types';

interface DeckApiResponseData {
    id: string;
    type: string;
    name: string;
    rating: string;
    slot1: string;
    slot2: string;
    slot3: string;
    slot4: string;
    slot5: string;
    added: string;
    updated: string | null;
}

interface DiceApiResponseData {
    id: string;
    name: string;
    type: string;
    desc: string;
    target: string;
    rarity: string;
    image: string;
    atk: string;
    spd: string;
    eff1: string;
    eff2: string;
    nameEff1: string;
    nameEff2: string;
    unitEff1: string;
    unitEff2: string;
    cupAtk: string;
    cupSpd: string;
    cupEff1: string;
    cupEff2: string;
    pupAtk: string;
    pupSpd: string;
    pupEff1: string;
    pupEff2: string;
}

interface AltsApiResponseData {
    id: string;
    dice: string | null;
    best: string | null;
    good: string | null;
    okay: string | null;
    bad: string | null;
    worst: string | null;
    description: string | null;
}

export async function fetchDecks(dispatch: Dispatch<{}>): Promise<void> {
    const apiUrl = '' || process.env.REACT_APP_API_HOST;
    try {
        const res = await axios.get(`${apiUrl}/api/decks`);
        const decks: Decks = res.data.decks.map(
            (each: DeckApiResponseData) => ({
                id: Number(each.id),
                type: each.type,
                rating: Number(each.rating),
                slot1: Number(each.slot1),
                slot2: Number(each.slot2),
                slot3: Number(each.slot3),
                slot4: Number(each.slot4),
                slot5: Number(each.slot5),
                added: each.added,
                updated: each.updated,
            })
        );
        dispatch({ type: FETCH_DECKS_SUCCESS, payload: decks });
    } catch (err) {
        dispatch({ type: FETCH_DECKS_FAIL, payload: err });
    }
}

export async function fetchDices(dispatch: Dispatch<{}>): Promise<void> {
    const apiUrl = '' || process.env.REACT_APP_API_HOST;
    try {
        const res = await axios.get(`${apiUrl}/api/dice`);
        const dices: Dices = res.data.dice.map((each: DiceApiResponseData) => ({
            id: Number(each.id),
            name: each.name,
            type: each.type,
            desc: each.desc,
            target: each.target,
            rarity: each.rarity,
            atk: Number(each.atk),
            spd: Number(each.spd),
            eff1: Number(each.eff1),
            eff2: Number(each.eff2),
            nameEff1: each.nameEff1,
            nameEff2: each.nameEff2,
            unitEff1: each.unitEff1,
            unitEff2: each.unitEff2,
            cupAtk: Number(each.cupAtk),
            cupSpd: Number(each.cupSpd),
            cupEff1: Number(each.cupEff1),
            cupEff2: Number(each.cupEff2),
            pupAtk: Number(each.pupAtk),
            pupSpd: Number(each.pupSpd),
            pupEff1: Number(each.pupEff1),
            pupEff2: Number(each.pupEff2),
        }));
        dispatch({ type: FETCH_DICES_SUCCESS, payload: dices });
    } catch (err) {
        dispatch({ type: FETCH_DICES_FAIL, payload: err });
    }
}

export async function fetchAlts(dispatch: Dispatch<{}>): Promise<void> {
    const apiUrl = '' || process.env.REACT_APP_API_HOST;
    try {
        const res = await axios.get(`${apiUrl}/api/alternates`);
        const alts: Alts = res.data.alts.map((each: AltsApiResponseData) => ({
            id: Number(each.dice),
            list: [
                Number(each.best),
                Number(each.good),
                Number(each.okay),
                Number(each.bad),
                Number(each.worst),
            ],
            desc: each.description,
        }));
        dispatch({ type: FETCH_ALTS_SUCCESS, payload: alts });
    } catch (err) {
        dispatch({ type: FETCH_ALTS_FAIL, payload: err });
    }
}

export async function fetchResponseForm(dispatch: Dispatch<{}>): Promise<void> {
    if (!store.getState().fetchGAPIresponseFormReducer.formData?.raw) {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/client.js';
        script.onload = (): void => {
            window.gapi.load('client', async () => {
                try {
                    await window.gapi.client.init({
                        apiKey: process.env.REACT_APP_GAPI_KEY,
                        discoveryDocs: [
                            'https://sheets.googleapis.com/$discovery/rest?version=v4',
                        ],
                    });
                    fetchResponseForm(dispatch);
                } catch (err) {
                    dispatch({
                        type: FETCH_GAPI_RESPONSE_FORM_FAIL,
                        payload: err.error,
                    });
                }
            });
        };
        document.body.append(script);
    }
    try {
        const res = await window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: process.env.REACT_APP_CRIT_RESPONSE_SPREADSHEET_ID,
            range: 'Responses!D2:E',
        });
        const rawData = res.result.values
            .map((row: string[]) => row.map((cell: string) => Number(cell)))
            .filter(
                (row: number[]) => row.some(data => data) && row.length === 2
            );
        const res2 = await window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: process.env.REACT_APP_CRIT_RESPONSE_SPREADSHEET_ID,
            range: 'Results!C2:D21',
        });
        const summarizedData = res2.result.values.map((row: string[]) =>
            row.map((cell: string) => Number(cell))
        );
        dispatch({
            type: FETCH_GAPI_RESPONSE_FORM_SUCCESS,
            payload: {
                raw: rawData,
                summarized: summarizedData,
            },
        });
    } catch (err) {
        dispatch({
            type: FETCH_GAPI_RESPONSE_FORM_FAIL,
            payload: err.error,
        });
    }
}

export async function clearError(dispatch: Dispatch<{}>): Promise<void> {
    dispatch({ type: CLEAR_ERRORS_1 });
    dispatch({ type: CLEAR_ERRORS_2 });
    dispatch({ type: CLEAR_ERRORS_3 });
    dispatch({ type: CLEAR_ERRORS_4 });
}
