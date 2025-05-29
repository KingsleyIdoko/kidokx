import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { createDeviceFormItems } from "../header/menuItems";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateDevice() {
  let response;
  const navigate = useNavigate();
  const [formItems, setFormItems] = useState([]);
  const editedData = useSelector((state) => state.inventories.editeddata);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    async function fetchFormItems() {
      const items = await createDeviceFormItems();
      setFormItems(items);
    }
    fetchFormItems();
  }, []);

  useEffect(() => {
    if (editedData) {
      const formValues = {
        site: editedData.site,
        "Device Name": editedData.device_name,
        "Device Type": editedData.device_type,
        vendor: editedData.vendor_name,
        "IP Address": editedData.ip_address,
        model: editedData.device_model,
        Protocol: editedData.connection_protocol,
        username: editedData.username,
        password: editedData.password,
        keepalive: editedData.keepalive,
      };
      reset(formValues);
    }
  }, [editedData, reset]);

  const onsubmit = async (formData) => {
    const fieldMapping = {
      site: "site",
      "Device Name": "device_name",
      "Device Type": "device_type",
      vendor: "vendor_name",
      "IP Address": "ip_address",
      model: "device_model",
      Protocol: "connection_protocol",
      username: "username",
      password: "password",
      keepalive: "keepalive",
    };

    const normalizedData = {};

    Object.entries(formData).forEach(([key, value]) => {
      const internal_key = fieldMapping[key];
      if (internal_key)
        normalizedData[internal_key] = value ? value.toLowerCase() : value;
    });
    console.log(normalizedData);
    try {
      if (editedData) {
        response = await axios.put(
          `http://127.0.0.1:8000/api/inventories/devices/${editedData.id}/update/`,
          normalizedData
        );
        if (response.status === 200) {
          navigate("/inventory/devices/list/");
        }
      } else {
        response = await axios.post(
          "http://127.0.0.1:8000/api/inventories/devices/create/",
          normalizedData
        );
        if (response.status === 201) {
          navigate("/inventory/devices/list/");
        }
      }
      reset({});
    } catch (err) {
      console.error("API call failed:", err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onsubmit)}>
      <div className="max-w-[96rem] min-h-[48rem] relative bg-white mx-auto mt-12 p-10 rounded shadow">
        <h1 className="text-center text-xl font-semibold mb-10">
          {editedData ? "Edit Device" : "Add New Device"}
        </h1>

        <div className="space-y-3">
          {formItems.map((item) => {
            return (
              <div
                key={item.params_name}
                className="flex items-center justify-center gap-20"
              >
                <label
                  htmlFor={item.params_name}
                  className="w-1/4 font-medium capitalize border py-2 px-6 rounded-lg bg-gray-100"
                >
                  {item.params_name.replace("_", " ")}
                </label>

                <div className="w-[28rem] flex flex-col">
                  {Array.isArray(item.value) ? (
                    <select
                      {...register(item.params_name, { required: true })}
                      id={item.params_name}
                      className="w-full py-2 px-4 capitalize border rounded focus:outline-none bg-gray-100 focus:ring focus:border-gray-400"
                    >
                      <option value="">Select {item.params_name}</option>
                      {item.value.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : item.params_name === "keepalive" ? (
                    <input
                      type="number"
                      min="1"
                      autoComplete="off"
                      {...register(item.params_name, {
                        required: true,
                        min: { value: 1, message: "Must be 1 or greater" },
                      })}
                      id={item.params_name}
                      className="w-full py-2 px-4 border rounded focus:outline-none focus:ring focus:border-gray-400 bg-gray-100"
                      placeholder={`Enter ${item.params_name}`}
                    />
                  ) : (
                    <input
                      type="text"
                      autoComplete="off"
                      {...register(item.params_name, {
                        required: item.params_name !== "model",
                      })}
                      id={item.params_name}
                      className={`w-full py-2 px-4 border rounded focus:outline-none focus:ring focus:border-gray-40 bg-gray-100"`}
                      placeholder={`Enter ${item.params_name}`}
                    />
                  )}
                  {errors[item.params_name] && (
                    <span className="text-red-500 text-sm">
                      {item.params_name} is required
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 absolute right-20">
          <button
            type="submit"
            className="bg-sky-400 text-white px-6 py-2 rounded hover:opacity-70 transition"
          >
            {editedData ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
}
