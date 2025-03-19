import { Provider } from 'react-redux';
import store from './components/store/store';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/header/navbar';
import VPN from './components/operations/configuration/vpn/vpn';
import '@fortawesome/fontawesome-free/css/all.min.css';
import S2sVPNList from './components/operations/configuration/vpn/site-to-site.jsx/s2svpnlist';
import HopePage from './components/homepage/homepage';

function App() {
  return (
    <Provider store={store}>
      <div className="bg-sky-100 min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HopePage />} />
          <Route path="/vpn/site-to-site/config/*" element={<VPN />} />
          <Route path="/vpn/site-to-site/list/*" element={<S2sVPNList />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
