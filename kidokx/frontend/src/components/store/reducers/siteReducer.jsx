import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sitedata: {},
};

const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    setSiteData: (state, action) => {
      state.sitedata = action.payload;
    },
  },
});

export const { setSiteData } = siteSlice.actions;

export default siteSlice.reducer;
