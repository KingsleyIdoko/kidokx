import { configureStore } from '@reduxjs/toolkit';
import Navreducer from '../header/navReducer';

const store = configureStore({
  reducer: {
    navbar: Navreducer,
  },
});

export default store;
