import { configureStore, combineReducers } from '@reduxjs/toolkit';
import Navreducer from '../header/navReducer';
import VpnReducer from './reducers/vpnReducer';
import InventoryReducer from './reducers/inventoryReducers';

const rootReducer = combineReducers({
  navbar: Navreducer,
  vpn: VpnReducer,
  inventories: InventoryReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
