import { configureStore, combineReducers } from '@reduxjs/toolkit';
import Navreducer from '../header/navReducer';
import VpnReducer from './reducers/vpnReducer';
import InventoryReducer from './reducers/inventoryReducers';
import siteReducer from './reducers/siteReducer';
import SecurityReducer from './reducers/security';

const rootReducer = combineReducers({
  navbar: Navreducer,
  vpn: VpnReducer,
  inventories: InventoryReducer,
  site: siteReducer,
  security: SecurityReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
