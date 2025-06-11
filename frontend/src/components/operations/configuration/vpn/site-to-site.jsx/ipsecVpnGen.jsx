import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setIpsecVpnData,
  setEditing,
  setConfigType,
  setValidated,
} from "../../../../store/reducers/vpnReducer";
import { setSelectedDevice } from "../../../../store/reducers/inventoryReducers";
import { ipsecVpnForm } from "./api/postikeproposal";
import { useForm } from "react-hook-form";

function IPsecVPNConfig() {
  const dispatch = useDispatch();
  const { selectedDevice } = useSelector((state) => state.inventories);
  const { saveconfiguration, editingData, editeddata, configtype } =
    useSelector((state) => state.vpn);
  const [interfacesList, setInterfaceslist] = useState([]);
  const [ikeGatewayList, setIkeGatewayList] = useState([]);
  const [ipsecPolicyList, setIpsecPolicyList] = useState([]);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const normalizeKey = (label) =>
    label
      .toLowerCase()
      .replace(/[^a-z0-9]/g, " ")
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, "");

  const fieldMap = {
    vpnName: "vpn_name",
    ikeGateway: "ike_gateway",
    ipsecPolicy: "ipsec_policy",
    bindInterface: "bind_interface",
    establishTunnel: "establish_tunnel",
  };

  const reverseFieldMap = Object.fromEntries(
    Object.entries(fieldMap).map(([k, v]) => [v, k])
  );

  useEffect(() => {
    if (
      editingData &&
      editeddata &&
      ikeGatewayList.length > 0 &&
      ipsecPolicyList.length > 0 &&
      interfacesList.length > 0
    ) {
      const normalizedData = {};
      for (const [key, value] of Object.entries(editeddata)) {
        const camelKey = reverseFieldMap[key];
        if (camelKey) normalizedData[camelKey] = value;
      }
      reset(normalizedData);
    }
  }, [
    editingData,
    editeddata,
    ikeGatewayList,
    ipsecPolicyList,
    interfacesList,
    reset,
  ]);

  useEffect(() => {
    const fetchInterfaces = async () => {
      if (!selectedDevice) return;
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/interfaces/names/?device=${selectedDevice}`
        );
        const stInterfaces = response.data.filter((iface) =>
          /^st\d+(\.0)?$/.test(iface)
        );
        setInterfaceslist(stInterfaces);
      } catch (error) {
        console.error("Failed to fetch interfaces:", error);
      }
    };
    fetchInterfaces();
  }, [selectedDevice]);

  const onsubmit = async (formData) => {
    let finalPayload = { device: selectedDevice };
    for (const [key, value] of Object.entries(formData)) {
      finalPayload[fieldMap[key] || key] = value;
    }
    if (editingData) {
      finalPayload = {
        ...finalPayload,
        is_published: false,
        is_sendtodevice: false,
      };
    }
    try {
      if (!editingData) {
        await axios.post(
          "http://127.0.0.1:8000/api/ipsec/ipsecvpn/create/",
          finalPayload
        );
      } else {
        await axios.put(
          `http://127.0.0.1:8000/api/ipsec/ipsecvpn/${editeddata?.id}/update/`,
          finalPayload
        );
        dispatch(setEditing(false));
      }
      dispatch(setIpsecVpnData(finalPayload));
      dispatch(setConfigType(configtype));
      dispatch(setSelectedDevice(selectedDevice));
      dispatch(setValidated(true));
    } catch (err) {
      console.error("Post/Put failed:", err.message);
      dispatch(setValidated(false));
    }
  };

  useEffect(() => {
    if (saveconfiguration && configtype === "ipsecvpn") {
      handleSubmit(onsubmit)();
    }
  }, [saveconfiguration, configtype, handleSubmit]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gatewayRes, policyRes] = await Promise.all([
          axios.get(
            `http://127.0.0.1:8000/api/ipsec/ikegateway/names/?device=${selectedDevice}`
          ),
          axios.get(
            `http://127.0.0.1:8000/api/ipsec/ipsecpolicy/names/?device=${selectedDevice}`
          ),
        ]);
        setIkeGatewayList(gatewayRes.data);
        setIpsecPolicyList(policyRes.data);
      } catch (err) {
        console.error("Error fetching VPN form data:", err.message);
      }
    };

    if (selectedDevice) fetchData();
  }, [selectedDevice]);

  return (
    <form
      className="w-[44rem] mx-auto bg-white rounded-lg p-6"
      onSubmit={handleSubmit(onsubmit)}
    >
      <div className="flex items-center justify-between">
        <div className="w-[24rem] flex flex-col space-y-4">
          {ipsecVpnForm.map((params, index) => (
            <button
              key={index}
              type="button"
              className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left"
            >
              {params.name}
            </button>
          ))}
        </div>

        <div className="w-[20rem] flex flex-col space-y-5">
          {ipsecVpnForm.map((params, index) => {
            const fieldKey = normalizeKey(params.name);
            const isSelect = Array.isArray(params.value);
            let options = params.value;
            if (params.name === "Bind Interface") {
              options = interfacesList;
            }
            const nameLower = params.name.toLowerCase();
            if (nameLower === "ike gateway") options = ikeGatewayList;
            if (nameLower === "ipsec policy") options = ipsecPolicyList;

            return isSelect ? (
              <select
                key={index}
                {...register(fieldKey, {
                  required: `${params.name} field is required`,
                })}
                className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
              >
                <option value="">Select {params.name}</option>
                {options.map((option, i) => {
                  return (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            ) : (
              <input
                key={index}
                type="text"
                placeholder={`Enter ${params.name}`}
                {...register(fieldKey, {
                  required: `${params.name} field is required`,
                })}
                className="px-4 py-3 bg-gray-100 text-black border rounded-lg text-left focus:outline-none"
              />
            );
          })}
        </div>
      </div>
    </form>
  );
}
export default IPsecVPNConfig;
