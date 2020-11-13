import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import createLogger from 'redux-logger';
import Immutable from 'immutable';
import thunk from 'redux-thunk';

import allReducers from './reducers';

export default function configureStore() {
    const reduxMiddleware = composeWithDevTools(
        process.env.NODE_ENV === 'production'
            ? applyMiddleware(thunk)
            : applyMiddleware(thunk, createLogger),
    );

    const store = createStore(allReducers, Immutable.Map(), reduxMiddleware);

    return store;
}
