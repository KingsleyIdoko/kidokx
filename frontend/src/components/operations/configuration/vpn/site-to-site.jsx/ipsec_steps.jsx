import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function IpsecSteps({ webpage }) {
  const [urlState, setUrlState] = useState('');
  const navigate = useNavigate();

  // Array of navigation options
  const ipsecSelection = [
    { name: 'IKE Proposal', path: '/vpn/site-to-site/config/ikeproposal' },
    { name: 'IKE Policy', path: '/vpn/site-to-site/config/ikepolicy' },
    { name: 'IKE Gateway', path: '/vpn/site-to-site/config/ikegateway' },
    { name: 'IPsec Proposal', path: '/vpn/site-to-site/config/ipsecproposal' },
    { name: 'IPsec Policy', path: '/vpn/site-to-site/config/ipsecpolicy' },
    { name: 'IPsec VPN', path: '/vpn/site-to-site/config/ipsecvpn' },
  ];

  // Update the URL state when `webpage` prop changes
  useEffect(() => {
    setUrlState(webpage);
  }, [webpage]);

  // Handle selection and navigation
  const handleSelection = (ipsec) => {
    const selected = ipsecSelection.find((item) => item.name === ipsec);
    if (selected?.path) {
      navigate(selected.path); // Navigate to the selected path
    }
  };

  return (
    <div>
      {/* Sidebar with IPsec Options */}
      <div className="w-[16rem] flex flex-col py-6 px-6 items-left space-y-3 justify-left bg-white">
        {ipsecSelection.map((ipsec) => (
          <div
            key={ipsec.name}
            className={`border py-2 px-6 text-left ${
              urlState === ipsec.name ? 'bg-sky-400 text-white' : ''
            } cursor-pointer rounded-lg hover:bg-sky-300 hover:text-white`}
            onClick={() => handleSelection(ipsec.name)}
          >
            {ipsec.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default IpsecSteps;
