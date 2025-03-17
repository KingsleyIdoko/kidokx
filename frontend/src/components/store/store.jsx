import { configureStore } from '@reduxjs/toolkit';
import Navreducer from '../header/reducer';

const store = configureStore({
  reducer: {
    navbar: Navreducer,
  },
});

export default store;
