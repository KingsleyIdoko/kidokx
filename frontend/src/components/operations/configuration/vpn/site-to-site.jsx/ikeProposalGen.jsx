import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import axios from "axios";

import {
  setConfigType,
  setIkeProposalData,
  setValidated,
  setEditing,
  setSaveConfiguration,
} from "../../../../store/reducers/vpnReducer";
import { setSelectedDevice } from "../../../../store/reducers/inventoryReducers";
import { setSite } from "../../../../store/reducers/siteReducer";

const ikeproposalforms = [
  { name: "Proposal Name", value: "" },
  {
    name: "Encryption Algorithm",
    value: [
      "aes-128-cbc",
      "aes-192-cbc",
      "aes-256-cbc",
      "aes-128-gcm",
      "aes-192-gcm",
      "aes-256-gcm",
      "3des",
    ],
  },
  {
    name: "Authentication Algorithm",
    value: ["md5", "sha1", "sha-256", "sha-384", "sha-512"],
  },
  {
    name: "Authentication Method",
    value: ["pre-shared-keys", "rsa"],
  },
  {
    name: "DH Group",
    value: [
      "group1",
      "group2",
      "group5",
      "group14",
      "group15",
      "group16",
      "group19",
      "group20",
      "group21",
    ],
  },
  { name: "Lifetime Seconds", value: "86400" },
];

function IkeProposalConfig() {
  const dispatch = useDispatch();
  const { saveconfiguration, configtype, editeddata, editingData } =
    useSelector((store) => store.vpn);
  const { selectedDevice } = useSelector((store) => store.inventories);
  const { site } = useSelector((store) => store.site);

  const defaultValues = ikeproposalforms.reduce((acc, curr) => {
    const fieldName = curr.name.toLowerCase().replace(/\s+/g, "_");
    acc[fieldName] = curr.value instanceof Array ? "" : curr.value;
    return acc;
  }, {});

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange", defaultValues });

  const encryptionAlgorithm = watch("encryption_algorithm") || "";

  useEffect(() => {
    if (editeddata?.id) {
      dispatch(setIkeProposalData({ ...editeddata }));
      reset({
        proposal_name: editeddata.proposalname || "",
        encryption_algorithm: editeddata.encryption_algorithm,
        authentication_algorithm: editeddata.authentication_algorithm,
        authentication_method: editeddata.authentication_method,
        dh_group: editeddata.dh_group,
        lifetime_seconds: editeddata.lifetime_seconds,
      });
    }
  }, [editeddata, dispatch, reset]);

  const submitForm = useCallback(
    async (formData) => {
      if (!formData.lifetime_seconds) formData.lifetime_seconds = "86400";
      const transformedData = {
        proposalname: formData.proposal_name,
        encryption_algorithm: formData.encryption_algorithm,
        authentication_algorithm: formData.authentication_algorithm,
        authentication_method: formData.authentication_method,
        dh_group: formData.dh_group,
        lifetime_seconds: formData.lifetime_seconds || "86400",
      };

      if (editingData) {
        transformedData.is_published = false;
        transformedData.is_sendtodevice = false;
      }

      const finalPayload = {
        ...transformedData,
        device: selectedDevice,
      };

      try {
        if (!editingData) {
          await axios.post(
            "http://127.0.0.1:8000/api/ipsec/ikeproposal/create/",
            finalPayload
          );
        } else {
          await axios.put(
            `http://127.0.0.1:8000/api/ipsec/ikeproposal/${editeddata?.id}/update/`,
            finalPayload
          );
          dispatch(setEditing(false));
        }

        dispatch(setIkeProposalData(finalPayload));
        dispatch(setConfigType(configtype));
        dispatch(setSelectedDevice(selectedDevice));
        dispatch(setSite(site));
        dispatch(setValidated(true));
      } catch (err) {
        console.error("Post/Put failed:", err.message);
        dispatch(setValidated(false));
      } finally {
        dispatch(setSaveConfiguration(false));
      }
    },
    [selectedDevice, editingData, editeddata, dispatch, configtype, site]
  );

  useEffect(() => {
    if (saveconfiguration && configtype === "ikeproposal") {
      handleSubmit(submitForm)();
    }
  }, [saveconfiguration, configtype, submitForm, handleSubmit]);

  const errorClass = (field) =>
    errors[field] ? "border-red-500" : "border-gray-300";

  return (
    <div className="w-[44rem] mx-auto bg-white rounded-lg p-6">
      <form
        className="grid grid-cols-2 space-y-2 gap-x-10 gap-y-4 items-center"
        onSubmit={handleSubmit(submitForm)}
      >
        {ikeproposalforms.map((formItem) => {
          const fieldName = formItem.name.toLowerCase().replace(/\s+/g, "_");
          const isTextInput = typeof formItem.value === "string";
          const isSkipped =
            fieldName === "authentication_algorithm" &&
            encryptionAlgorithm.includes("gcm");

          if (isSkipped) return null;

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
                    placeholder={
                      fieldName === "lifetime_seconds"
                        ? "86400"
                        : `Enter ${formItem.name}`
                    }
                    className={`${fieldErrorClass} px-4 py-3 ${
                      editingData && fieldName === "proposal_name"
                        ? "bg-gray-200 opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={editingData && fieldName === "proposal_name"}
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
