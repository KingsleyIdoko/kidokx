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
  },
});

export const { setSecurityConfigType, setCreatezone } = SecuritySlice.actions;

export default SecuritySlice.reducer;
