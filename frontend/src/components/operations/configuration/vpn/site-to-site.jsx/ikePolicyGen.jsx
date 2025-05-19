import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setIkePolicyData,
  setEditing,
  setConfigType,
  setValidated,
} from "../../../../store/reducers/vpnReducer";
import { setSelectedDevice } from "../../../../store/reducers/inventoryReducers";
import { useForm } from "react-hook-form";

export default function IkePolicyConfig() {
  const dispatch = useDispatch();
  const {
    ikePolicyData = {},
    saveconfiguration,
    configtype,
    editingData,
    editeddata,
  } = useSelector((state) => state.vpn);
  const { selectedDevice } = useSelector((state) => state.inventories);
  const [ikeProposalNames, setIkeProposalNames] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (editingData && editeddata && ikeProposalNames.length > 0) {
      reset(editeddata);
    } else if (ikePolicyData && ikeProposalNames.length > 0) {
      reset(ikePolicyData);
    }
  }, [ikePolicyData, editingData, editeddata, ikeProposalNames, reset]);

  useEffect(() => {
    const fetchIkeProposalNames = async () => {
      if (!selectedDevice) return;
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/ipsec/ikeproposal/names/?device=${selectedDevice}`
        );
        setIkeProposalNames(response.data);
      } catch (err) {
        console.error("Error fetching IKE Proposal data:", err);
      }
    };

    fetchIkeProposalNames();
  }, [selectedDevice]);

  const submitForm = async (values) => {
    const finalPayload = { ...values, device: selectedDevice };
    console.log(finalPayload);
    try {
      if (!editingData) {
        await axios.post(
          "http://127.0.0.1:8000/api/ipsec/ikepolicy/create/",
          finalPayload
        );
      } else {
        await axios.put(
          `http://127.0.0.1:8000/api/ipsec/ikepolicy/${editeddata?.id}/update/`,
          finalPayload
        );
        dispatch(setEditing(false));
      }
      dispatch(setIkePolicyData(finalPayload));
      dispatch(setConfigType(configtype));
      dispatch(setSelectedDevice(selectedDevice));
      dispatch(setValidated(true));
    } catch (err) {
      console.error("Post/Put failed:", err.message);
      dispatch(setValidated(false));
    }
  };

  useEffect(() => {
    if (saveconfiguration && configtype === "ikepolicy") {
      handleSubmit(submitForm)();
    }
  }, [saveconfiguration, configtype, handleSubmit]);

  const ikePolicyLabels = [
    "IKE Policy Name",
    "IKE Mode",
    "IKE Proposal",
    "Authentication Method",
    "Pre_Shared_Key",
  ];

  return (
    <form
      className="w-[44rem] mx-auto bg-white rounded-lg p-6"
      onSubmit={handleSubmit(submitForm)}
    >
      <div className="flex items-center justify-between">
        <div className="w-[24rem] flex flex-col space-y-4">
          {ikePolicyLabels.map((label_name, index) => (
            <div
              key={index}
              className="h-[4.2rem] flex flex-col justify-between"
            >
              <div className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left">
                {label_name}
              </div>
            </div>
          ))}
        </div>

        <div className="w-[20rem] flex flex-col space-y-5">
          <div className="h-[4rem] flex flex-col justify-between">
            <input
              {...register("policyname", {
                required: "Policy Name is required",
              })}
              type="text"
              placeholder="Enter Name"
              className={`px-4 py-3 bg-gray-100 border rounded-lg text-left focus:outline-none ${
                errors.policyname ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.policyname && (
              <p className="text-xs text-red-500 font-medium flex items-center">
                {errors.policyname.message}
              </p>
            )}
          </div>

          <div className="h-[4rem] flex flex-col justify-between">
            <select
              {...register("mode", { required: "Select IKE Mode" })}
              className={`px-4 py-3 bg-gray-100 border rounded-lg text-left focus:outline-none ${
                errors.mode ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Mode</option>
              <option value="main">Main</option>
              <option value="aggressive">Aggressive</option>
            </select>
            {errors.mode && (
              <p className="text-xs text-red-500 font-medium flex items-center">
                {errors.mode.message}
              </p>
            )}
          </div>

          <div className="h-[4rem] flex flex-col justify-between">
            <select
              {...register("proposals", { required: "Select a Proposal Name" })}
              defaultValue={editeddata?.proposals || ""}
              className={`px-4 py-3 bg-gray-100 border rounded-lg text-left focus:outline-none ${
                errors.proposals ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a Proposal</option>
              {ikeProposalNames.map((name, i) => (
                <option key={i} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {errors.proposals && (
              <p className="text-xs text-red-500 font-medium flex items-center">
                {errors.proposals.message}
              </p>
            )}
          </div>

          <div className="h-[4rem] flex flex-col justify-between">
            <select
              {...register("authentication_method", {
                required: "Select Authentication Method",
              })}
              className={`px-4 py-3 bg-gray-100 border rounded-lg text-left focus:outline-none ${
                errors.authentication_method
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select Auth Method</option>
              <option value="pre-shared-key">Pre-Shared Key</option>
              <option value="rsa">RSA</option>
            </select>
            {errors.authentication_method && (
              <p className="text-xs text-red-500 font-medium flex items-center">
                {errors.authentication_method.message}
              </p>
            )}
          </div>

          <div className="h-[4rem] flex flex-col justify-between">
            <input
              {...register("pre_shared_key", {
                required: "Preshared Key is required",
              })}
              type="text"
              placeholder="Enter Preshared Key"
              className={`px-4 py-3 bg-gray-100 border rounded-lg text-left focus:outline-none ${
                errors.pre_shared_key ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.pre_shared_key && (
              <p className="text-xs text-red-500 font-medium flex items-center">
                {errors.pre_shared_key.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
