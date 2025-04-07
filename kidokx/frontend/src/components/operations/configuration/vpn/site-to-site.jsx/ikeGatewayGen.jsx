import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IKEGATEWAYDATA } from '../../../../store/reducers/vpnReducer';
import axios from 'axios';

function IkeGatewayConfig() {
  const dispatch = useDispatch();
  const { selectedDevice } = useSelector((state) => state.vpn);
  const [selectedOptions, setSelectedOptions] = useState({
    policyName: '',
    remote_address: '',
    external_interface: '',
    ike_policy: '',
    ike_version: '',
    psk_passwd: '',
  });
  const ikeGatewayParams = [
    'Gateway Name',
    'Remote Address',
    'External Interface',
    'IKE Policy',
    'IKE Version',
    'Pre-Shared Key',
  ];

  const ikeVersions = ['v1-only', 'v2-only'];
  const [ikePolicyNames, setIkePolicyNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIkePolicyNames = async () => {
    setLoading(true);
    let errorMessages = [];

    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/ipsec/ikepolicy/names/',
      );
      setIkePolicyNames(response.data);
    } catch (err) {
      errorMessages.push(`Error fetching data: ${err.message}`);
      console.error('Error fetching IKE Policy data:', err);
    } finally {
      setError(errorMessages.length ? errorMessages : null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIkePolicyNames();
  }, []);

  useEffect(() => {
    const updateOptions = {
      ...selectedOptions,
      device: selectedDevice,
    };
    dispatch({ type: IKEGATEWAYDATA, payload: updateOptions });
  }, [selectedOptions, dispatch, selectedDevice]);

  if (loading) {
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
  }

  if (error) {
    return <p className="text-red-500">{error.join(', ')}</p>;
  }

  if (!ikePolicyNames || ikePolicyNames.length === 0) {
    return <p className="text-gray-500">No IKE Policies available</p>;
  }

  return (
    <div className="w-[44rem] mx-auto bg-white rounded-lg p-6">
      <div className="flex mx-auto">
        <div className="w-[24rem] flex flex-col space-y-4">
          {ikeGatewayParams.map((label, index) => (
            <div
              key={index}
              className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="w-[20rem] flex flex-col space-y-5">
          <input
            type="text"
            placeholder="Enter Gateway Name"
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={selectedOptions.policyName}
            onChange={(e) =>
              setSelectedOptions((prev) => ({
                ...prev,
                policyName: e.target.value,
              }))
            }
          />

          <input
            type="text"
            placeholder="Enter Remote Address"
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={selectedOptions.remote_address}
            onChange={(e) =>
              setSelectedOptions((prev) => ({
                ...prev,
                remote_address: e.target.value,
              }))
            }
          />

          <select
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={selectedOptions.external_interface}
            onChange={(e) =>
              setSelectedOptions((prev) => ({
                ...prev,
                external_interface: e.target.value,
              }))
            }
          >
            <option value="">Select Interface</option>
            <option value="ge-0/0/0">ge-0/0/0</option>
          </select>

          <select
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={selectedOptions.ike_policy}
            onChange={(e) =>
              setSelectedOptions((prev) => ({
                ...prev,
                ike_policy: e.target.value,
              }))
            }
          >
            <option value="">Select Ike Policy</option>
            {ikePolicyNames.map((policy, index) => (
              <option key={index} value={policy}>
                {policy}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={selectedOptions.ike_version}
            onChange={(e) =>
              setSelectedOptions((prev) => ({
                ...prev,
                ike_version: e.target.value,
              }))
            }
          >
            <option value="">Select Ike Version</option>
            {ikeVersions.map((version, index) => (
              <option key={index} value={version}>
                {version}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Enter Pre-Shared Key"
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={selectedOptions.psk_passwd}
            onChange={(e) =>
              setSelectedOptions((prev) => ({
                ...prev,
                psk_passwd: e.target.value,
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}

export default IkeGatewayConfig;
