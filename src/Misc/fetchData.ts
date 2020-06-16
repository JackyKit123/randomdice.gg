import axios from 'axios';
import { Dispatch } from 'react';
import {
    FETCH_DECKS_SUCCESS,
    FETCH_DECKS_FAIL,
    CLEAR_ERRORS as CLEAR_ERRORS_1,
    Decks,
} from './Redux Storage/Fetch Decks/types';
import {
    FETCH_DICES_SUCCESS,
    FETCH_DICES_FAIL,
    CLEAR_ERRORS as CLEAR_ERRORS_2,
    Dices,
} from './Redux Storage/Fetch Dices/types';
import {
    FETCH_ALTS_SUCCESS,
    FETCH_ALTS_FAIL,
    CLEAR_ERRORS as CLEAR_ERRORS_3,
    Alts,
} from './Redux Storage/Fetch Alt/types';
import {
    FETCH_ARENA_SUCCESS,
    FETCH_ARENA_FAIL,
    CLEAR_ERRORS as CLEAR_ERRORS_4,
    DicesValue,
} from './Redux Storage/Fetch Arena/types';
import {
    FETCH_GAPI_RESPONSE_FORM_FAIL,
    FETCH_GAPI_RESPONSE_FORM_SUCCESS,
    CLEAR_ERRORS as CLEAR_ERRORS_5,
} from './Redux Storage/Google API Fetch Response Form/types';

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

interface DraftApiResponseData {
    id: string;
    dice: string;
    type: string;
    dps: string;
    assist: string;
    slow: string;
    value: string;
}

function corruptedStorage(item: string): boolean {
    try {
        JSON.parse(item);
        return false;
    } catch (err) {
        return true;
    }
}

export async function fetchDecks(dispatch: Dispatch<{}>): Promise<void> {
    const localCache = localStorage.getItem('decks');
    if (localCache) {
        if (corruptedStorage(localCache)) {
            localStorage.removeItem('decks');
        } else {
            dispatch({
                type: FETCH_DECKS_SUCCESS,
                payload: JSON.parse(localCache),
            });
        }
    }
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
        localStorage.setItem('decks', JSON.stringify(decks));
    } catch (err) {
        dispatch({ type: FETCH_DECKS_FAIL, payload: err });
    }
}

export async function fetchDices(dispatch: Dispatch<{}>): Promise<void> {
    const localCache = localStorage.getItem('dices');
    if (localCache) {
        if (corruptedStorage(localCache)) {
            localStorage.removeItem('dices');
        } else {
            dispatch({
                type: FETCH_DICES_SUCCESS,
                payload: JSON.parse(localCache),
            });
        }
    }
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
        localStorage.setItem('dices', JSON.stringify(dices));
    } catch (err) {
        dispatch({ type: FETCH_DICES_FAIL, payload: err });
    }
}

export async function fetchAlts(dispatch: Dispatch<{}>): Promise<void> {
    const localCache = localStorage.getItem('alts');
    if (localCache) {
        if (corruptedStorage(localCache)) {
            localStorage.removeItem('alts');
        } else {
            dispatch({
                type: FETCH_ALTS_SUCCESS,
                payload: JSON.parse(localCache),
            });
        }
    }
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
        localStorage.setItem('alts', JSON.stringify(alts));
    } catch (err) {
        dispatch({ type: FETCH_ALTS_FAIL, payload: err });
    }
}

export async function fetchArena(dispatch: Dispatch<{}>): Promise<void> {
    const localCache = localStorage.getItem('arena');
    if (localCache) {
        if (corruptedStorage(localCache)) {
            localStorage.removeItem('arena');
        } else {
            dispatch({
                type: FETCH_ARENA_SUCCESS,
                payload: JSON.parse(localCache),
            });
        }
    }
    const apiUrl = '' || process.env.REACT_APP_API_HOST;
    try {
        const res = await axios.get(`${apiUrl}/api/drafts`);
        const draft: DicesValue = res.data.drafts.map(
            (each: DraftApiResponseData) => ({
                id: Number(each.dice),
                type: each.type,
                dps: Number(each.dps),
                assists: Number(each.assist),
                slow: Number(each.slow),
                value: Number(each.value),
            })
        );
        dispatch({ type: FETCH_ARENA_SUCCESS, payload: draft });
        localStorage.setItem('arena', JSON.stringify(draft));
    } catch (err) {
        dispatch({ type: FETCH_ARENA_FAIL, payload: err });
    }
}

export async function fetchResponseForm(
    dispatch: Dispatch<{}>,
    init?: boolean
): Promise<void> {
    const localCache = localStorage.getItem('critData');
    if (localCache) {
        if (corruptedStorage(localCache)) {
            localStorage.removeItem('critData');
        } else {
            dispatch({
                type: FETCH_GAPI_RESPONSE_FORM_SUCCESS,
                payload: JSON.parse(localCache),
            });
        }
    }
    if (init) {
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
                } finally {
                    fetchResponseForm(dispatch);
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
        const payload = {
            raw: rawData,
            summarized: summarizedData,
        };
        dispatch({
            type: FETCH_GAPI_RESPONSE_FORM_SUCCESS,
            payload,
        });
        localStorage.setItem('critData', JSON.stringify(payload));
    } catch (err) {
        dispatch({
            type: FETCH_GAPI_RESPONSE_FORM_FAIL,
            payload: err.error,
        });
    }
}

export function initGoogleAd(): void {
    const script = document.createElement('script');
    script.src =
        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.setAttribute('data-ad-client', 'ca-pub-3031422008949072');
    document.body.append(script);
}

export async function clearError(dispatch: Dispatch<{}>): Promise<void> {
    dispatch({ type: CLEAR_ERRORS_1 });
    dispatch({ type: CLEAR_ERRORS_2 });
    dispatch({ type: CLEAR_ERRORS_3 });
    dispatch({ type: CLEAR_ERRORS_4 });
    dispatch({ type: CLEAR_ERRORS_5 });
}
