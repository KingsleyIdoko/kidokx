import { createAction } from '@reduxjs/toolkit';

const initialState = {
  inventories: [],
  selectedDevice: null,
};

export const setSelectedDevice = createAction('SELECTEDDEVICE');
export const setDeviceInventories = createAction('DEVICEINVENTORIES');

export default function InventoryReducer(state = initialState, action) {
  switch (action.type) {
    case setDeviceInventories.type:
      return { ...state, inventories: action.payload };
    case setSelectedDevice.type:
      return { ...state, selectedDevice: action.payload };
    default:
      return state;
  }
}
