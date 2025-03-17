import { Actions } from './actions';

const initialState = {
  activeNavMenu: null,
  activeFirstDropDown: null,
  activeSecondDropDown: null,
  activeThirdDropDown: null,
};

export default function Navreducer(state = initialState, action) {
  switch (action.type) {
    case Actions.navMenu:
      return {
        ...state,
        activeNavMenu:
          state.activeNavMenu === action.payload ? null : action.payload,
        activeFirstDropDown: null,
        activeSecondDropDown: null,
        activeThirdDropDown: null,
      };
    case Actions.firstDropDown:
      return {
        ...state,
        activeFirstDropDown:
          state.activeFirstDropDown === action.payload ? null : action.payload,
        activeSecondDropDown: null,
        activeThirdDropDown: null,
      };
    case Actions.secondDropDown:
      return {
        ...state,
        activeSecondDropDown:
          state.activeSecondDropDown === action.payload ? null : action.payload,
        activeThirdDropDown: null,
      };
    case Actions.thirdDropDown:
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
