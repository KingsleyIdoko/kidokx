import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import RaVPN from './ra-vpn/ra-vpn';
import IPsecListgroup from './site-to-site.jsx/ipsec_listgroup';
import IkeProposalConfig from './site-to-site.jsx/ikeProposalGen';
import IkePolicyConfig from './site-to-site.jsx/ikePolicyGen';
import IkeGatewayConfig from './site-to-site.jsx/ikeGatewayGen';
import IPsecProposalConfig from './site-to-site.jsx/ipsecProposalGen';
import IPsecPolicyConfig from './site-to-site.jsx/ipsecPolicyGen';
import IPsecVPNConfig from './site-to-site.jsx/ipsecVpnGen';
import NavigationBar from './site-to-site.jsx/navigation';
import DeployPreview from './site-to-site.jsx/deploy_preview';
import IpsecSteps from './site-to-site.jsx/ipsec_steps';

function VPN() {
  const [webPage, setWebPage] = useState('IKE Proposal');
  const navigate = useNavigate();
  const location = useLocation(); // To get the current URL location

  // Array of navigation options
  const ipsecSelection = [
    { name: 'IKE Proposal', path: '/vpn/site-to-site/config/ikeproposal' },
    { name: 'IKE Policy', path: '/vpn/site-to-site/config/ikepolicy' },
    { name: 'IKE Gateway', path: '/vpn/site-to-site/config/ikegateway' },
    { name: 'IPsec Proposal', path: '/vpn/site-to-site/config/ipsecproposal' },
    { name: 'IPsec Policy', path: '/vpn/site-to-site/config/ipsecpolicy' },
    { name: 'IPsec VPN', path: '/vpn/site-to-site/config/ipsecvpn' },
  ];

  // Update the webpage state when the location changes
  useEffect(() => {
    const currentPath = location.pathname;
    console.log(currentPath);
    const selected = ipsecSelection.find((item) => item.path === currentPath);
    if (selected) {
      setWebPage(selected.name); // Set the webpage name based on the current path
    }
  }, [location, ipsecSelection]);

  return (
    <>
      <div className="min-h-screen bg-sky-100 flex justify-center mx-auto py-12 rounded-xl">
        {/* Main container for the VPN configuration steps */}
        <div className="w-[68rem] h-[36rem] flex flex-col bg-white space-y-6 shadow-xl items-center relative">
          {/* Navigation Bar: Fixed position */}
          <div className="w-[64rem] pt-6">
            <NavigationBar />
          </div>
          {/* IPsec Steps Sidebar */}
          <div className="w-[64rem] h-[24rem] flex items-center justify-between bg-white p-3 gap-3">
            <div>
              <IpsecSteps webpage={webPage} />
              {/* Pass the webpage name as a prop */}
            </div>

            {/* Routes for Site-to-Site and Remote Access VPN */}
            <div className="w-[44rem] rounded-lg">
              <Routes>
                <Route path="/site-to-site" element={<IPsecListgroup />} />
                <Route
                  path="/site-to-site/config/ikeproposal"
                  element={<IkeProposalConfig />}
                />
                <Route
                  path="/site-to-site/config/ikepolicy"
                  element={<IkePolicyConfig />}
                />
                <Route
                  path="/site-to-site/config/ikegateway"
                  element={<IkeGatewayConfig />}
                />
                <Route
                  path="/site-to-site/config/ipsecproposal"
                  element={<IPsecProposalConfig />}
                />
                <Route
                  path="/site-to-site/config/ipsecpolicy"
                  element={<IPsecPolicyConfig />}
                />
                <Route
                  path="/site-to-site/config/ipsecvpn"
                  element={<IPsecVPNConfig />}
                />
                <Route path="/remote-access" element={<RaVPN />} />
              </Routes>
            </div>
          </div>
          {/* Deploy and Preview Section: Fixed position */}
          <div className="w-[64rem] pb-10">
            <DeployPreview />
          </div>
        </div>
      </div>
    </>
  );
}

export default VPN;
