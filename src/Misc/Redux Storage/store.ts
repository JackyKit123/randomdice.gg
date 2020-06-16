import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import fetchDecksReducer from './Fetch Decks/reducer';
import fetchDicesReducer from './Fetch Dices/reducer';
import fetchAltsReducer from './Fetch Alt/reducer';
import fetchArenaReducer from './Fetch Arena/reducer';
import filterReducer from './Deck Filter/reducer';
import fetchGAPIresponseFormReducer from './Google API Fetch Response Form/reducers';

const rootReducer = combineReducers({
    fetchArenaReducer,
    fetchDecksReducer,
    fetchDicesReducer,
    filterReducer,
    fetchGAPIresponseFormReducer,
    fetchAltsReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export const store = createStore(
    rootReducer,
    process.env.NODE_ENV === 'development'
        ? composeWithDevTools(applyMiddleware())
        : undefined
);
