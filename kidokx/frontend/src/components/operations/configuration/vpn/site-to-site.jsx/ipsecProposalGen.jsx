import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIpsecProposalData } from '../../../../store/reducers/vpnReducer';

function IPsecProposalConfig() {
  const dispatch = useDispatch();
  const { selectedDevice } = useSelector((state) => state.vpn);

  const [selectedOptions, setSelectedOptions] = useState({
    proposalName: '',
    lifetime_seconds: '',
  });

  const filteredIsecData = {}; // Placeholder to prevent rendering errors

  useEffect(() => {
    setSelectedOptions((prev) => ({
      ...prev,
      proposalName: '',
      lifetime_seconds: '',
    }));
  }, []);

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
      dispatch(setIpsecProposalData(updateOptions));
    }
  }, [selectedOptions, selectedDevice, dispatch]);

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
