import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { IPSECPOLICYDATA } from '../../../../store/reducers/vpnReducer';

export default function IpsecPolicyConfig() {
  const dispatch = useDispatch();
  const { ipsecPolicyData = {}, selectedDevice } = useSelector(
    (state) => state.vpn,
  );

  const [ipsecProposalNames, setIpsecProposalNames] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ipsecPolicyLabels = [
    'IPSec Policy Name',
    'Description',
    'Perfect Forward Secrecy (PFS)',
    'IPSec Proposal',
  ];

  const fetchIpsecProposalNames = async () => {
    setLoading(true);
    let errorMessages = [];

    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/ipsec/ikeproposal/names/',
      );
      setIpsecProposalNames(response.data);
    } catch (err) {
      errorMessages.push(`Error fetching IPSec Proposal data: ${err.message}`);
      console.error('Error fetching IPSec Proposal data:', err);
    } finally {
      setError(errorMessages.length ? errorMessages : null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpsecProposalNames();
  }, []);

  const handleChanges = (field, value) => {
    const updatedData = {
      ...ipsecPolicyData,
      device: selectedDevice,
      [field]: value,
    };
    dispatch({ type: IPSECPOLICYDATA, payload: updatedData });
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
  if (!ipsecProposalNames)
    return <p className="text-gray-500">No IPSec proposals available</p>;

  return (
    <div className="w-[44rem] mx-auto bg-white rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="w-[24rem] flex flex-col space-y-4">
          {ipsecPolicyLabels.map((label_name, index) => (
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
          {/* IPSec Policy Name */}
          <input
            type="text"
            placeholder="Enter IPSec Policy Name"
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={ipsecPolicyData.policyName || ''}
            onChange={(e) => handleChanges('policyName', e.target.value)}
          />

          {/* Description */}
          <input
            type="text"
            placeholder="Enter Description"
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={ipsecPolicyData.description || ''}
            onChange={(e) => handleChanges('description', e.target.value)}
          />

          {/* Perfect Forward Secrecy */}
          <select
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={ipsecPolicyData.pfs_group || ''}
            onChange={(e) => handleChanges('pfs_group', e.target.value)}
          >
            <option value="">Select PFS Group</option>
            <option value="group2">Group 2</option>
            <option value="group5">Group 5</option>
            <option value="group14">Group 14</option>
            <option value="group19">Group 19</option>
            <option value="group20">Group 20</option>
          </select>

          {/* IPSec Proposal */}
          <select
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={ipsecPolicyData.proposalName || ''}
            onChange={(e) => handleChanges('proposalName', e.target.value)}
          >
            <option value="">Select IPSec Proposal</option>
            {ipsecProposalNames.map((proposal, index) => (
              <option key={index} value={proposal}>
                {proposal}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
