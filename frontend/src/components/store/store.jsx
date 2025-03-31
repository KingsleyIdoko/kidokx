import { configureStore } from '@reduxjs/toolkit';
import Navreducer from '../header/navReducer';
import VpnReducer from './reducers/vpnReducer';
import InventoryReducer from './reducers/inventoryReducers';

const store = configureStore({
  reducer: {
    navbar: Navreducer,
    vpn: VpnReducer,
    inventories: InventoryReducer,
  },
});

export default store;
