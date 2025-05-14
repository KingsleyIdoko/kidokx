import { configureStore, combineReducers } from '@reduxjs/toolkit';
import Navreducer from '../header/navReducer';
import VpnReducer from './reducers/vpnReducer';
import InventoryReducer from './reducers/inventoryReducers';
import siteReducer from './reducers/siteReducer'; // <-- you forgot this part

const rootReducer = combineReducers({
  navbar: Navreducer,
  vpn: VpnReducer,
  inventories: InventoryReducer,
  site: siteReducer, // <-- also add it here
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
