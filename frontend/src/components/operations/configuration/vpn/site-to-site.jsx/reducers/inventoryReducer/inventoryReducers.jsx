import {
  DEVICEINVENTORIES,
  SELECTEDDEVICE,
  VALIDATEIKEPROPOSAL,
} from '../../../vpnActions.jsx/actionTypes';

const initialState = {
  inventories: [],
  selectedDevice: null,
  validatedData: null,
};

export default function InventoryReducer(state = initialState, action) {
  switch (action.type) {
    case DEVICEINVENTORIES:
      return { ...state, inventories: action.payload };
    case SELECTEDDEVICE:
      return { ...state, selectedDevice: action.payload };
    case VALIDATEIKEPROPOSAL:
      return { ...state, validatedData: action.payload };
    default:
      return state;
  }
}
