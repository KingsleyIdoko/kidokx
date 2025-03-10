import { Route, Routes } from 'react-router-dom';
import Navbar from './components/header/navbar';
import VPN from './components/operations/configuration/vpn/vpn';
import '@fortawesome/fontawesome-free/css/all.min.css';
import VPNList from './components/operations/configuration/vpn/vpnlist';

function App() {
  return (
    <div className="bg-sky-100 min-h-screen">
      <Navbar />
      <Routes>
        {/* Main VPN Route, VPN.js will handle subroutes */}
        <Route path="/vpn/config/*" element={<VPN />} />
        <Route path="/vpn/list/*" element={<VPNList />} />
      </Routes>
    </div>
  );
}

export default App;
