import { useState, useEffect } from 'react';
import { useIpsecData } from './api/ikeProposalItems';

function IkeProposalConfig({ onConfigChange, selectedDevice }) {
  const { ikeProposalData, ipsecChoicesData, error, loading } = useIpsecData();
  const [selectedOptions, setSelectedOptions] = useState({ proposalName: '' });

  useEffect(() => {
    if (ipsecChoicesData) {
      const initialOptions = Object.keys(ipsecChoicesData).reduce(
        (acc, key) => {
          acc[key] = ipsecChoicesData[key]?.[0]?.[0] || '';
          return acc;
        },
        {},
      );

      setSelectedOptions((prev) => ({ ...prev, ...initialOptions }));
    }
  }, [ipsecChoicesData]);

  const handleChange = (key, value) => {
    const updatedOptions = { ...selectedOptions, [key]: value };
    setSelectedOptions(updatedOptions);
    onConfigChange(updatedOptions); // Update parent explicitly after each change
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
    .filter((category) => category !== 'authentication_method')
    .reduce((acc, key) => {
      acc[key] = ipsecChoicesData[key];
      return acc;
    }, {});

  return (
    <div className="w-[44rem] mx-auto bg-white rounded-lg p-6">
      <form className="grid grid-cols-2 gap-x-10 gap-y-4 items-center">
        <button
          type="button"
          className="text-black font-normal text-left bg-gray-100 px-4 py-3 border rounded-lg"
        >
          IKE Proposal Name
        </button>
        <input
          type="text"
          placeholder="Enter Name"
          className="px-4 py-3 bg-gray-100 text-black border rounded-lg focus:outline-none w-full"
          value={selectedOptions.proposalName}
          onChange={(e) => handleChange('proposalName', e.target.value)}
        />

        {Object.keys(filteredIsecData).map((category) => (
          <div
            key={`${category}-wrapper`}
            className="col-span-2 grid grid-cols-2 gap-x-10 items-center"
          >
            <button
              type="button"
              className="text-black font-normal text-left bg-gray-100 px-4 py-3 border rounded-lg"
            >
              {String(category).replace(/_/g, ' ')}
            </button>
            <select
              className="px-4 py-3 bg-gray-100 text-black border rounded-lg focus:outline-none w-full"
              value={selectedOptions[category] || ''}
              onChange={(e) => handleChange(category, e.target.value)}
            >
              {filteredIsecData[category].map((option, index) =>
                option[0] !== 'Pre-Shared Key' ? (
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
