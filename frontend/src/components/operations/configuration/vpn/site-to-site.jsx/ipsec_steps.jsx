import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function IpsecSteps({ webpage, onhandleSelection }) {
  const navigate = useNavigate();
  const location = useLocation();

  const ipsecSelection = [
    { name: 'IKE Proposal', path: '/vpn/site-to-site/config/ikeproposal' },
    { name: 'IKE Policy', path: '/vpn/site-to-site/config/ikepolicy' },
    { name: 'IKE Gateway', path: '/vpn/site-to-site/config/ikegateway' },
    { name: 'IPsec Proposal', path: '/vpn/site-to-site/config/ipsecproposal' },
    { name: 'IPsec Policy', path: '/vpn/site-to-site/config/ipsecpolicy' },
    { name: 'IPsec VPN', path: '/vpn/site-to-site/config/ipsecvpn' },
  ];

  // Helper to determine active state (handles both main and preview paths)
  const checkActive = (ipsecPath) => {
    const currentPath = location.pathname;
    return (
      currentPath === ipsecPath ||
      currentPath ===
        `/vpn/site-to-site/config/preview/${ipsecPath.split('/').pop()}`
    );
  };

  useEffect(() => {
    // Scroll to top or other side effects if needed
  }, [location]);

  return (
    <div>
      {/* Sidebar with IPsec Options */}
      <div className="w-[16rem] flex flex-col py-6 px-6 items-left space-y-3 justify-left bg-white">
        {ipsecSelection.map((ipsec) => {
          const isActive = checkActive(ipsec.path);

          return (
            <div
              key={ipsec.name}
              className={`border py-2 px-6 text-left cursor-pointer rounded-lg 
                hover:bg-sky-300 hover:text-white 
                ${isActive ? 'bg-sky-400 text-white' : ''}`}
              onClick={() => {
                onhandleSelection(ipsec.name, ipsec.path, ipsecSelection);
                navigate(ipsec.path);
              }}
            >
              {ipsec.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default IpsecSteps;
