import {
  navMenu,
  firstDropDown,
  secondDropDown,
  thirdDropDown,
} from '../actions/actionsTypes';

const initialState = {
  activeNavMenu: null,
  activeFirstDropDown: null,
  activeSecondDropDown: null,
  activeThirdDropDown: null,
};

export default function Navreducer(state = initialState, action) {
  switch (action.type) {
    case navMenu:
      return {
        ...state,
        activeNavMenu:
          state.activeNavMenu === action.payload ? null : action.payload,
        activeFirstDropDown: null,
        activeSecondDropDown: null,
        activeThirdDropDown: null,
      };
    case firstDropDown:
      return {
        ...state,
        activeFirstDropDown:
          state.activeFirstDropDown === action.payload ? null : action.payload,
        activeSecondDropDown: null,
        activeThirdDropDown: null,
      };
    case secondDropDown:
      return {
        ...state,
        activeSecondDropDown:
          state.activeSecondDropDown === action.payload ? null : action.payload,
        activeThirdDropDown: null,
      };
    case thirdDropDown:
      return {
        ...state,
        activeThirdDropDown:
          state.activeThirdDropDown === action.payload ? null : action.payload,
        activeNavMenu: null,
        activeFirstDropDown: null,
        activeSecondDropDown: null,
      };
    default:
      return state;
  }
}
