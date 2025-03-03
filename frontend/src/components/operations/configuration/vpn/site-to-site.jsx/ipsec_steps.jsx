import { useNavigate } from 'react-router-dom';

function IpsecSteps() {
  // ✅ Component name in PascalCase
  const navigate = useNavigate();

  const ipsecSelection = [
    { name: 'IKE Proposal', path: '/vpn/site-to-site/config/ikeproposal' },
    { name: 'IKE Policy', path: '/vpn/site-to-site/config/ikepolicy' },
    { name: 'IKE Gateway', path: '/vpn/site-to-site/config/ikegateway' },
    { name: 'IPsec Proposal', path: '/vpn/site-to-site/config/ipsecproposal' },
    { name: 'IPsec Policy', path: '/vpn/site-to-site/config/ipsecpolicy' },
    { name: 'IPsec VPN', path: '/vpn/site-to-site/config/ipsecvpn' },
  ];

  const handleSelection = (ipsec) => {
    const selected = ipsecSelection.find((item) => item.name === ipsec);
    if (selected?.path) {
      navigate(selected.path, { replace: true });
    }
  };

  return (
    <div>
      {/* Sidebar with IPsec Options */}
      <div className="flex flex-col py-6 px-6 items-left space-y-3 justify-left bg-white">
        {ipsecSelection.map((ipsec) => (
          <div
            key={ipsec.name}
            className="border py-2 px-6 text-xl text-left cursor-pointer rounded-lg hover:bg-sky-300 hover:text-white"
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
