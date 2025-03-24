import {
  DEVICEINVENTORIES,
  SELECTEDDEVICE,
} from '../../../vpnActions.jsx/actionTypes';

const initialState = {
  inventories: [],
  selectedDevcie: null,
};

export default function InventoryReducer(state = initialState, action) {
  switch (action.type) {
    case DEVICEINVENTORIES:
      return {
        ...state,
        inventories: action.payload,
      };
    case SELECTEDDEVICE:
      return {
        ...state,
        selectedDevcie: action.payload,
      };

    default:
      return state;
  }
}
