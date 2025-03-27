import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CONFIGTYPE } from '../vpnActions.jsx/actionTypes';

function IpsecSteps({ onhandleSelection }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { configtype } = useSelector((store) => store.vpn);

  const ipsecSelection = [
    {
      name: 'IKE Proposal',
      storename: 'ikeproposal',
      path: '/vpn/site-to-site/config/ikeproposal/',
    },
    {
      name: 'IKE Policy',
      storename: 'ikepolicy',
      path: '/vpn/site-to-site/config/ikepolicy/',
    },
    {
      name: 'IKE Gateway',
      storename: 'ikegateway',
      path: '/vpn/site-to-site/config/ikegateway/',
    },
    {
      name: 'IPsec Proposal',
      storename: 'ipsecproposal',
      path: '/vpn/site-to-site/config/ipsecproposal/',
    },
    {
      name: 'IPsec Policy',
      storename: 'ipsecpolicy',
      path: '/vpn/site-to-site/config/ipsecpolicy/',
    },
    {
      name: 'IPsec VPN',
      storename: 'ipsecvpn',
      path: '/vpn/site-to-site/config/ipsecvpn/',
    },
  ];

  return (
    <div>
      {/* Sidebar with IPsec Options */}
      <div className="w-[16rem] flex flex-col py-6 px-6 items-left space-y-3 justify-left bg-white">
        {ipsecSelection.map((ipsec) => {
          return (
            <div
              key={ipsec.name}
              className={`border py-2 px-6 text-left cursor-pointer rounded-lg 
                hover:bg-sky-300 hover:text-white 
                ${
                  configtype === ipsec.storename ? 'bg-sky-400 text-white' : ''
                }`}
              onClick={() => {
                onhandleSelection(ipsec.name, ipsec.path, ipsecSelection);
                dispatch({ type: CONFIGTYPE, payload: ipsec.storename });
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
