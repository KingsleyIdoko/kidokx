import { useEffect, useRef } from 'react';
import { useIpsecData } from './api/ikeProposalItems';
import { useSelector, useDispatch } from 'react-redux';
import { IKEPROPOSALDATA, VALIDATEDDATA } from '../vpnActions.jsx/actionTypes';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function IkeProposalConfig() {
  const hasInitialized = useRef(false);
  const { ipsecChoicesData, error, loading } = useIpsecData();
  const { ikeProposalData, selectedDevice, saveconfiguration, configtype } =
    useSelector((store) => store.vpn);
  const dispatch = useDispatch();

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: ikeProposalData,
  });

  useEffect(() => {
    if (
      ipsecChoicesData &&
      !hasInitialized.current &&
      (!ikeProposalData || Object.keys(ikeProposalData).length === 0)
    ) {
      hasInitialized.current = true;

      const initialOptions = Object.keys(ipsecChoicesData)
        .filter((key) => key !== 'authentication_method')
        .reduce((acc, key) => {
          acc[key] = '';
          return acc;
        }, {});

      dispatch({
        type: IKEPROPOSALDATA,
        payload: {
          proposalname: '',
          ...initialOptions,
          device: selectedDevice,
        },
      });
    }
  }, [ipsecChoicesData, ikeProposalData, dispatch, selectedDevice]);

  useEffect(() => {
    const validateAndPost = async () => {
      const fields = Object.keys(ikeProposalData || {});
      const isValid = await trigger(fields);

      if (!isValid) {
        dispatch({
          type: VALIDATEDDATA,
          payload: { valid: false },
        });
        return;
      }

      const formData = getValues();
      const finalPayload = {
        ...ikeProposalData,
        ...formData,
        device: selectedDevice,
      };

      try {
        await axios.post(
          'http://127.0.0.1:8000/api/ipsec/ikeproposal/create/',
          finalPayload,
        );

        dispatch({ type: IKEPROPOSALDATA, payload: finalPayload });

        dispatch({
          type: VALIDATEDDATA,
          payload: { valid: true },
        });
      } catch (err) {
        console.error('Post failed:', err.message);
        dispatch({
          type: VALIDATEDDATA,
          payload: { valid: false },
        });
      }
    };
    if (saveconfiguration && configtype === 'ikeproposal') {
      validateAndPost();
    }
  }, [saveconfiguration]);

  if (loading || !ipsecChoicesData) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error.join(', ')}</p>;

  return (
    <div className="w-[44rem] mx-auto bg-white rounded-lg p-6">
      <form className="grid grid-cols-2 space-y-4 gap-x-10 gap-y-4 items-center">
        <div className="col-span-2  grid grid-cols-2 gap-x-10 items-center">
          <div className="h-[3rem]">
            <button
              type="button"
              className="  px-4 py-3 bg-gray-100 text-black text-left border rounded-lg focus:outline-none w-full"
            >
              IKE Proposal Name
            </button>
          </div>
          <div className="h-[3rem] flex flex-col justify-between">
            <input
              {...register('proposalname', {
                required: 'Proposal Name is required',
              })}
              type="text"
              placeholder="Enter Proposal Name"
              className={` px-4 py-3 bg-gray-100 text-black border rounded-lg focus:outline-none w-full ${
                errors.proposalname ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div>
              {errors.proposalname ? (
                <p className="text-xs text-red-500 font-medium flex items-center">
                  {errors.proposalname.message}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {Object.keys(ikeProposalData || {})
          .filter((key) => key !== 'proposalname' && key !== 'device')
          .map((category) => (
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
              <div className="flex flex-col  justify-between">
                <select
                  {...register(category, {
                    required: `${category} is required`,
                  })}
                  className={`text-black font-normal text-left bg-gray-100 px-4 py-4 border rounded-lg ${
                    errors[category] ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select {category.replace(/_/g, ' ')}</option>
                  {ipsecChoicesData[category].map((option, index) =>
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
                <div>
                  <div className="h-2">
                    {errors[category] ? (
                      <p className="text-xs text-red-500 font-medium flex items-center">
                        {errors[category].message}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </form>
    </div>
  );
}

export default IkeProposalConfig;
