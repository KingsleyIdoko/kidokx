import { createSlice } from '@reduxjs/toolkit';

const initialState = { securityconfigtype: '', createzone: false };

const SecuritySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    setSecurityConfigType: (state, action) => {
      state.securityconfigtype = action.payload;
    },
    setCreatezone: (state, action) => {
      state.createzone = action.payload;
    },
    setSelectedZoneID: (state, action) => {
      state.getzoneid = action.payload;
    },
    setEditSecurityZone: (state, action) => {
      state.editsecurityzone = action.payload;
    },
    setEditData: (state, action) => {
      state.editingdata = action.payload;
    },
  },
});

export const {
  setSecurityConfigType,
  setCreatezone,
  setSelectedZoneID,
  setEditSecurityZone,
  setEditData,
} = SecuritySlice.actions;

export default SecuritySlice.reducer;
