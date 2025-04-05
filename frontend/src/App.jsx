import { Provider } from 'react-redux';
import store, { persistor } from './components/store/store'; // import persistor
import { PersistGate } from 'redux-persist/integration/react'; // import PersistGate
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/header/navbar';
import VPN from './components/operations/configuration/vpn/vpn';
import '@fortawesome/fontawesome-free/css/all.min.css';
import SiteToSiteList from './components/operations/configuration/vpn/site-to-site.jsx/SiteToSiteVPNList';
import HopePage from './components/homepage/homepage';
import VpnConfigList from './components/operations/configuration/vpn/site-to-site.jsx/vpnConfigList/vpnconfiglist';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="bg-sky-100 min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<HopePage />} />
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
      </PersistGate>
    </Provider>
  );
}

export default App;
