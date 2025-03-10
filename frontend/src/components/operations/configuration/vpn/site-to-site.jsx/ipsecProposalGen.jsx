import { useState, useEffect } from 'react';
import { useIpsecData } from './api/ikeProposalItems';
import IpsecSteps from './ipsec_steps';
import { Link } from 'react-router-dom';

function IPsecProposalConfig() {
  const { ikeProposalData, ipsecChoicesData, error, loading } = useIpsecData();

  const [selectedOptions, setSelectedOptions] = useState({ proposalName: '' });
  const [selectedFormat, setSelectedFormat] = useState('json');

  useEffect(() => {
    if (ipsecChoicesData) {
      setSelectedOptions((prev) => ({
        ...prev,
        ...Object.keys(ipsecChoicesData).reduce((acc, key) => {
          acc[key] = ipsecChoicesData[key]?.[0]?.[0] || '';
          return acc;
        }, {}),
      }));
    }
  }, [ipsecChoicesData]);

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
  if (!ikeProposalData || !ipsecChoicesData) {
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
  const filteredIsecData = Object.keys(ipsecChoicesData)
    .filter(
      (category) =>
        !['authentication_method', 'encapsulation_protocol'].includes(category),
    )
    .reduce((acc, key) => {
      acc[key] = ipsecChoicesData[key];
      return acc;
    }, {});

  return (
    <>
      <div className="w-[44rem] mx-auto bg-white rounded-lg p-6">
        <div className="flex mx-auto">
          <div className="w-[24rem] flex flex-col space-y-4">
            <button className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left">
              IPsec Proposal Name
            </button>
            {Object.keys(filteredIsecData).map((category) => (
              <button
                key={category}
                className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left"
              >
                {String(category).replace(/_/g, ' ')}
              </button>
            ))}
            <button className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left">
              lifetime-seconds
            </button>
          </div>
          <div className="w-[20rem] flex flex-col space-y-5">
            <input
              type="text"
              placeholder="Enter Name"
              className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
              value={selectedOptions.proposalName}
              onChange={(e) =>
                setSelectedOptions((prev) => ({
                  ...prev,
                  proposalName: e.target.value,
                }))
              }
            />
            {Object.keys(filteredIsecData).map((category) => (
              <select
                key={category}
                className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
                value={selectedOptions[category] || ''}
                onChange={(e) =>
                  setSelectedOptions((prev) => ({
                    ...prev,
                    [category]: e.target.value,
                  }))
                }
              >
                {filteredIsecData[category].map((option, index) =>
                  option[0] !== 'Pre-Shared Key' ? (
                    <option key={option[0] || index} value={option[0]}>
                      {option[1]}
                    </option>
                  ) : null,
                )}
              </select>
            ))}
            <input
              type="text"
              placeholder="Enter lifetime-seconds"
              className=" px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default IPsecProposalConfig;
