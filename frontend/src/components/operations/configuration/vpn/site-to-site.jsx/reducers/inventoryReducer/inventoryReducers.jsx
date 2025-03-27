import {
  DEVICEINVENTORIES,
  SELECTEDDEVICE,
} from '../../../vpnActions.jsx/actionTypes';

const initialState = {
  inventories: [],
  selectedDevice: null,
};

export default function InventoryReducer(state = initialState, action) {
  switch (action.type) {
    case DEVICEINVENTORIES:
      return { ...state, inventories: action.payload };
    case SELECTEDDEVICE:
      return { ...state, selectedDevice: action.payload };
    default:
      return state;
  }
}
