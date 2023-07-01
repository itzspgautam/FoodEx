import {GeneralActions} from '../Actions';

const initialState = {
  theme: 'light',
};

const GeneralReducers = (state = initialState, action) => {
  switch (action.type) {
    case GeneralActions.types.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    default:
      return state;
  }
};

export default GeneralReducers;
