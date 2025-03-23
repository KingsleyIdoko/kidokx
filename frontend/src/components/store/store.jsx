import { configureStore } from '@reduxjs/toolkit';
import Navreducer from '../header/navReducer';
import VpnReducer from '../operations/configuration/vpn/site-to-site.jsx/reducers/vpnReducers.jsx/vpnReducer';
import InventoryReducer from '../operations/configuration/vpn/site-to-site.jsx/reducers/inventoryReducer/inventoryReducers';

const store = configureStore({
  reducer: {
    navbar: Navreducer,
    vpn: VpnReducer,
    inventories: InventoryReducer,
  },
});

export default store;
