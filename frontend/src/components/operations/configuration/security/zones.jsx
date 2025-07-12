import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function SecurityZone() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [siteNames, setSiteNames] = useState([]);
  const { inventories = [] } = useSelector((state) => state.inventories || {});
  const [filteredInventory, setFilteredInventory] = useState([]);

  const {
    register,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const selectedSite = watch("site");

  useEffect(() => {
    if (inventories && inventories.length > 0 && selectedSite) {
      setFilteredInventory(
        inventories.filter((items) => items.site === selectedSite)
      );
    } else {
      setFilteredInventory(inventories);
    }
  }, [inventories, selectedSite]);

  useEffect(() => {
    if (selectedSite) dispatch(setSite(selectedSite));
  }, [selectedSite, dispatch]);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/inventories/sites/names/"
        );
        if (response.status === 200) {
          setSiteNames(response.data);
          dispatch(setGetSiteName(response.data));
        }
      } catch (err) {
        console.log("Error occurred fetching site names:", err);
      }
    };

    if (!siteNames || siteNames.length === 0) {
      fetchSiteData();
    }
  }, [siteNames, dispatch]);

  const handleUrlPath = async () => {
    const isValid = await trigger(["device", "config", "site"]);
    if (!isValid) return;
    const config = getValues("config")?.toLowerCase();
    const device = getValues("device");
    const site = getValues("site");
    if (!config) return;
    navigate(`/vpn/site-to-site/config/${config}/`);
  };

  console.log("not working");

  useEffect(() => {
    let isMounted = true;
    const fetchDeviceList = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/inventories/devices/"
        );
        const lowerCaseData = res.data.map((device) => ({
          ...device,
          name: device.device_name.toLowerCase(),
        }));
        if (isMounted) {
          dispatch(setDeviceInventories(lowerCaseData));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error("Error occurred:", err.message);
        }
      }
    };
    fetchDeviceList();
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white rounded-lg p-4 shadow-md mt-10">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex space-x-6 mb-8 border-b-2 py-2">
        <button
          type="button"
          onClick={handleUrlPath}
          className="w-60 h-12 capitalize border px-4 rounded-lg bg-green-700 text-white hover:opacity-70 focus:outline-none"
        >
          Add New
        </button>

        <div className="flex flex-col w-60 h-12">
          <select
            {...register("site", { required: "Select site" })}
            className={`border px-4 rounded-lg h-12 focus:outline-none ${
              errors.site ? "border-red-500" : ""
            }`}
          >
            <option value="">Select Site</option>
            {siteNames.map((site, index) => (
              <option key={index} value={site}>
                {site}
              </option>
            ))}
          </select>
          <div className="h-6">
            {errors.site && (
              <p className="text-xs pl-3 text-red-500 font-medium mt-2">
                {errors.site.message}
              </p>
            )}
          </div>
        </div>

        <div className="w-60 h-12 flex flex-col">
          <select
            {...register("device", { required: "Select device" })}
            className={`border px-4 rounded-lg h-12 focus:outline-none ${
              errors.device ? "border-red-500" : ""
            }`}
          >
            <option value="">Select Device</option>
            {filteredInventory.map((device) => (
              <option key={device.id} value={device.name}>
                {device.name}
              </option>
            ))}
          </select>
          <div className="h-6">
            {errors.device && (
              <p className="text-xs pl-3 text-red-500 font-medium mt-2">
                {errors.device.message}
              </p>
            )}
          </div>
        </div>

        <div className="w-60 h-12 flex flex-col">
          <button className="border border-gray-800 py-2 px-3 rounded-lg focus:outline-none hover:bg-gray-100">
            Edit
          </button>
        </div>
        <div className="w-60 h-12 flex flex-col">
          <button className="border border-gray-800 py-2 px-3 rounded-lg focus:outline-none hover:bg-gray-100">
            Delete
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 border-b">#</th>
              <th className="py-3 px-6 border-b">Device Name</th>
              <th className="py-3 px-6 border-b">Site</th>
              <th className="py-3 px-6 border-b">VPN Type</th>
              <th className="py-3 px-6 border-b">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="hover:bg-gray-50">
              <td className="py-3 px-6 border-b">1</td>
              <td className="py-3 px-6 border-b">Device A</td>
              <td className="py-3 px-6 border-b">Site 1</td>
              <td className="py-3 px-6 border-b">Site-to-Site</td>
              <td className="py-3 px-6 border-b text-green-500 font-semibold">
                Up
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
