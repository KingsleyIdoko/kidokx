import { useState, useEffect } from 'react';
import axios from 'axios';

function IkePolicyConfig() {
  const [selectedOptions, setSelectedOptions] = useState({
    policyName: '',
    ike_mode: '',
    proposalName: '',
    authentication_method: '',
  });

  const ikePolicyLabels = [
    'IKE Policy Name',
    'IKE Mode',
    'IKE Proposal',
    'Authentication_Method',
  ];
  const [selectedFormat, setSelectedFormat] = useState('json');
  const [ikeProposalNames, setIkeProposalNames] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Optimized fetch function
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

  useEffect(() => {
    fetchIkeProposalNames();
  }, []);

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
  if (!ikeProposalNames)
    return <p className="text-gray-500">No IKE proposals available</p>;

  return (
    <>
      <div className="w-[56rem] mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mb-4">
          <button className="capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 hover:opacity-70">
            <a href="/vpn/site-to-site/config/ikeproposal">Previous</a>
          </button>

          <h2 className="text-lg font-semibold text-center flex-1 capitalize">
            Juniper IKE Policy Configuration
          </h2>

          <button className="capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 hover:opacity-70">
            <a href="/vpn/site-to-site/config/ikegateway">Next</a>
          </button>
        </div>

        {/* Form Fields */}
        <div className="flex mx-auto mb-6">
          {/* Labels Section (Left Column) */}
          <div className="w-[32rem] flex flex-col space-y-4 items-center">
            {ikePolicyLabels.map((label_name, index) => (
              <button
                key={index} // ✅ Fix: Added a unique key for React
                className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left"
              >
                {label_name}
              </button>
            ))}
          </div>

          {/* Input Fields (Right Column) */}
          <div className="flex flex-col space-y-5  justify-left">
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

        {/* Preview & Deploy Buttons */}
        <div className="flex items-center justify-between">
          <button className="capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 hover:opacity-70">
            preview
          </button>

          <div className="flex space-x-3 items-center justify-center">
            <label
              htmlFor="format"
              className="capitalize text-black bg-gray-100 rounded-lg py-2 px-6 hover:opacity-70"
            >
              format:
            </label>
            <select
              id="format"
              className="capitalize text-black rounded-lg py-2 px-6 hover:opacity-70 focus:outline-none"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
            >
              <option value="json">JSON</option>
              <option value="xml">XML</option>
              <option value="cli">CLI</option>
            </select>
          </div>

          <button className="capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 duration-200 hover:opacity-70">
            deploy
          </button>
        </div>
      </div>
    </>
  );
}

export default IkePolicyConfig;
