import { Cmd, Loop, liftState, loop } from 'redux-loop';
import { compose } from 'redux';
import { Actions } from './types/actions.type';
import { Picture } from './types/picture.type';
import { some, none, Option } from 'fp-ts/lib/Option';
import { fetchCatsRequest } from './actions';
import { PicturesResult } from './types/api.type';
import { cmdFetch } from './commands';

export type State = {
  counter: number,
  pictures: PicturesResult,
  pictureSelected: Option<Picture>,
}

export const defaultState: State = {
  counter: 3,
  pictures: { kind: 'SUCCESS', pictures: [] },
  pictureSelected: none,  
}

export const reducer = (state: State | undefined, action: Actions): State | Loop<State> => {
  if (!state) return defaultState; // L'appel à l'API d'intialisation se fait dans le store
  switch (action.type) {
    case 'INCREMENT':
      return loop(
        { ...state, counter: state.counter + 1},
        Cmd.action(fetchCatsRequest(state.counter + 1))
      );
    case 'DECREMENT':
      if(state.counter <= 3) return state;
      return loop(
        { ...state, counter: state.counter - 1},
        Cmd.action(fetchCatsRequest(state.counter - 1))
      );
    case 'SELECT_PICTURE':
      return { ...state, pictureSelected: some(action.picture) };
    case 'CLOSE_MODAL':
      return { ...state, pictureSelected: none };
    case 'FETCH_CATS_REQUEST':
      return loop(
        { ...state, pictures: { kind: 'LOADING' }},
        cmdFetch(action)
      );
    case 'FETCH_CATS_COMMIT':
      return { ...state, pictures: { kind: 'SUCCESS', pictures: action.payload as Picture[] } };
    case 'FETCH_CATS_ROLLBACK':
      return { ...state, pictures: { kind: 'FAILURE', error: action.error.message } };
      
  }
};

export const counterSelector = (state: State) => {
  return state.counter;
};
export const picturesSelector = (state: State) => {
  return state.pictures;
};
export const getSelectedPicture = (state: State) => {
  return state.pictureSelected;
};

export default compose(liftState, reducer);
