import { Route, Routes, useNavigate } from 'react-router-dom';
import RaVPN from './ra-vpn/ra-vpn';
import IPsecListgroup from './site-to-site.jsx/ipsec_listgroup';

function VPN() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-sky-100 flex mx-auto justify-center py-10">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex space-x-16"></div>

        {/* Routes for Site-to-Site and Remote Access VPN */}
        <Routes>
          <Route path="/site-to-site/" element={<IPsecListgroup />} />
          <Route path="/remote-access" element={<RaVPN />} />
        </Routes>
      </div>
    </div>
  );
}

export default VPN;
