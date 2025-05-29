import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  setIsSelectedDevice,
  setSelectedDevice,
} from "../store/reducers/inventoryReducers";
import {
  setConfigType,
  setValidSearchComponent,
} from "../store/reducers/vpnReducer";
import { setGetSiteName, setSite } from "../store/reducers/siteReducer";

export function SearchDevice() {
  const dispatch = useDispatch();

  const { configtype, saveconfiguration, editingData, createvpndata } =
    useSelector((state) => state.vpn);
  const { selectedDevice, inventories } = useSelector(
    (state) => state.inventories
  );
  const sitenames = useSelector((state) => state.site.sitenames);
  const site = useSelector((state) => state.site.site);

  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [loadingSites, setLoadingSites] = useState(true);
  const [error, setError] = useState(null);

  const {
    watch,
    register,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      device: "",
      config: "",
      site: "",
      vendor: "",
    },
  });

  const selectedsite = watch("site");
  const watchDevice = watch("device");
  const watchConfig = watch("config");

  useEffect(() => {
    if (watchConfig) dispatch(setConfigType(watchConfig));
  }, [watchConfig, dispatch]);

  useEffect(() => {
    if (selectedsite) dispatch(setSite(selectedsite));
  }, [selectedsite, dispatch]);

  useEffect(() => {
    if (watchDevice) dispatch(setSelectedDevice(watchDevice));
  }, [watchDevice, dispatch]);

  // Load sitenames once at mount
  useEffect(() => {
    if (!sitenames || !sitenames.length) {
      axios
        .get("http://127.0.0.1:8000/api/inventories/sites/names/")
        .then(({ data }) => {
          dispatch(setGetSiteName(data));
          setLoadingSites(false);
        })
        .catch((err) => {
          console.error("Site fetch error:", err);
          setLoadingSites(false);
        });
    } else {
      setLoadingSites(false);
    }
  }, [sitenames, dispatch]);

  // Load devices once at mount
  useEffect(() => {
    if (!inventories || !inventories.length) {
      axios
        .get("http://127.0.0.1:8000/api/inventories/devices/")
        .then(({ data }) => {
          setDevices(data);
          setLoadingDevices(false);
        })
        .catch((error) => {
          console.error("Error fetching device data:", error);
          setError(error);
          setLoadingDevices(false);
        });
    } else {
      setDevices(inventories);
      setLoadingDevices(false);
    }
  }, [inventories]);

  useEffect(() => {
    if (selectedsite) {
      const currentDevice = getValues("device");
      const isDeviceValid = devices.some(
        (device) =>
          device.device_name === currentDevice && device.site === selectedsite
      );
      if (!isDeviceValid) {
        setValue("device", "");
        dispatch(setSelectedDevice(""));
      }
    }
  }, [selectedsite, devices, setValue, dispatch, getValues]);

  // Sync Redux default values into form once they're available
  useEffect(() => {
    if (selectedDevice) setValue("device", selectedDevice);
    if (configtype) setValue("config", configtype);
    if (site) setValue("site", site);
  }, [selectedDevice, configtype, site, setValue]);

  // Filter devices by site
  const filteredDevice = selectedsite
    ? devices.filter((device) => device.site === selectedsite)
    : devices;

  useEffect(() => {
    if (saveconfiguration || createvpndata) {
      (async () => {
        const isValid = await trigger(["device", "config", "site", "vendor"]);
        if (isValid) {
          const { device, config, vendor } = getValues();
          dispatch(setConfigType(config.toLowerCase()));
          dispatch(setSelectedDevice(device));
          dispatch(setSite(selectedsite));
          dispatch(setIsSelectedDevice(true));
          dispatch(setValidSearchComponent(true));
        } else {
          dispatch(setIsSelectedDevice(false));
        }
      })();
    }
  }, [
    saveconfiguration,
    createvpndata,
    trigger,
    getValues,
    dispatch,
    selectedsite,
  ]);

  if (error)
    return <p className="text-red-500">Error fetching data: {error.message}</p>;

  if (loadingDevices || loadingSites)
    return <p className="text-gray-500">Loading data...</p>;

  return (
    <form className="flex py-3 justify-between mx-auto items-start gap-3">
      <div className="w-full flex flex-col">
        <select
          {...register("site", { required: "Select site" })}
          className={`w-full py-3 px-3 border rounded focus:outline-none capitalize ${
            editingData ? "opacity-50 cursor-not-allowed" : ""
          }
          `}
        >
          <option value="">Select Site</option>
          {sitenames.map((site, index) => (
            <option key={index} value={site}>
              {site}
            </option>
          ))}
        </select>
        {errors.site && (
          <p className="text-red-500 text-sm mt-1">{errors.site.message}</p>
        )}
      </div>

      <div className="w-full flex flex-col">
        <select
          {...register("device", { required: "Select device" })}
          className={`w-full py-3 px-3 border rounded focus:outline-none ${
            errors.device ? "border-red-500" : ""
          } ${editingData ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={editingData}
        >
          <option value="">Select Device</option>
          {filteredDevice.map((device) => (
            <option key={device.id} value={device.device_name}>
              {device.device_name}
            </option>
          ))}
        </select>
        {errors.device && (
          <p className="text-red-500 text-sm mt-1">{errors.device.message}</p>
        )}
      </div>

      <div className="w-full flex flex-col">
        <select
          {...register("config", { required: "Select config type" })}
          className={`w-full py-3 px-3 border rounded focus:outline-none ${
            editingData ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <option value="">Select Config</option>
          <option value="ikeproposal">IKE Proposals</option>
          <option value="ikepolicy">IKE Policies</option>
          <option value="ikegateway">IKE Gateways</option>
          <option value="ipsecproposal">IPSec Proposals</option>
          <option value="ipsecpolicy">IPSec Policies</option>
          <option value="ipsecvpn">IPSec VPNs</option>
        </select>
      </div>

      <div className="w-full flex flex-col">
        <select
          {...register("vendor")}
          className={`w-full py-3 px-3 border rounded focus:outline-none ${
            editingData ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <option value="">Vendor</option>
        </select>
      </div>
    </form>
  );
}

export default SearchDevice;
