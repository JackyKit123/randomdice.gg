import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import fetchDecksReducer from './Fetch Firebase/Decks/reducer';
import fetchDicesReducer from './Fetch Firebase/Dices/reducer';
import fetchWikiReducer from './Fetch Firebase/Wiki/reducer';
import fetchNewsReducer from './Fetch Firebase/News/reducer';
import fetchDecksGuideReducer from './Fetch Firebase/Decks Guide/reducer';
import fetchCreditReducer from './Fetch Firebase/Credit/reducer';
import fetchUserDataReducer from './Fetch Firebase/User/reducer';
import fetchPatreonListReducer from './Fetch Firebase/Patreon List/reducer';
import authReducer from './Firebase Auth/reducer';
import popupReducer from './PopUp Overlay/reducer';
import filterReducer from './Deck Filter/reducer';
import fetchGAPIresponseFormReducer from './Google API Fetch Response Form/reducers';

const rootReducer = combineReducers({
    fetchDecksReducer,
    fetchDicesReducer,
    fetchWikiReducer,
    fetchNewsReducer,
    fetchUserDataReducer,
    fetchDecksGuideReducer,
    fetchCreditReducer,
    fetchPatreonListReducer,
    filterReducer,
    authReducer,
    popupReducer,
    fetchGAPIresponseFormReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export const store = createStore(
    rootReducer,
    process.env.NODE_ENV === 'development'
        ? composeWithDevTools(applyMiddleware())
        : undefined
);
