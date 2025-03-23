import { DEVICEINVENTORIES } from '../../../vpnActions.jsx/actionTypes';

const initialState = {
  inventories: [],
};

export default function InventoryReducer(state = initialState, action) {
  switch (action.type) {
    case DEVICEINVENTORIES:
      return {
        ...state,
        inventories: action.payload,
      };

    default:
      return state;
  }
}
