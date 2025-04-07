import { useEffect, useRef } from "react";
import { useIpsecData } from "./api/ikeProposalItems";
import { useSelector, useDispatch } from "react-redux";
import {
  setConfigType,
  setIkeProposalData,
  setValidated,
  setEditing,
} from "../../../../store/reducers/vpnReducer";

import { useForm } from "react-hook-form";
import axios from "axios";
import { setSelectedDevice } from "../../../../store/reducers/inventoryReducers";

function IkeProposalConfig() {
  const hasInitialized = useRef(false);
  const { ipsecChoicesData, error, loading } = useIpsecData();
  const {
    ikeProposalData,
    saveconfiguration,
    configtype,
    editeddata,
    editingData,
  } = useSelector((store) => store.vpn);
  const { selectedDevice } = useSelector((store) => store.inventories);
  const dispatch = useDispatch();

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: editeddata?.id ? editeddata : ikeProposalData,
  });

  useEffect(() => {
    if (editeddata?.id) {
      dispatch(setIkeProposalData({ ...editeddata }));
    }
  }, [editeddata, dispatch]);

  useEffect(() => {
    if (
      ipsecChoicesData &&
      !hasInitialized.current &&
      (!ikeProposalData || Object.keys(ikeProposalData).length === 0)
    ) {
      hasInitialized.current = true;
      const { authentication_method, encapsulation_protocol, ...restChoices } =
        ipsecChoicesData;
      const initialOptions = Object.keys(restChoices).reduce(
        (acc, key) => ({ ...acc, [key]: "" }),
        {}
      );
      const bulkPayload = {
        proposalname: "",
        ...initialOptions,
        ...selectedDevice,
      };
      dispatch(setIkeProposalData(bulkPayload));
    }
  }, [ipsecChoicesData, ikeProposalData, dispatch, selectedDevice]);

  useEffect(() => {
    const validateAndPost = async () => {
      const fields = Object.keys(ikeProposalData || {});
      const isValid = await trigger(fields);
      if (!isValid) {
        dispatch(setValidated(false));
        return;
      }

      const formData = getValues();
      const finalPayload = {
        ...ikeProposalData,
        ...formData,
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
        dispatch(setValidated(true));
      } catch (err) {
        console.error("Post/Put failed:", err.message);
        dispatch(setValidated(false));
      }
    };

    if (saveconfiguration && configtype === "ikeproposal") {
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

  if (error) return <p className="text-red-500">{error.join(", ")}</p>;

  return (
    <div className="w-[44rem] mx-auto bg-white rounded-lg p-6">
      <form className="grid grid-cols-2 space-y-4 gap-x-10 gap-y-4 items-center">
        <div className="col-span-2 grid grid-cols-2 gap-x-10 items-center">
          <div className="h-[3rem]">
            <button
              type="button"
              className="px-4 py-3 bg-gray-100 text-black text-left border rounded-lg focus:outline-none w-full"
            >
              IKE Proposal Name
            </button>
          </div>
          <div className="h-[3rem] flex flex-col justify-between">
            <input
              {...register("proposalname", {
                required: "Proposal Name is required",
              })}
              type="text"
              placeholder="Enter Proposal Name"
              className={`px-4 py-3 text-black border rounded-lg focus:outline-none w-full
              ${errors.proposalname ? "border-red-500" : "border-gray-300"}
                ${
                  editingData
                    ? "bg-gray-200 opacity-70 cursor-not-allowed"
                    : "bg-gray-100"
                }
    `}
              disabled={editingData}
            />
            {errors.proposalname && (
              <p className="text-xs text-red-500 font-medium flex items-center">
                {errors.proposalname.message}
              </p>
            )}
          </div>
        </div>

        {Object.keys(ikeProposalData || {})
          .filter(
            (key) =>
              key !== "proposalname" &&
              key !== "device" &&
              ipsecChoicesData?.[key] !== undefined
          )
          .map((category) => (
            <div
              key={`${category}-wrapper`}
              className="col-span-2 grid grid-cols-2 gap-x-10 items-center"
            >
              <button
                type="button"
                className="text-black font-normal text-left bg-gray-100 px-4 py-3 border rounded-lg"
              >
                {category.replace(/_/g, " ")}
              </button>
              <div className="flex flex-col justify-between">
                <select
                  {...register(category, {
                    required: `${category} is required`,
                  })}
                  className={`text-black font-normal text-left bg-gray-100 px-4 py-4 border rounded-lg ${
                    errors[category] ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select {category.replace(/_/g, " ")}</option>
                  {(ipsecChoicesData[category] || []).map((option, index) =>
                    option?.[0] !== "Pre-Shared Key" ? (
                      <option
                        key={`${category}-${option[0]}-${index}`}
                        value={option[0]}
                      >
                        {option[1]}
                      </option>
                    ) : null
                  )}
                </select>
                {errors[category] && (
                  <p className="text-xs text-red-500 font-medium flex items-center">
                    {errors[category].message}
                  </p>
                )}
              </div>
            </div>
          ))}
      </form>
    </div>
  );
}

export default IkeProposalConfig;
