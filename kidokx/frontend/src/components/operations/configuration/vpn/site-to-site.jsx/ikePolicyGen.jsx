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

  const [ikeProposalNames, setIkeProposalNames] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (ikePolicyData && Object.keys(ikePolicyData).length > 0) {
      reset(ikePolicyData);
    }
  }, [ikePolicyData, reset]);

  const ikePolicyLabels = [
    "IKE Policy Name",
    "IKE Mode",
    "IKE Proposal",
    "Authentication Method",
    "Pre_Shared_Key",
  ];

  const fetchIkeProposalNames = async () => {
    setLoading(true);
    let errorMessages = [];

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/ipsec/ikeproposal/names/"
      );
      setIkeProposalNames(response.data);
    } catch (err) {
      errorMessages.push(`Error fetching data: ${err.message}`);
      console.error("Error fetching IKE Proposal data:", err);
    } finally {
      setError(errorMessages.length ? errorMessages : null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIkeProposalNames();
  }, []);

  useEffect(() => {
    const validateAndPost = async () => {
      const fields = [
        "proposals",
        "policyname",
        "mode",
        "authentication_method",
        "pre_shared_key",
      ];

      const isValid = await trigger(fields);
      if (!isValid) return;

      const values = getValues();
      const ikePolicyData = fields.reduce((acc, key) => {
        acc[key] = values[key];
        return acc;
      }, {});

      const finalPayload = {
        ...ikePolicyData,
        device: selectedDevice,
      };

      const isValidPayload = Object.entries(finalPayload).every(
        ([key, value]) => value !== undefined && value !== null && value !== ""
      );

      if (!isValidPayload) {
        console.error(
          "Final payload is missing required fields:",
          finalPayload
        );
        dispatch(setValidated(false));
        return;
      }
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

    if (saveconfiguration && configtype === "ikepolicy") {
      validateAndPost();
    }
  }, [saveconfiguration, configtype]);

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

  if (error) return <p className="text-red-500">{error.join(", ")}</p>;
  if (!ikeProposalNames)
    return <p className="text-gray-500">No IKE proposals available</p>;

  return (
    <div className="w-[44rem] mx-auto bg-white rounded-lg p-6">
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
                required: "Policy Name is Required",
              })}
              type="text"
              placeholder="Enter Name"
              className={`px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none ${
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
              className={`px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none ${
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
              {...register("proposals", {
                required: "Select a Proposal Name",
              })}
              className={`px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none ${
                errors.proposals ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a Proposal</option>
              {ikeProposalNames.map((proposal, index) => (
                <option key={index} value={proposal}>
                  {proposal}
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
              className={`px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none ${
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
                required: "Preshared Password is Required",
              })}
              type="text"
              placeholder="Enter Name"
              className={`px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none ${
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
    </div>
  );
}
