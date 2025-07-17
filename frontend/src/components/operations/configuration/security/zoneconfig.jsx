import DualListSelector from "./listselector";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SecurityZoneConfig() {
  const { selectedDevice } = useSelector((state) => state.inventories);
  console.log(selectedDevice);
  const [Interfaces, setInterfaces] = useState([]);
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      zoneName: "",
      interfaces: [],
      services: [],
      addresses: [],
    },
  });

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
  }, [selectedDevice]);

  const onSubmit = (data) => {
    final_payload = { ...data, device: selectedDevice };
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col bg-white p-8 rounded-xl shadow max-w-6xl mx-auto mt-10 gap-6"
    >
      <div className="flex items-center gap-4">
        <label className="w-40 font-semibold text-sm text-gray-700">
          Zone Name:
        </label>
        <input
          type="text"
          {...register("zoneName")}
          placeholder="Enter Zone Name"
          className="flex-1 border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="flex items-start gap-4">
        <label className="w-40 font-semibold text-sm text-gray-700 mt-3">
          Interfaces:
        </label>
        <Controller
          name="interfaces"
          control={control}
          render={({ field: { ref, ...rest } }) => (
            <DualListSelector
              items={["ge-0/0/0", "ge-0/0/1", "ge-0/0/2"]}
              {...rest}
            />
          )}
        />
      </div>

      <div className="flex items-start gap-4">
        <label className="w-40 font-semibold text-sm text-gray-700 mt-3">
          System Services:
        </label>
        <Controller
          name="services"
          control={control}
          render={({ field: { ref, ...rest } }) => (
            <DualListSelector
              items={["SSH", "HTTPS", "PING", "DNS"]}
              {...rest}
            />
          )}
        />
      </div>

      <div className="flex items-start gap-4">
        <label className="w-40 font-semibold text-sm text-gray-700 mt-3">
          Addresses:
        </label>
        <Controller
          name="addresses"
          control={control}
          render={({ field: { ref, ...rest } }) => (
            <DualListSelector
              items={["10.0.0.0/24", "192.168.1.0/24", "172.16.0.0/16"]}
              {...rest}
            />
          )}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded text-sm font-medium"
        >
          Save
        </button>
      </div>
    </form>
  );
}
