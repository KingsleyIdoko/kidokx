import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { vpnproposalforms } from './api/postikeproposal';
import {
  setConfigType,
  setIpsecProposalData,
  setValidated,
  setEditing,
} from '../../../../store/reducers/vpnReducer';
import { setSelectedDevice } from '../../../../store/reducers/inventoryReducers';

function IkeProposalConfig() {
  const dispatch = useDispatch();
  const { saveconfiguration, configtype, editeddata, editingData } =
    useSelector((store) => store.vpn);
  const { selectedDevice } = useSelector((store) => store.inventories);

  const transformedEditedData = useMemo(() => {
    if (editeddata?.id && editeddata?.proposalname) {
      return { ...editeddata, proposal_name: editeddata.proposalname };
    }
    return null;
  }, [editeddata]);

  const defaultValues = vpnproposalforms.reduce((acc, curr) => {
    const fieldName = curr.name.toLowerCase().replace(/\s+/g, '_');
    acc[fieldName] = curr.value instanceof Array ? '' : curr.value;
    return acc;
  }, {});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onChange', defaultValues });

  useEffect(() => {
    if (transformedEditedData) {
      reset(transformedEditedData);
    }
  }, [transformedEditedData, reset]);

  const submitForm = async (formData) => {
    const { proposal_name, ...rest } = formData;
    const finalPayload = {
      ...rest,
      device: selectedDevice,
      proposalname: proposal_name,
      is_published: false,
      is_sendtodevice: false,
    };
    console.log(finalPayload);
    try {
      if (!editingData) {
        await axios.post(
          'http://127.0.0.1:8000/api/ipsec/ipsecproposal/create/',
          finalPayload
        );
      } else {
        await axios.put(
          `http://127.0.0.1:8000/api/ipsec/ipsecproposal/${editeddata?.id}/update/`,
          finalPayload
        );
        dispatch(setEditing(false));
      }
      dispatch(setIpsecProposalData(finalPayload));
      dispatch(setConfigType(configtype));
      dispatch(setSelectedDevice(selectedDevice));
      dispatch(setValidated(true));
    } catch (err) {
      console.error('Post/Put failed:', err.message);
      dispatch(setValidated(false));
    }
  };

  useEffect(() => {
    if (saveconfiguration && configtype === 'ipsecproposal') {
      handleSubmit(submitForm)();
    }
  }, [saveconfiguration, configtype, handleSubmit]);

  const errorClass = (field) =>
    errors[field] ? 'border-red-500' : 'border-gray-300';

  return (
    <div className="w-[44rem] mx-auto bg-white rounded-lg p-6">
      <form
        className="grid grid-cols-2 space-y-4 gap-x-10 gap-y-4 items-center"
        onSubmit={handleSubmit(submitForm)}
      >
        {vpnproposalforms.map((formItem) => {
          const fieldName = formItem.name.toLowerCase().replace(/\s+/g, '_');
          const isTextInput = typeof formItem.value === 'string';
          const fieldErrorClass = `text-black bg-gray-100 border rounded-lg focus:outline-none w-full ${errorClass(
            fieldName
          )}`;

          return (
            <div
              key={`${fieldName}-wrapper`}
              className="col-span-2 grid grid-cols-2 gap-x-10 items-center"
            >
              <button
                type="button"
                className="text-black font-normal text-left bg-gray-100 px-4 py-3 border rounded-lg"
              >
                {formItem.name}
              </button>
              <div className="flex flex-col justify-between">
                {isTextInput ? (
                  <input
                    {...register(fieldName, {
                      required: `${formItem.name} is required`,
                    })}
                    type="text"
                    placeholder={formItem.name}
                    className={`${fieldErrorClass} px-4 py-3 ${
                      editingData && fieldName === 'proposal_name'
                        ? 'bg-gray-200 opacity-70 cursor-not-allowed'
                        : ''
                    }`}
                    disabled={editingData && fieldName === 'proposal_name'}
                  />
                ) : (
                  <select
                    {...register(fieldName, {
                      required: `${formItem.name} is required`,
                    })}
                    className={`${fieldErrorClass} px-4 py-4`}
                  >
                    <option value="">Select {formItem.name}</option>
                    {formItem.value.map((option, i) => (
                      <option
                        key={`${fieldName}-${option}-${i}`}
                        value={option}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                {errors[fieldName] && (
                  <p className="text-xs text-red-500 font-medium flex items-center">
                    {errors[fieldName].message}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </form>
    </div>
  );
}

export default IkeProposalConfig;
