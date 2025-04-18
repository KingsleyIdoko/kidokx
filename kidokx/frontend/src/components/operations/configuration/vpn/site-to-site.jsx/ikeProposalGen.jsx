import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import {
  setConfigType,
  setIkeProposalData,
  setValidated,
  setEditing,
} from '../../../../store/reducers/vpnReducer';
import { setSelectedDevice } from '../../../../store/reducers/inventoryReducers';

const ikeproposalforms = [
  { name: 'Proposal Name', value: '' },
  {
    name: 'Authentication Algorithm',
    value: ['md5', 'sha1', 'sha256', 'sha384', 'sha512'],
  },
  {
    name: 'DH Group',
    value: [
      'group1',
      'group2',
      'group5',
      'group14',
      'group15',
      'group16',
      'group19',
      'group20',
      'group21',
    ],
  },
  {
    name: 'Encryption Algorithm',
    value: [
      'aes-128-cbc',
      'aes-192-cbc',
      'aes-256-cbc',
      'aes-128-gcm',
      'aes-192-gcm',
      'aes-256-gcm',
      '3des',
    ],
  },
  { name: 'Lifetime Seconds', value: '86400' },
];

function IkeProposalConfig() {
  const dispatch = useDispatch();
  const {
    ikeProposalData,
    saveconfiguration,
    configtype,
    editeddata,
    editingData,
  } = useSelector((store) => store.vpn);

  const { selectedDevice } = useSelector((store) => store.inventories);

  const defaultValues = ikeproposalforms.reduce((acc, curr) => {
    const fieldName = curr.name.toLowerCase().replace(/\\s+/g, '_');
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
    if (editeddata?.id) {
      dispatch(setIkeProposalData({ ...editeddata }));
      reset({
        ...editeddata,
        proposal_name: editeddata.proposalname || '',
      });
    }
  }, [editeddata, dispatch, reset]);

  const submitForm = async (formData) => {
    if (!formData.lifetime_seconds) formData.lifetime_seconds = '86400';
    const { proposal_name, ...rest } = formData;
    const transformedData = {
      ...rest,
      proposalname: proposal_name,
    };
    const finalPayload = {
      ...ikeProposalData,
      ...transformedData,
      device: selectedDevice,
    };
    try {
      if (!editingData) {
        await axios.post(
          'http://127.0.0.1:8000/api/ipsec/ikeproposal/create/',
          finalPayload,
        );
      } else {
        await axios.put(
          `http://127.0.0.1:8000/api/ipsec/ikeproposal/${editeddata?.id}/update/`,
          finalPayload,
        );
        dispatch(setEditing(false));
      }
      dispatch(setIkeProposalData(finalPayload));
      dispatch(setConfigType(configtype));
      dispatch(setSelectedDevice(selectedDevice));
      dispatch(setValidated(true));
    } catch (err) {
      console.error('Post/Put failed:', err.message);
      dispatch(setValidated(false));
    }
  };

  useEffect(() => {
    if (saveconfiguration && configtype === 'ikeproposal') {
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
        {ikeproposalforms.map((formItem) => {
          const fieldName = formItem.name.toLowerCase().replace(/\s+/g, '_');
          const isTextInput = typeof formItem.value === 'string';
          const fieldErrorClass = `text-black bg-gray-100 border rounded-lg focus:outline-none w-full ${errorClass(
            fieldName,
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
                    placeholder={
                      fieldName === 'lifetime_seconds'
                        ? '86400'
                        : `Enter ${formItem.name}`
                    }
                    className={`${fieldErrorClass} px-4 py-3 ${
                      editingData && fieldName === 'proposal_name'
                        ? 'bg-gray-200 opacity-70 cursor-not-allowed'
                        : ''
                    }`}
                    disabled={editingData && fieldName === 'proposalname'}
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
