import { configureStore } from '@reduxjs/toolkit';
import Navreducer from '../header/navReducer';
import VpnReducer from '../operations/configuration/vpn/vpnReducers.jsx/vpnReducer';

const store = configureStore({
  reducer: {
    navbar: Navreducer,
    vpn: VpnReducer,
  },
});

export default store;
