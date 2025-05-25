import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIkeGatewayData,
  setEditing,
  setConfigType,
  setValidated,
} from "../../../../store/reducers/vpnReducer";
import { setSelectedDevice } from "../../../../store/reducers/inventoryReducers";
import axios from "axios";
import { useForm } from "react-hook-form";

function IkeGatewayConfig() {
  const dispatch = useDispatch();
  const [interfaces, setInterfaces] = useState([]);
  const { selectedDevice } = useSelector((state) => state.inventories);
  const {
    saveconfiguration,
    configtype,
    editingData,
    ikeGatewayData,
    editeddata,
  } = useSelector((state) => state.vpn);
  const ikeVersions = ["v1-only", "v2-only"];
  const [ikePolicyNames, setIkePolicyNames] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const fetchIkePolicyNames = async () => {
    setLoading(true);
    let errorMessages = [];

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/ipsec/ikepolicy/names/"
      );
      setIkePolicyNames(response.data);
    } catch (err) {
      errorMessages.push(`Error fetching data: ${err.message}`);
      console.error("Error fetching IKE Policy data:", err);
    } finally {
      setError(errorMessages.length ? errorMessages : null);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchIkePolicyNames();
  }, []);

  useEffect(() => {
    if (editingData && editeddata && ikePolicyNames.length > 0) {
      reset(editeddata);
    } else if (ikeGatewayData && ikePolicyNames.length > 0) {
      reset(ikeGatewayData);
    }
  }, [ikeGatewayData, editingData, editeddata, ikePolicyNames, reset]);

  useEffect(() => {
    const fetchInterfaces = async () => {
      if (!selectedDevice) return; // guard clause
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/interfaces/names/?device=${selectedDevice}`
        );
        setInterfaces(response.data);
      } catch (error) {
        console.error("Failed to fetch interfaces:", error);
      }
    };

    fetchInterfaces();
  }, [selectedDevice]); // 👈 now responds to changes in selectedDevice

  const onSubmit = async (data) => {
    const payload = { ...data, device: selectedDevice };
    try {
      if (!editingData) {
        await axios.post(
          "http://127.0.0.1:8000/api/ipsec/ikegateway/create/",
          payload
        );
      } else {
        await axios.put(
          `http://127.0.0.1:8000/api/ipsec/ikegateway/${editeddata?.id}/update/`,
          payload
        );
        dispatch(setEditing(false));
      }

      dispatch(setConfigType(configtype));
      dispatch(setSelectedDevice(selectedDevice));
      dispatch(setValidated(true));
    } catch (err) {
      console.error("Post/Put failed:", err.message);
      dispatch(setValidated(false));
    }
  };

  useEffect(() => {
    if (saveconfiguration && configtype === "ikegateway") {
      handleSubmit(onSubmit)();
    }
  }, [saveconfiguration, configtype, handleSubmit]);

  return (
    <form
      className="w-[44rem] mx-auto bg-white rounded-lg p-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex mx-auto">
        <div className="w-[24rem] flex flex-col space-y-4">
          {[
            "Gateway Name",
            "Remote Address",
            "Local Address",
            "External Interface",
            "IKE Policy",
            "IKE Version",
          ].map((label, index) => (
            <div
              key={index}
              className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="w-[20rem] flex flex-col space-y-5">
          {[
            {
              name: "gatewayname",
              type: "text",
              placeholder: "Enter Gateway Name",
              error: errors.gatewayname,
              message: "Gateway Name is required",
            },
            {
              name: "remote_address",
              type: "text",
              placeholder: "Enter Remote Address",
              error: errors.remote_address,
              message: "Remote Address is required",
            },
            {
              name: "local_address",
              type: "text",
              placeholder: "Enter Local Address",
              error: errors.local_address,
              message: "Local Address is required",
            },
          ].map(({ name, type, placeholder, error, message }) => (
            <div key={name} className="h-[3rem] flex flex-col justify-between">
              <input
                type={type}
                placeholder={placeholder}
                className={`px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                {...register(name, { required: message })}
              />
              {error && <p className="text-red-500 text-sm">{error.message}</p>}
            </div>
          ))}

          <div className="h-[3rem] flex flex-col justify-between">
            <select
              className={`px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none ${
                errors.external_interface ? "border-red-500" : "border-gray-300"
              }`}
              {...register("external_interface", {
                required: "Select an interface",
              })}
            >
              <option value="">Select Interface</option>
              {interfaces.map((intf, index) => (
                <option key={index} value={intf}>
                  {intf}
                </option>
              ))}
            </select>
            {errors.external_interface && (
              <p className="text-red-500 text-sm">
                {errors.external_interface.message}
              </p>
            )}
          </div>

          <div className="h-[3rem] flex flex-col justify-between">
            <select
              className={`px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none ${
                errors.ike_policy ? "border-red-500" : "border-gray-300"
              }`}
              {...register("ike_policy", { required: "Select an IKE Policy" })}
            >
              <option value="">Select IKE Policy</option>
              {ikePolicyNames.map((policy, index) => (
                <option key={index} value={policy}>
                  {policy}
                </option>
              ))}
            </select>
            {errors.ike_policy && (
              <p className="text-red-500 text-sm">
                {errors.ike_policy.message}
              </p>
            )}
          </div>

          <div className="h-[3rem] flex flex-col justify-between">
            <select
              className={`px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none ${
                errors.ike_version ? "border-red-500" : "border-gray-300"
              }`}
              {...register("ike_version", { required: "Select IKE Version" })}
            >
              <option value="">Select IKE Version</option>
              {ikeVersions.map((version, index) => (
                <option key={index} value={version}>
                  {version}
                </option>
              ))}
            </select>
            {errors.ike_version && (
              <p className="text-red-500 text-sm">
                {errors.ike_version.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

export default IkeGatewayConfig;
