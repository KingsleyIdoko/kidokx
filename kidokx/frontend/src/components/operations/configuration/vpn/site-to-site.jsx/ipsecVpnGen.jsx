import { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming API calls for gateway and policy lists
import { useDispatch, useSelector } from 'react-redux';
import { IPSECVPNDATA } from '../../../../store/reducers/vpnReducer';

function IPsecVPNConfig() {
  const dispatch = useDispatch();
  const { ipsecVpnData = {}, selectedDevice } = useSelector(
    (state) => state.vpn,
  );

  const [ikeGatewayList, setIkeGatewayList] = useState([]);
  const [ipsecPolicyList, setIpsecPolicyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGatewaysAndPolicies = async () => {
    setLoading(true);
    let errorMessages = [];

    try {
      const [gatewayResponse, policyResponse] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/ipsec/ikegateway/names/'),
        axios.get('http://127.0.0.1:8000/api/ipsec/ipsecpolicy/names/'),
      ]);

      setIkeGatewayList(gatewayResponse.data);
      setIpsecPolicyList(policyResponse.data);
    } catch (err) {
      errorMessages.push(`Error fetching data: ${err.message}`);
      console.error('Error fetching VPN dependencies:', err);
    } finally {
      setError(errorMessages.length ? errorMessages : null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGatewaysAndPolicies();
  }, []);

  const handleChanges = (field, value) => {
    const updatedData = {
      ...ipsecVpnData,
      device: selectedDevice,
      [field]: value,
    };
    console.log(updatedData);
    dispatch({ type: IPSECVPNDATA, payload: updatedData });
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <svg
          className="w-12 h-12 animate-spin text-blue-500"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        <p className="mt-2 text-gray-600">Fetching data...</p>
      </div>
    );

  if (error) return <p className="text-red-500">{error.join(', ')}</p>;

  return (
    <div className="w-[44rem] mx-auto bg-white rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="w-[24rem] flex flex-col space-y-4">
          <button className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left">
            VPN Name
          </button>
          <button className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left">
            Bind Interface
          </button>
          <button className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left">
            IKE Gateway
          </button>
          <button className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left">
            IPSec Policy
          </button>
          <button className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left">
            Establish Tunnel Immediately
          </button>
        </div>

        <div className="w-[20rem] flex flex-col space-y-5">
          {/* VPN Name */}
          <input
            type="text"
            placeholder="Enter VPN Name"
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={ipsecVpnData.vpnName || ''}
            onChange={(e) => handleChanges('vpnName', e.target.value)}
          />

          {/* Bind Interface */}
          <input
            type="text"
            placeholder="Enter Bind Interface (e.g., st0.0)"
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={ipsecVpnData.bindInterface || ''}
            onChange={(e) => handleChanges('bindInterface', e.target.value)}
          />

          {/* IKE Gateway */}
          <select
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={ipsecVpnData.ikeGateway || ''}
            onChange={(e) => handleChanges('ikeGateway', e.target.value)}
          >
            <option value="">Select IKE Gateway</option>
            {ikeGatewayList.map((gateway, index) => (
              <option key={index} value={gateway}>
                {gateway}
              </option>
            ))}
          </select>

          {/* IPSec Policy */}
          <select
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={ipsecVpnData.ipsecPolicy || ''}
            onChange={(e) => handleChanges('ipsecPolicy', e.target.value)}
          >
            <option value="">Select IPSec Policy</option>
            {ipsecPolicyList.map((policy, index) => (
              <option key={index} value={policy}>
                {policy}
              </option>
            ))}
          </select>

          {/* Establish Tunnel Immediately */}
          <select
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={ipsecVpnData.establishTunnels || ''}
            onChange={(e) => handleChanges('establishTunnels', e.target.value)}
          >
            <option value="">Select Tunnel Establish Mode</option>
            <option value="immediately">Immediately</option>
            <option value="on-traffic">On Traffic</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default IPsecVPNConfig;
