import { Route, Routes, useNavigate } from 'react-router-dom';
import RaVPN from './ra-vpn/ra-vpn'; // Capitalized RaVPN
import SiteToSite from './site-to-site.jsx/s2s-vpn';

function VPN() {
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleVPNTypeChange = (event) => {
    const selectedValue = event.target.value;
    // Navigate based on the selected VPN type
    if (selectedValue === 'site-to-site') {
      navigate('/vpn/site-to-site');
    } else if (selectedValue === 'ra-vpn') {
      navigate('/vpn/ra-vpn');
    }
  };

  return (
    <div className="w-[72rem] h-[48rem] bg-white flex mx-auto justify-center p-10">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex space-x-16">
          <select
            onChange={handleVPNTypeChange}
            className="py-3 px-8 rounded-lg shadow-lg"
          >
            <option value="">Select VPN Type</option>
            <option value="site-to-site">Site to Site</option>
            <option value="ra-vpn">Remote Access VPN</option>
          </select>
          <select className="py-3 px-8 rounded-lg shadow-lg">
            <option value="">Select Vendor</option>
            <option value="juniper">Juniper SRX</option>
            <option value="asa">ASA</option>
            <option value="fortigate">FortiGate</option>
            <option value="firepower">Firepower</option>
          </select>
          <select className="py-3 px-8 rounded-lg shadow-lg">
            <option value="">Select Model</option>
            <option value="srx">Juniper SRX</option>
            <option value="asa">ASA</option>
            <option value="fortigate">FortiGate</option>
            <option value="firepower">Firepower</option>
          </select>
        </div>

        {/* Routes for Site-to-Site and Remote Access VPN */}
        <Routes>
          <Route path="/site-to-site" element={<SiteToSite />} />
          <Route path="/ra-vpn" element={<RaVPN />} />
        </Routes>
      </div>
    </div>
  );
}

export default VPN;
