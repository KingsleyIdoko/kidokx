import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inventories: [],
  selectedDevice: '',
  isSelectedDevice: false,
  editeddata: null,
  trackdevicestatus: 'down',
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setDeviceInventories: (state, action) => {
      state.inventories = action.payload;
    },
    setSelectedDevice: (state, action) => {
      state.selectedDevice = action.payload;
    },
    setIsSelectedDevice: (state, action) => {
      state.isSelectedDevice = action.payload;
    },
    setEditedData: (state, action) => {
      state.editeddata = action.payload;
    },
    trackDeviceStatus: (state, action) => {
      state.trackdevicestatus = action.payload;
    },
  },
});

export const {
  setDeviceInventories,
  setSelectedDevice,
  setIsSelectedDevice,
  setEditedData,
  trackDeviceStatus,
} = inventorySlice.actions;

export default inventorySlice.reducer;
