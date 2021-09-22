import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import fetchUserDataReducer from './Fetch Firebase/User/reducer';
import authReducer from './Firebase Auth/reducer';
import popupReducer from './PopUp Overlay/reducer';
import filterReducer from './Deck Filter/reducer';
import initGAPIReducer from './Google API/Client/reducer';
import fetchGAPIyoutubeChannelsReducer from './Google API/Youtube Channels/reducer';
import fetchFirebaseReducer from './Fetch Firebase';

const rootReducer = combineReducers({
    fetchUserDataReducer,
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
