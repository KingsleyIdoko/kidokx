import { useEffect } from 'react';
import { useIpsecData } from './api/ikeProposalItems';
import { useSelector, useDispatch } from 'react-redux';
import { IKEPROPOSALDATA } from '../vpnActions.jsx/actionTypes';

function IkeProposalConfig() {
  const { ikeProposalRawData, ipsecChoicesData, error, loading } =
    useIpsecData();
  const { ikeProposalData } = useSelector((store) => store.vpn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (ipsecChoicesData) {
      const initialOptions = Object.keys(ipsecChoicesData).reduce(
        (acc, key) => {
          acc[key] = ''; // Initialize with an empty string to prompt user selection
          return acc;
        },
        {},
      );

      dispatch({
        type: IKEPROPOSALDATA,
        payload: {
          proposalName: '', // Explicitly initialize proposalName as empty
          ...initialOptions,
        },
      });
    }
  }, [ipsecChoicesData, dispatch]);

  const handleChange = (key, value) => {
    const updatedForm = {
      ...ikeProposalData,
      [key]: value,
    };

    dispatch({
      type: IKEPROPOSALDATA,
      payload: updatedForm,
    });
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

  if (!ipsecChoicesData)
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

  const filteredIsecData = Object.keys(ipsecChoicesData)
    .filter((category) => category !== 'authentication_method') // Exclude if not needed
    .reduce((acc, key) => {
      acc[key] = ipsecChoicesData[key];
      return acc;
    }, {});

  return (
    <div className="w-[44rem] mx-auto bg-white rounded-lg p-6">
      <form className="grid grid-cols-2 gap-x-10 gap-y-4 items-center">
        {/* Proposal Name Input */}
        <button
          type="button"
          className="text-black font-normal text-left bg-gray-100 px-4 py-3 border rounded-lg"
        >
          IKE Proposal Name
        </button>
        <input
          type="text"
          placeholder="Enter Proposal Name"
          className="px-4 py-3 bg-gray-100 text-black border rounded-lg focus:outline-none w-full"
          value={ikeProposalData.proposalName || ''}
          onChange={(e) => handleChange('proposalName', e.target.value)}
        />

        {/* Dynamically Generated Select Inputs */}
        {Object.keys(filteredIsecData).map((category) => (
          <div
            key={`${category}-wrapper`}
            className="col-span-2 grid grid-cols-2 gap-x-10 items-center"
          >
            <button
              type="button"
              className="text-black font-normal text-left bg-gray-100 px-4 py-3 border rounded-lg"
            >
              {category.replace(/_/g, ' ')}
            </button>
            <select
              className="px-4 py-3 bg-gray-100 text-black border rounded-lg focus:outline-none w-full"
              value={ikeProposalData[category] || ''}
              onChange={(e) => handleChange(category, e.target.value)}
            >
              <option value="">Select {category.replace(/_/g, ' ')}</option>
              {filteredIsecData[category].map((option, index) =>
                option?.[0] !== 'Pre-Shared Key' ? (
                  <option
                    key={`${category}-${option[0]}-${index}`}
                    value={option[0]}
                  >
                    {option[1]}
                  </option>
                ) : null,
              )}
            </select>
          </div>
        ))}
      </form>
    </div>
  );
}

export default IkeProposalConfig;
