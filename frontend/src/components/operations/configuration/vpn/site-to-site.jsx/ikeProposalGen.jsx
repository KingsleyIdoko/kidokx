import { useEffect, useRef } from 'react';
import { useIpsecData } from './api/ikeProposalItems';
import { useSelector, useDispatch } from 'react-redux';
import { IKEPROPOSALDATA } from '../vpnActions.jsx/actionTypes';
import { useForm } from 'react-hook-form';

function IkeProposalConfig() {
  const hasInitialized = useRef(false);
  const { ipsecChoicesData, error, loading } = useIpsecData();
  const { ikeProposalData, selectedDevice } = useSelector((store) => store.vpn);
  const dispatch = useDispatch();

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: ikeProposalData,
  });

  // Initialize form values from Redux on load
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

  // Watch for form changes and dispatch automatically
  useEffect(() => {
    const subscription = watch((formData) => {
      dispatch({
        type: IKEPROPOSALDATA,
        payload: { ...ikeProposalData, ...formData, device: selectedDevice },
      });
    });

    return () => subscription.unsubscribe();
  }, [watch, dispatch, ikeProposalData, selectedDevice]);

  if (loading || !ipsecChoicesData) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error.join(', ')}</p>;

  const filteredIsecData = Object.keys(ipsecChoicesData)
    .filter((category) => category !== 'authentication_method')
    .reduce((acc, key) => {
      acc[key] = ipsecChoicesData[key];
      return acc;
    }, {});

  return (
    <div className="w-[44rem] mx-auto bg-white rounded-lg p-6">
      <form className="grid grid-cols-2 gap-x-10 gap-y-4 items-center">
        {/* Proposal Name */}
        <div className="col-span-2 grid grid-cols-2 gap-x-10 items-center">
          <button
            type="button"
            className="text-black font-normal text-left bg-gray-100 px-4 py-3 border rounded-lg"
          >
            IKE Proposal Name
          </button>
          <div>
            <input
              {...register('proposalName', {
                required: 'Proposal Name is required',
              })}
              type="text"
              placeholder="Enter Proposal Name"
              className={`px-4 py-3 bg-gray-100 text-black border rounded-lg focus:outline-none w-full ${
                errors.proposalName ? 'border-red-500' : ''
              }`}
            />
            {errors.proposalName && (
              <span className="text-red-500 text-sm">
                {errors.proposalName.message}
              </span>
            )}
          </div>
        </div>

        {/* Dynamically Rendered Dropdowns */}
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
            <div>
              <select
                {...register(category, { required: true })}
                className={`px-4 py-3 bg-gray-100 text-black border rounded-lg focus:outline-none w-full ${
                  errors[category] ? 'border-red-500' : ''
                }`}
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
              {errors[category] && (
                <span className="text-red-500 text-sm">Required</span>
              )}
            </div>
          </div>
        ))}
      </form>
    </div>
  );
}

export default IkeProposalConfig;
