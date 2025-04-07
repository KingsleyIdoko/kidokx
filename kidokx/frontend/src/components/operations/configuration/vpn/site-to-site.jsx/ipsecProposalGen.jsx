import { useState, useEffect } from 'react';
import { useIpsecData } from './api/ikeProposalItems';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { IPSECPROPOSALDATA } from '../../../../store/reducers/vpnReducer';

function IPsecProposalConfig() {
  const { ikeProposalData, ipsecChoicesData, error, loading } = useIpsecData();
  const dispatch = useDispatch();
  const { selectedDevice } = useSelector((state) => state.vpn);
  const [selectedOptions, setSelectedOptions] = useState({
    proposalName: '',
    lifetime_seconds: '',
  });

  useEffect(() => {
    if (ipsecChoicesData) {
      setSelectedOptions((prev) => ({
        ...prev,
        ...Object.keys(ipsecChoicesData).reduce((acc, key) => {
          acc[key] = ''; // Set to empty so user must choose explicitly
          return acc;
        }, {}),
      }));
    }
  }, [ipsecChoicesData]);

  useEffect(() => {
    const filteredOptions = Object.entries(selectedOptions).reduce(
      (acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );

    const updateOptions = {
      ...filteredOptions,
      device: selectedDevice,
    };

    if (Object.keys(updateOptions).length > 1) {
      dispatch({ type: IPSECPROPOSALDATA, payload: updateOptions });
    }
  }, [selectedOptions, selectedDevice, dispatch]);

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

  const getPlaceholderText = (category) => {
    if (category.includes('authentication'))
      return 'Select Authentication Algorithm';
    if (category.includes('encryption')) return 'Select Encryption Algorithm';
    if (category.includes('dh_group')) return 'Select DH Group';
    if (category.includes('lifetime')) return 'Select Lifetime';
    return `Select ${category.replace(/_/g, ' ')}`;
  };

  return (
    <div className="w-[44rem] mx-auto bg-white rounded-lg p-6">
      <div className="flex mx-auto">
        <div className="w-[24rem] flex flex-col space-y-4">
          <div className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left">
            IPsec Proposal Name
          </div>

          {Object.keys(filteredIsecData).map((category) => (
            <div
              key={category}
              className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left"
            >
              {String(category).replace(/_/g, ' ')}
            </div>
          ))}

          <div className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left">
            lifetime-seconds
          </div>
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
              <option value="">{getPlaceholderText(category)}</option>
              {filteredIsecData[category]
                .filter((option) => option[0] !== 'Pre-Shared Key')
                .map((option, index) => (
                  <option key={option[0] || index} value={option[0]}>
                    {option[1]}
                  </option>
                ))}
            </select>
          ))}

          <input
            type="text"
            placeholder="Enter lifetime-seconds"
            className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
            value={selectedOptions.lifetime_seconds}
            onChange={(e) =>
              setSelectedOptions((prev) => ({
                ...prev,
                lifetime_seconds: e.target.value,
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}

export default IPsecProposalConfig;
