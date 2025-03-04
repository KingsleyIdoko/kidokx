import { useState, useEffect } from 'react';
import axios from 'axios';
import IpsecSteps from './ipsec_steps';
import { Link } from 'react-router-dom';
/**
 * IkeGatewayConfig Component
 * --------------------------
 * This component configures an IKE Gateway for Juniper VPN.
 * Users can input:
 * - Remote Address
 * - External Interface
 * - IKE Policy Selection (Fetched from API)
 * - IKE Version Selection
 * - Pre-Shared Key Input
 *
 * Data is fetched dynamically from the backend.
 */
function IkeGatewayConfig() {
  // State to manage user selections
  const [selectedOptions, setSelectedOptions] = useState({
    policyName: '',
    ike_mode: '',
    authentication_method: '',
    ike_version: '',
  });

  // Field labels for the left column
  const ikeGatewayParams = [
    'Remote Address',
    'External Interface',
    'IKE Policy',
    'Version',
    'Pre-Shared Key',
  ];

  // Available IKE versions
  const ikeVersions = ['v1-only', 'v2-only', 'ikev1-ikev2'];

  // State for output format selection (JSON, XML, CLI)
  const [selectedFormat, setSelectedFormat] = useState('json');

  // API data states
  const [ikePolicyNames, setIkePolicyNames] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** Fetch available IKE Policies from the API */
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

  // Fetch IKE Policy names when the component mounts
  useEffect(() => {
    fetchIkePolicyNames();
  }, []);

  // Handle API loading state
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

  // Handle API error state
  if (error) return <p className="text-red-500">{error.join(', ')}</p>;

  // Handle empty API response
  if (!ikePolicyNames)
    return <p className="text-gray-500">No IKE Policies available</p>;

  return (
    <>
      {/* Main Container */}
      <div className="mx-auto bg-white rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex mx-auto">
            {/* Labels Section (Left Column) */}
            <div className="w-[32rem] flex flex-col space-y-4 items-center">
              {ikeGatewayParams.map((label, index) => (
                <button
                  key={index}
                  className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Input Fields (Right Column) */}
            <div className="flex flex-col space-y-5">
              {/* Policy Name Input */}
              <input
                type="text"
                placeholder="Enter Policy Name"
                className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
                value={selectedOptions.policyName}
                onChange={(e) =>
                  setSelectedOptions((prev) => ({
                    ...prev,
                    policyName: e.target.value,
                  }))
                }
              />

              {/* External Interface Selection */}
              <select
                className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
                value={selectedOptions.ike_mode}
                onChange={(e) =>
                  setSelectedOptions((prev) => ({
                    ...prev,
                    ike_mode: e.target.value,
                  }))
                }
              >
                <option value="">Select Interface</option>
                <option value="ge-0/0/0">ge-0/0/0</option>
              </select>

              {/* IKE Policy Selection */}
              <select
                className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
                value={selectedOptions.policyName}
                onChange={(e) =>
                  setSelectedOptions((prev) => ({
                    ...prev,
                    policyName: e.target.value,
                  }))
                }
              >
                <option value="">Select a Policy</option>
                {ikePolicyNames.map((policy, index) => (
                  <option key={index} value={policy}>
                    {policy}
                  </option>
                ))}
              </select>

              {/* IKE Version Selection */}
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
                <option value="">Select Version</option>
                {ikeVersions.map((version, index) => (
                  <option key={index} value={version}>
                    {version}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Enter Ascii Password"
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
      </div>
    </>
  );
}

export default IkeGatewayConfig;
