import { useEffect, useRef } from 'react';
import { useIpsecData } from './api/ikeProposalItems';
import { useSelector, useDispatch } from 'react-redux';
import { IKEPROPOSALDATA } from '../vpnActions.jsx/actionTypes';

function IkeProposalConfig() {
  const hasInitialized = useRef(false);
  const { ipsecChoicesData, error, loading } = useIpsecData();
  const { ikeProposalData, selectedDevice } = useSelector((store) => store.vpn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      ipsecChoicesData &&
      !hasInitialized.current &&
      (!ikeProposalData || Object.keys(ikeProposalData).length === 0)
    ) {
      hasInitialized.current = true;

      const initialOptions = Object.keys(ipsecChoicesData).reduce(
        (acc, key) => {
          acc[key] = '';
          return acc;
        },
        {},
      );

      dispatch({
        type: IKEPROPOSALDATA,
        payload: {
          proposalName: '',
          ...initialOptions,
          device: selectedDevice,
        },
      });
    }
  }, [ipsecChoicesData, ikeProposalData, dispatch, selectedDevice]);

  const handleChange = (key, value) => {
    const updatedForm = {
      ...ikeProposalData,
      [key]: value,
      device: selectedDevice,
    };

    dispatch({
      type: IKEPROPOSALDATA,
      payload: updatedForm,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        {/* Spinner */}
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error.join(', ')}</p>;

  if (!ipsecChoicesData) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        {/* Spinner */}
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
          placeholder="Enter Proposal Name"
          className="px-4 py-3 bg-gray-100 text-black border rounded-lg focus:outline-none w-full"
          value={ikeProposalData.proposalName || ''}
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
