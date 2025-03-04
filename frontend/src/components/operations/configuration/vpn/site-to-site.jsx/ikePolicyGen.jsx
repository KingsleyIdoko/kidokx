import { useState, useEffect } from 'react';
import axios from 'axios';
import IpsecSteps from './ipsec_steps';
import { Link } from 'react-router-dom';
/**
 * IkePolicyConfig Component
 * -------------------------
 * This component provides a form to configure an IKE Policy for Juniper VPN.
 * It includes fields for:
 * - Policy Name
 * - IKE Mode
 * - IKE Proposal Selection (Fetched from API)
 * - Authentication Method Selection
 *
 * The form uses React state to manage user selections and fetches IKE proposals from an API.
 */
function IkePolicyConfig() {
  // State to manage user input selections
  const [selectedOptions, setSelectedOptions] = useState({
    policyName: '',
    ike_mode: '',
    proposalName: '',
    authentication_method: '',
  });

  // Available form field labels for the left-side UI
  const ikePolicyLabels = [
    'IKE Policy Name',
    'IKE Mode',
    'IKE Proposal',
    'Authentication Method',
  ];

  // State for selected output format (JSON, XML, CLI)
  const [selectedFormat, setSelectedFormat] = useState('json');

  // State for storing fetched IKE proposal names
  const [ikeProposalNames, setIkeProposalNames] = useState(null);

  // Loading and error states for API request
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches IKE Proposal Names from the API and updates the state.
   * Handles errors and loading states.
   */
  const fetchIkeProposalNames = async () => {
    setLoading(true);
    let errorMessages = [];

    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/ipsec/ikeproposal/names/',
      );
      setIkeProposalNames(response.data);
    } catch (err) {
      errorMessages.push(`Error fetching data: ${err.message}`);
      console.error('Error fetching IKE Proposal data:', err);
    } finally {
      setError(errorMessages.length ? errorMessages : null);
      setLoading(false);
    }
  };

  // Fetch IKE Proposal Names on component mount
  useEffect(() => {
    fetchIkeProposalNames();
  }, []);

  // Show loading spinner while fetching data
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

  // Show error messages if any
  if (error) return <p className="text-red-500">{error.join(', ')}</p>;

  // Show a message if no proposals are available
  if (!ikeProposalNames)
    return <p className="text-gray-500">No IKE proposals available</p>;

  return (
    <>
      {/* Main Container */}
      <div className="mx-auto bg-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          {/* Sidebar with IPsec Steps */}

          {/* Form Fields */}
          <div className="flex mx-auto ">
            {/* Labels Section (Left Column) */}
            <div className="w-[32rem] flex flex-col space-y-4 items-center">
              {ikePolicyLabels.map((label_name, index) => (
                <button
                  key={index} // ✅ Added a unique key for React
                  className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left"
                >
                  {label_name}
                </button>
              ))}
            </div>

            {/* Input Fields (Right Column) */}
            <div className="flex flex-col space-y-5">
              {/* IKE Policy Name Input */}
              <input
                type="text"
                placeholder="Enter Name"
                className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
                value={selectedOptions.policyName}
                onChange={(e) =>
                  setSelectedOptions((prev) => ({
                    ...prev,
                    policyName: e.target.value,
                  }))
                }
              />

              {/* IKE Mode Selection */}
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
                <option value="">Select Mode</option>
                <option value="main">Main</option>
                <option value="aggressive">Aggressive</option>
              </select>

              {/* IKE Proposal Selection */}
              <select
                className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
                value={selectedOptions.proposalName}
                onChange={(e) =>
                  setSelectedOptions((prev) => ({
                    ...prev,
                    proposalName: e.target.value,
                  }))
                }
              >
                <option value="">Select a Proposal</option>
                {ikeProposalNames.map((proposal, index) => (
                  <option key={index} value={proposal}>
                    {proposal}
                  </option>
                ))}
              </select>

              {/* Authentication Method Selection */}
              <select
                className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
                value={selectedOptions.authentication_method}
                onChange={(e) =>
                  setSelectedOptions((prev) => ({
                    ...prev,
                    authentication_method: e.target.value,
                  }))
                }
              >
                <option value="">Select Auth Method</option>
                <option value="pre-shared-key">Pre-Shared Key</option>
                <option value="rsa">RSA</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default IkePolicyConfig;
