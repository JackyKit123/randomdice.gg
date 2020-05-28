import axios from 'axios';
import { Dispatch } from 'react';
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

export async function clearError(dispatch: Dispatch<{}>): Promise<void> {
    dispatch({ type: CLEAR_ERRORS_1 });
    dispatch({ type: CLEAR_ERRORS_2 });
}
