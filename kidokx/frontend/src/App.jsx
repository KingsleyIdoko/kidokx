import { Provider } from 'react-redux';
import store from './components/store/store';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/header/navbar';
import VPN from './components/operations/configuration/vpn/vpn';
import '@fortawesome/fontawesome-free/css/all.min.css';
import SiteToSiteList from './components/operations/configuration/vpn/site-to-site.jsx/SiteToSiteVPNList';
import HopePage from './components/homepage/homepage';
import VpnConfigList from './components/operations/configuration/vpn/site-to-site.jsx/vpnConfigList/vpnconfiglist';
import DeviceIvenventory from './components/inventory/devicelist';
import CreateDevice from './components/inventory/createdevices';
import CreateSite from './components/sites/createsite';
import SiteList from './components/sites/sitelist';

function App() {
  return (
    <Provider store={store}>
      <div className="bg-sky-100 min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HopePage />} />
          <Route
            path="/inventory/devices/list/*"
            element={<DeviceIvenventory />}
          />
          <Route
            path="/inventory/devices/create/*"
            element={<CreateDevice />}
          />
          <Route path="/inventory/sites/create/*" element={<CreateSite />} />
          <Route path="/inventory/sites/list/*" element={<SiteList />} />
          <Route
            path="/vpn/site-to-site/list/config/*"
            element={<VpnConfigList />}
          />
          <Route path="/vpn/site-to-site/config/*" element={<VPN />} />
          <Route
            path="/vpn/site-to-site/sessions/list/*"
            element={<SiteToSiteList />}
          />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
