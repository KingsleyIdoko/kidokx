import { Route, Routes, useNavigate } from 'react-router-dom';
import RaVPN from './ra-vpn/ra-vpn';
import IPsecListgroup from './site-to-site.jsx/ipsec_listgroup';
import IkeProposalConfig from './site-to-site.jsx/ikeProposalGen';
import IkePolicyConfig from './site-to-site.jsx/ikePolicyGen';
import IkeGatewayConfig from './site-to-site.jsx/ikeGatewayGen';
import IPsecProposalConfig from './site-to-site.jsx/ipsecProposalGen';
import IPsecPolicyConfig from './site-to-site.jsx/ipsecPolicyGen';
import IPsecVPNConfig from './site-to-site.jsx/ipsecVpnGen';

function VPN() {
  const navigate = useNavigate();

  const ipsecSelection = [
    { name: 'IKE Proposal', path: '/vpn/site-to-site/config/ikeproposal' },
    { name: 'IKE Policy', path: '/vpn/site-to-site/config/ikepolicy' },
    { name: 'IKE Gateway', path: '/vpn/site-to-site/config/ikegateway' },
    { name: 'IPsec Proposal', path: '/vpn/site-to-site/config/ipsecproposal' },
    { name: 'IPsec Policy', path: '/vpn/site-to-site/config/ipsecpolicy' },
    { name: 'IPsec VPN', path: '/vpn/site-to-site/config/ipsecvpn' },
  ];

  return (
    <>
      <div className="min-h-screen bg-sky-100 flex mx-auto justify-center py-10">
        {/* Routes for Site-to-Site and Remote Access VPN */}
        <div className="flex flex-col items-center space-y-4">
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
    </>
  );
}

export default VPN;
