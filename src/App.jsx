import Navbar from './components/header/navbar';
import VPN from './components/operations/configuration/vpn/vpn'; // Import the VPN component

import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="bg-sky-100 min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/vpn/*" element={<VPN />} />{' '}
      </Routes>
    </div>
  );
}

export default App;
