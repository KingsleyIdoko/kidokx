import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { IKEPOLICYDATA } from '../../../../store/reducers/vpnReducer';

export default function IkePolicyConfig() {
  const dispatch = useDispatch();
  const { ikePolicyData = {}, selectedDevice } = useSelector(
    (state) => state.vpn,
  );
  const [ikeProposalNames, setIkeProposalNames] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ikePolicyLabels = [
    'IKE Policy Name',
    'IKE Mode',
    'IKE Proposal',
    'Authentication Method',
  ];

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

  const handleChanges = (field, value) => {
    const updatedData = {
      ...ikePolicyData,
      device: selectedDevice,
      [field]: value,
    };
    console.log(updatedData);
    dispatch({ type: IKEPOLICYDATA, payload: updatedData });
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
  if (!ikeProposalNames)
    return <p className="text-gray-500">No IKE proposals available</p>;

  return (
    <div className="w-[44rem] mx-auto bg-white rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="w-[24rem] flex flex-col space-y-4">
          {ikePolicyLabels.map((label_name, index) => (
            <button
              key={index}
              type="button"
              className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left"
            >
              {label_name}
            </button>
          ))}
        </div>

        <div className="w-[20rem] flex flex-col space-y-5">
          <input
            type="text"
            placeholder="Enter Name"
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={ikePolicyData.policyName || ''}
            onChange={(e) => handleChanges('policyName', e.target.value)}
          />

          <select
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={ikePolicyData.ike_mode || ''}
            onChange={(e) => handleChanges('ike_mode', e.target.value)}
          >
            <option value="">Select Mode</option>
            <option value="main">Main</option>
            <option value="aggressive">Aggressive</option>
          </select>

          <select
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={ikePolicyData.proposalName || ''}
            onChange={(e) => handleChanges('proposalName', e.target.value)}
          >
            <option value="">Select a Proposal</option>
            {ikeProposalNames.map((proposal, index) => (
              <option key={index} value={proposal}>
                {proposal}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={ikePolicyData.authentication_method || ''}
            onChange={(e) =>
              handleChanges('authentication_method', e.target.value)
            }
          >
            <option value="">Select Auth Method</option>
            <option value="pre-shared-key">Pre-Shared Key</option>
            <option value="rsa">RSA</option>
          </select>
        </div>
      </div>
    </div>
  );
}
