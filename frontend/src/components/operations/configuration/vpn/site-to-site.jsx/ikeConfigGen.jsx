import { useState, useEffect } from 'react';
import { useIpsecData } from './api/ikeProposalItems';

function IkeProposalConfig() {
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

  if (loading) return <p>Loading...</p>;
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
    .filter((category) => category !== 'authentication_method')
    .reduce((acc, key) => {
      acc[key] = ipsecChoicesData[key];
      return acc;
    }, {});

  return (
    <div className="w-[56rem] mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <button className="capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 opacity-50">
          Previous
        </button>

        <h2 className="text-lg font-semibold text-center flex-1 capitalize">
          Juniper IKE Proposal Configuration
        </h2>

        <button className="capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 hover:opacity-70">
          <a href="/vpn/site-to-site/config/ikepolicy">Next</a>
        </button>
      </div>
      <div className="flex mx-auto items-center justify-between mb-6 ">
        {/* Buttons */}
        <div className="w-[32rem] flex flex-col space-y-4 items-center justify-center">
          <button className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left">
            IKE Proposal Name
          </button>
          {Object.keys(filteredIsecData).map((category) => (
            <button
              key={category}
              className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left"
            >
              {String(category).replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <div className="w-[24rem] flex flex-col space-y-5 items-center justify-center">
          <input
            type="text"
            placeholder="Enter Name"
            className="w-1/2 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
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
              className="w-1/2 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
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
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button className="capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 hover:opacity-70">
          preview
        </button>
        <div className="flex space-x-3 items-center justify-center">
          <button
            htmlFor="format"
            className="capitalize text-black bg-gray-100 rounded-lg py-2 px-6 hover:opacity-70"
          >
            format:
          </button>
          <select
            id="format"
            className="capitalize  text-black rounded-lg py-2 px-6 hover:opacity-70 focus:outline-none"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
          >
            <option value="json" className="capitalize">
              json
            </option>
            <option value="xml" className="capitalize">
              xml
            </option>
            <option value="cli" className="capitalize">
              cli
            </option>
          </select>
        </div>
        <button className="capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 duration-200 hover:opacity-70">
          deploy
        </button>
      </div>
    </div>
  );
}
export default IkeProposalConfig;
