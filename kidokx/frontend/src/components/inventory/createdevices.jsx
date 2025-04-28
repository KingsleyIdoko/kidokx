import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createDeviceFormItems } from '../header/menuItems';
import axios from 'axios';

export default function CreateDevice() {
  const [formItems, setFormItems] = useState([]);
  const { editeddata } = useForm((state) => state.inventories);
  console.log(editeddata);
  const {
    reset,
    trigger,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    async function fetchFormItems() {
      const items = await createDeviceFormItems();
      setFormItems(items);
    }
    fetchFormItems();
  }, []);

  const onsubmit = async (formData) => {
    const fieldMapping = {
      site: 'site',
      'Device Name': 'device_name',
      'Device Type': 'device_type',
      vendor: 'vendor_name',
      'IP Address': 'ip_address',
      model: 'device_model',
      Protocol: 'conn_protocol',
    };

    const normalizedata = {};

    for (const [key, value] of Object.entries(formData)) {
      const internalKey = fieldMapping[key];
      if (internalKey) normalizedata[internalKey] = value.toLowerCase();
    }

    reset(normalizedata);

    const finalPayload = normalizedata;

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/inventories/device/create/',
        finalPayload,
      );
      alert('Device created successfully!');
    } catch (err) {
      console.error('Post failed:', err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onsubmit)}>
      <div className="w-[96rem] min-h-[48rem] relative bg-white mx-auto mt-12 p-10 rounded shadow">
        <h1 className="text-center text-xl font-semibold mb-10">
          Add New Device
        </h1>
        <div className="space-y-6">
          {formItems.map((item) => (
            <div
              key={item.params_name}
              className="flex items-center justify-center gap-20"
            >
              <label
                htmlFor={item.params_name}
                className="w-1/4 font-medium capitalize border py-3 px-6 rounded-lg bg-gray-100"
              >
                {item.params_name.replace('_', ' ')}
              </label>

              <div className="w-[28rem]">
                {Array.isArray(item.value) ? (
                  <select
                    {...register(item.params_name)}
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
                ) : (
                  <input
                    type="text"
                    autoComplete="off"
                    {...register(item.params_name)}
                    id={item.params_name}
                    className="w-full py-2 px-4 border rounded bg-gray-100 focus:outline-none focus:ring focus:border-gray-400"
                    placeholder={`Enter ${item.params_name}`}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-right absolute right-80">
          <button
            type="submit"
            className="bg-sky-400 text-white px-6 py-2 rounded hover:opacity-70 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
