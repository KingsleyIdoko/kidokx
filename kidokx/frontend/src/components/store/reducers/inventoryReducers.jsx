import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inventories: [],
  selectedDevice: '',
  isSelectedDevice: false,
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
  },
});

export const { setDeviceInventories, setSelectedDevice, setIsSelectedDevice } =
  inventorySlice.actions;

export default inventorySlice.reducer;
