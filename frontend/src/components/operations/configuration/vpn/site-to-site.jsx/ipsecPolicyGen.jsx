import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setIpsecPolicyData,
  setEditing,
  setConfigType,
  setValidated,
  setSaveConfiguration,
} from "../../../../store/reducers/vpnReducer";
import { setSelectedDevice } from "../../../../store/reducers/inventoryReducers";
import { useForm } from "react-hook-form";
import { isEqual } from "lodash";

export default function IpsecPolicyConfig() {
  const dispatch = useDispatch();
  const { saveconfiguration, editeddata, editingData, configtype } =
    useSelector((state) => state.vpn);
  const { selectedDevice } = useSelector((state) => state.inventories);
  const [ipsecProposalNames, setIpsecProposalNames] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const ipsecPolicyLabels = [
    "IPSec Policy Name",
    "Description",
    "Perfect Forward Secrecy (PFS)",
    "IPSec Proposal",
  ];

  useEffect(() => {
    if (editingData && editeddata && ipsecProposalNames.length > 0) {
      reset({
        policy_name: editeddata.policy_name || "",
        description: editeddata.description || "",
        pfs_group: editeddata.pfs_group || "",
        ipsec_proposal: editeddata.ipsec_proposal || "",
      });
    }
  }, [editingData, editeddata, ipsecProposalNames, reset]);

  const submitForm = async (formData) => {
    const fieldsToCompare = [
      "policy_name",
      "description",
      "ipsec_proposal",
      "pfs_group",
    ];
    const originalData = Object.fromEntries(
      fieldsToCompare.map((k) => [k, editeddata[k]])
    );
    const currentData = Object.fromEntries(
      fieldsToCompare.map((k) => [k, formData[k]])
    );

    let payload = formData;
    if (editingData && !isEqual(currentData, originalData)) {
      payload = { ...formData, is_published: false };
    }
    const finalPayload = {
      ...payload,
      device: selectedDevice,
    };
    try {
      if (editingData && editeddata?.id) {
        await axios.put(
          `http://127.0.0.1:8000/api/ipsec/ipsecpolicy/${editeddata.id}/update/`,
          finalPayload
        );
        dispatch(setEditing(false));
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/ipsec/ipsecpolicy/create/",
          finalPayload
        );
      }
      dispatch(setIpsecPolicyData(finalPayload));
      dispatch(setConfigType(configtype));
      dispatch(setSelectedDevice(selectedDevice));
      dispatch(setValidated(true));
    } catch (err) {
      const fieldErrors = err.response?.data;
      if (fieldErrors?.policy_name?.[0]) {
        setError("policy_name", {
          type: "server",
          message: fieldErrors.policy_name[0],
        });
      }
      dispatch(setValidated(false));
    } finally {
      dispatch(setSaveConfiguration(false));
    }
  };

  useEffect(() => {
    if (saveconfiguration && configtype === "ipsecpolicy") {
      handleSubmit(submitForm)();
    }
  }, [saveconfiguration, configtype, handleSubmit]);

  const fetchIpsecProposalNames = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/ipsec/ipsecproposal/names/?device=${selectedDevice}`
      );
      setIpsecProposalNames(response.data);
    } catch (err) {
      console.error("Error fetching IPSec Proposal data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpsecProposalNames();
  }, [selectedDevice]);

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
          <div className="flex flex-col space-y-1">
            <input
              {...register("policy_name", {
                required: "Policy Name is required",
              })}
              type="text"
              placeholder="Enter IPSec Policy Name"
              className={`px-4 py-3 bg-gray-100 text-black border rounded-lg focus:outline-none ${
                errors.policy_name ? "border-red-500" : "border-gray-300"
              } ${
                editingData ? "bg-gray-200 opacity-30 cursor-not-allowed" : ""
              }`}
              disabled={editingData}
            />
            {errors.policy_name && (
              <p className="text-sm text-red-500">
                {errors.policy_name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <input
              {...register("description", {
                required: "Description is required",
              })}
              type="text"
              placeholder="Enter Description"
              className={`px-4 py-3 bg-gray-100 text-black border rounded-lg focus:outline-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <select
              {...register("pfs_group", {
                required: "PFS Group is required",
              })}
              className={`px-4 py-3 bg-gray-100 text-black border rounded-lg focus:outline-none ${
                errors.pfs_group ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select PFS Group</option>
              <option value="group2">Group 2</option>
              <option value="group5">Group 5</option>
              <option value="group14">Group 14</option>
              <option value="group19">Group 19</option>
              <option value="group20">Group 20</option>
            </select>
            {errors.pfs_group && (
              <p className="text-sm text-red-500">{errors.pfs_group.message}</p>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <select
              {...register("ipsec_proposal", {
                required: "IPSec Proposal is required",
              })}
              className={`px-4 py-3 bg-gray-100 text-black border rounded-lg focus:outline-none ${
                errors.ipsec_proposal ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select IPSec Proposal</option>
              {ipsecProposalNames.map((proposal, index) => (
                <option key={index} value={proposal}>
                  {proposal}
                </option>
              ))}
            </select>
            {errors.ipsec_proposal && (
              <p className="text-sm text-red-500">
                {errors.ipsec_proposal.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
