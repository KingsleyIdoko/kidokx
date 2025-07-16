import { createSlice } from '@reduxjs/toolkit';

const initialState = { securityconfigtype: '' };

const SecuritySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    setSecurityConfigType: (state, action) => {
      state.securityconfigtype = action.payload;
    },
  },
});

export const { setSecurityConfigType } = SecuritySlice.actions;

export default SecuritySlice.reducer;
