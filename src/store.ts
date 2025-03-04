import { legacy_createStore as createStore, compose, applyMiddleware } from 'redux';
import reducer, { State } from './reducer';
import { install, LoopReducer, StoreCreator } from 'redux-loop';
import { createLogger } from 'redux-logger';
import { Actions } from './types/actions.type';
import { fetchCatsRequest } from './actions';

const enhancedStore = createStore as StoreCreator;

const loopReducer = reducer as LoopReducer<State, Actions>;
const logger = createLogger({
  collapsed: true,
  diff: true,
});

export const store = enhancedStore(loopReducer, undefined, compose(install(), applyMiddleware(logger)));

// Permet de faire le premier appel à l'API à l'initialisation
store.dispatch(fetchCatsRequest(store.getState().counter));

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
