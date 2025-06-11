import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  setEditedData,
  trackDeviceStatus,
} from "../store/reducers/inventoryReducers";
import { useDispatch } from "react-redux";

export default function DeviceInventory() {
  const dispatch = useDispatch();
  const [backendData, setBackendData] = useState([]);
  const [deviceStatuses, setDeviceStatuses] = useState([]);
  const navigate = useNavigate();

  const handleEdit = (device) => {
    dispatch(setEditedData(device));
    navigate("/inventory/devices/create/");
  };

  const handleDelete = async (deviceId) => {
    setBackendData((prev) => prev.filter((device) => device.id !== deviceId));
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/inventories/devices/${deviceId}/delete/`
      );
    } catch (err) {
      console.error("An error occurred: ", err);
    }
  };

  const handleCreateDevice = () => {
    dispatch(setEditedData(null));
    navigate("/inventory/devices/create/");
  };

  useEffect(() => {
    const fetchDeviceList = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/inventories/devices/"
        );
        setBackendData(response.data);
      } catch (err) {
        console.error("Failed to fetch devices:", err);
      }
    };

    fetchDeviceList();
  }, []);

  useEffect(() => {
    let isFetching = false;

    const fetchDeviceStatuses = async () => {
      if (isFetching) return;
      isFetching = true;
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/inventories/devices/monitor/"
        );
        setDeviceStatuses(response.data);
        dispatch(trackDeviceStatus(response.data));
      } catch (err) {
        console.error("Failed to fetch statuses:", err);
      } finally {
        isFetching = false;
      }
    };

    fetchDeviceStatuses();
    const interval = setInterval(fetchDeviceStatuses, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[120rem] p-6 bg-gray-50 mx-auto mt-10">
      <div className="py-2">
        <button
          className="py-2 px-8 rounded-md bg-green-600 text-white hover:opacity-70"
          onClick={handleCreateDevice}
        >
          Add New
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-md overflow-x-auto">
        <table className="w-full table-fixed text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 border-y">
            <tr>
              <th className="px-4 py-3 font-medium w-[4rem]">#</th>
              <th className="px-4 py-3 font-medium w-[10rem]">Site</th>
              <th className="px-4 py-3 font-medium w-[14rem]">IPv4 Address</th>
              <th className="px-4 py-3 font-medium w-[14rem]">Status</th>
              <th className="px-4 py-3 font-medium w-[16rem]">Device Name</th>
              <th className="px-4 py-3 font-medium w-[14rem]">Device Type</th>
              <th className="px-4 py-3 font-medium w-[12rem]">Vendor</th>
              <th className="px-4 py-3 font-medium w-[12rem]">Device Model</th>
              <th className="px-4 py-3 font-medium w-[10rem]">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y text-gray-800">
            {backendData.map((device, index) => {
              const statusInfo = deviceStatuses.find(
                (status) => status.device_name === device.device_name
              );

              const deviceStatus = statusInfo?.status || "up";

              const getStatusColor = (status) => {
                switch (status) {
                  case "up":
                    return { ping: "bg-green-400", dot: "bg-green-500" };
                  case "unknown":
                    return { ping: "bg-yellow-400", dot: "bg-yellow-500" };
                  default:
                    return { ping: "bg-red-400", dot: "bg-red-500" };
                }
              };

              const colors = getStatusColor(deviceStatus);

              return (
                <tr key={device.id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{device.site}</td>
                  <td className="px-4 py-2">{device.ip_address}</td>
                  <td className="px-4 py-2 capitalize flex items-center">
                    {deviceStatus}
                    <span className="relative flex size-3 ml-2">
                      <span
                        className={`absolute inline-flex h-full w-full animate-ping rounded-full ${colors.ping} opacity-75`}
                      ></span>
                      <span
                        className={`relative inline-flex size-3 rounded-full ${colors.dot}`}
                      ></span>
                    </span>
                  </td>
                  <td
                    className="px-4 py-2 hover:underline cursor-pointer"
                    onClick={() => handleEdit(device)}
                  >
                    {device.device_name}
                  </td>
                  <td className="px-4 py-2">{device.device_type}</td>
                  <td className="px-4 py-2">{device.vendor_name}</td>
                  <td className="px-4 py-2">{device.device_model || "n/a"}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-3">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit(device)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(device.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
