import { Route, Routes } from 'react-router-dom';
import RaVPN from './ra-vpn/ra-vpn';
import IPsecListgroup from './site-to-site.jsx/ipsec_listgroup';
import IpsecConfig from './site-to-site.jsx/ikeConfigGen';

function VPN() {
  return (
    <div className="min-h-screen bg-sky-100 flex mx-auto justify-center py-10">
      <div className="flex flex-col items-center space-y-4">
        {/* Routes for Site-to-Site and Remote Access VPN */}
        <Routes>
          <Route path="/site-to-site" element={<IPsecListgroup />} />
          <Route path="/site-to-site/config" element={<IpsecConfig />} />
          <Route path="/remote-access" element={<RaVPN />} />
        </Routes>
      </div>
    </div>
  );
}

export default VPN;
