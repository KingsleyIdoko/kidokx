import { createAction } from "@reduxjs/toolkit";

const initialState = {
  inventories: [],
  selectedDevice: "",
  isSelectedDevice: false,
};

export const setSelectedDevice = createAction("SELECTEDDEVICE");
export const setIsSelectedDevice = createAction("ISSELECTEDDEVICE");
export const setDeviceInventories = createAction("DEVICEINVENTORIES");

export default function InventoryReducer(state = initialState, action) {
  switch (action.type) {
    case setDeviceInventories.type:
      return { ...state, inventories: action.payload };
    case setSelectedDevice.type:
      return { ...state, selectedDevice: action.payload };
    case setIsSelectedDevice.type:
      return { ...state, isSelectedDevice: action.payload };
    default:
      return state;
  }
}
