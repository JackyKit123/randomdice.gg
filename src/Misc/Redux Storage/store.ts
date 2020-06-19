import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import fetchDecksReducer from './Fetch Firebase/Decks/reducer';
import fetchDicesReducer from './Fetch Firebase/Dices/reducer';
import filterReducer from './Deck Filter/reducer';
import fetchGAPIresponseFormReducer from './Google API Fetch Response Form/reducers';

const rootReducer = combineReducers({
    fetchDecksReducer,
    fetchDicesReducer,
    filterReducer,
    fetchGAPIresponseFormReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export const store = createStore(
    rootReducer,
    process.env.NODE_ENV === 'development'
        ? composeWithDevTools(applyMiddleware())
        : undefined
);
