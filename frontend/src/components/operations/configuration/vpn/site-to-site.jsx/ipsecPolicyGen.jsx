import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIpsecPolicyData,
  setEditing,
  setConfigType,
  setValidated,
} from '../../../../store/reducers/vpnReducer';
import { setSelectedDevice } from '../../../../store/reducers/inventoryReducers';
import { useForm } from 'react-hook-form';

export default function IpsecPolicyConfig() {
  const dispatch = useDispatch();
  const {
    ipsecPolicyData,
    saveconfiguration,
    editeddata,
    editingData,
    configtype,
  } = useSelector((state) => state.vpn);
  const { selectedDevice } = useSelector((state) => state.inventories);

  const [ipsecProposalNames, setIpsecProposalNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    reset,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const ipsecPolicyLabels = [
    'IPSec Policy Name',
    'Description',
    'Perfect Forward Secrecy (PFS)',
    'IPSec Proposal',
  ];

  const submitForm = async (formData) => {
    const finalPayload = {
      ...formData,
      device: selectedDevice,
    };

    try {
      if (!editingData) {
        await axios.post(
          'http://127.0.0.1:8000/api/ipsec/ipsecpolicy/create/',
          finalPayload,
        );
      } else {
        await axios.put(
          `http://127.0.0.1:8000/api/ipsec/ipsecpolicy/${editeddata?.id}/update/`,
          finalPayload,
        );
        dispatch(setEditing(false));
      }

      dispatch(setIpsecPolicyData(finalPayload));
      dispatch(setConfigType(configtype));
      dispatch(setSelectedDevice(selectedDevice));
      dispatch(setValidated(true));
    } catch (err) {
      console.error('Post/Put failed:', err.message);
      dispatch(setValidated(false));
    }
  };
  useEffect(() => {
    if (saveconfiguration && configtype === 'ipsecpolicy') {
      handleSubmit(submitForm)();
    }
  }, [saveconfiguration, configtype, handleSubmit]);
  const fetchIpsecProposalNames = async () => {
    setLoading(true);
    let errorMessages = [];

    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/ipsec/ikeproposal/names/',
      );
      setIpsecProposalNames(response.data);
    } catch (err) {
      errorMessages.push(`Error fetching IPSec Proposal data: ${err.message}`);
      console.error('Error fetching IPSec Proposal data:', err);
    } finally {
      setError(errorMessages.length ? errorMessages : null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpsecProposalNames();
  }, []);

  return (
    <form
      className="w-[44rem] mx-auto bg-white rounded-lg p-6"
      onSubmit={handleSubmit(submitForm)}
    >
      <div className="flex items-center justify-between">
        <div className="w-[24rem] flex flex-col space-y-4">
          {ipsecPolicyLabels.map((label_name, index) => (
            <button
              key={index}
              type="button"
              className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left"
            >
              {label_name}
            </button>
          ))}
        </div>

        <div className="w-[20rem] flex flex-col space-y-5">
          <input
            {...register('policy_name', {
              required: 'Policy Name is required',
            })}
            type="text"
            placeholder="Enter IPSec Policy Name"
            className={`px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none ${
              errors.policy_name ? 'border-red-500' : 'border-gray-300'
            }`}
          />

          <input
            {...register('ipsecpolicy_description', {
              required: 'Description field is required',
            })}
            type="text"
            placeholder="Enter Description"
            className={`px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none ${
              errors.ipsecpolicy_description
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />

          <select
            {...register('pfs_group', {
              required: 'PFS Group is required',
            })}
            className={`px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none ${
              errors.pfs_group ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select PFS Group</option>
            <option value="group2">Group 2</option>
            <option value="group5">Group 5</option>
            <option value="group14">Group 14</option>
            <option value="group19">Group 19</option>
            <option value="group20">Group 20</option>
          </select>

          <select
            {...register('ike_proposal', {
              required: 'IPSec Proposal is required',
            })}
            className={`px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none ${
              errors.ike_proposal ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select IPSec Proposal</option>
            {ipsecProposalNames &&
              ipsecProposalNames.map((proposal, index) => (
                <option key={index} value={proposal}>
                  {proposal}
                </option>
              ))}
          </select>
        </div>
      </div>
    </form>
  );
}
