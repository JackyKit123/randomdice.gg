import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import popupReducer from './PopUp Overlay/reducer';
import filterReducer from './Deck Filter/reducer';
import initGAPIReducer from './Google API/Client/reducer';
import fetchGAPIyoutubeChannelsReducer from './Google API/Youtube Channels/reducer';
import fetchFirebaseReducer from './fetchFirebaseReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
    filterReducer,
    authReducer,
    popupReducer,
    initGAPIReducer,
    fetchGAPIyoutubeChannelsReducer,
    fetchFirebaseReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export const store = createStore(
    rootReducer,
    process.env.NODE_ENV === 'development'
        ? composeWithDevTools(applyMiddleware())
        : undefined
);
