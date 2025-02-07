import { Loop, liftState } from 'redux-loop';
import { compose } from 'redux';
import { Actions } from './types/actions.type';
import { Picture } from './types/picture.type';
import fakepictures from './fake-datas.json';
import { some, none, Option } from 'fp-ts/lib/Option';

export type State = {
  counter: number,
  pictures: Picture[],
  pictureSelected: Option<Picture>,
}

export const defaultState: State = {
  counter: 3,
  pictures: fakepictures.slice(0, 3) as Picture[],
  pictureSelected: none,
}

export const reducer = (state: State | undefined, action: Actions): State | Loop<State> => {
  if (!state) return defaultState; // mandatory by redux
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, counter: state.counter + 1, pictures: fakepictures.slice(0, state.counter + 1) as Picture[]};
    case 'DECREMENT':
      if(state.counter <= 3) return state;
      return { ...state, counter: state.counter - 1, pictures: fakepictures.slice(0, state.counter - 1) as Picture[]};
    case 'SELECT_PICTURE':
      return { ...state, pictureSelected: some(action.picture) };
    case 'CLOSE_MODAL':
      return { ...state, pictureSelected: none };
    case 'FETCH_CATS_REQUEST':
      throw 'Not Implemented';
    case 'FETCH_CATS_COMMIT':
      throw 'Not Implemented';
    case 'FETCH_CATS_ROLLBACK':
      throw 'Not Implemented';
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
