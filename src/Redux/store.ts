import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import initGAPIReducer from './Google API/Client/reducer';
import fetchGAPIyoutubeChannelsReducer from './Google API/Youtube Channels/reducer';
import fetchFirebaseReducer from './fetchFirebaseReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
    authReducer,
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
