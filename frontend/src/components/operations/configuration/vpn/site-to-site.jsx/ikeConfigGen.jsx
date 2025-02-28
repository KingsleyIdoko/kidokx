import { useState, useEffect } from 'react';
import { useIpsecData } from './ikeProposalItems';
import React from 'react';

function IkeProposalConfig() {
  const { ikeProposalData, ipsecChoicesData, error, loading } = useIpsecData();

  // ✅ Hooks should always be at the top level!
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedFormat, setSelectedFormat] = useState('json');

  // ✅ Ensure `selectedOptions` is initialized only after `ipsecChoicesData` is available
  useEffect(() => {
    if (ipsecChoicesData) {
      setSelectedOptions(
        Object.keys(ipsecChoicesData).reduce((acc, key) => {
          acc[key] = ipsecChoicesData[key]?.[0]?.[0] || '';
          return acc;
        }, {}),
      );
    }
  }, [ipsecChoicesData]); // ✅ Only runs when `ipsecChoicesData` updates

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error.join(', ')}</p>;
  }

  if (!ikeProposalData || !ipsecChoicesData) {
    return <p>No data available</p>;
  }

  return (
    <div className="w-[56rem] mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-lg font-semibold text-center mb-6 uppercase">
        SRX Ipsec Proposal Configuration
      </h2>

      {/* Buttons Section */}
      <div className="flex mx-auto items-center justify-between">
        <div className="w-[32rem] flex flex-col space-y-4 items-center justify-center">
          {Object.keys(ipsecChoicesData).map((category) => (
            <button
              key={category}
              className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left"
            >
              {String(category).replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Dropdown Selection Section */}
        <div className="w-[24rem] flex flex-col space-y-5 items-center justify-center">
          {Object.keys(ipsecChoicesData).map((category) => (
            <select
              key={category}
              className="w-1/2 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left"
              value={selectedOptions[category] || ''}
              onChange={(e) =>
                setSelectedOptions((prev) => ({
                  ...prev,
                  [category]: e.target.value,
                }))
              }
            >
              {ipsecChoicesData[category].map((option, index) => (
                <option key={index} value={option[0]}>
                  {option[1]} {/* Use human-readable name */}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {/* Preview & Deploy Buttons */}
      <div className="max-w-2xl mt-10 flex items-center justify-between space-x-10 mx-auto">
        <button className="capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 hover:opacity-70">
          preview
        </button>
        <div className="flex space-x-3 items-center justify-center">
          <label htmlFor="format" className="capitalize p-2 border rounded-lg">
            format:
          </label>
          <select
            id="format"
            className="border p-2 bg-gray-100 rounded-lg w-32 cursor-pointer"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
          >
            <option value="json" className="uppercase">
              JSON
            </option>
            <option value="xml" className="uppercase">
              XML
            </option>
            <option value="cli" className="uppercase">
              CLI
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
