import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sitedata: {},
  site: null,
  sitenames: [],
};

const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    setSiteData: (state, action) => {
      state.sitedata = action.payload;
    },
    setSite: (state, action) => {
      state.site = action.payload;
    },
    setGetSiteName: (state, action) => {
      state.sitenames = action.payload;
    },
  },
});

export const { setSiteData, setSite, setGetSiteName } = siteSlice.actions;

export default siteSlice.reducer;
