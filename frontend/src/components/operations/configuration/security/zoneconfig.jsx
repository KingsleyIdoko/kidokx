import DualListSelector from './listselector';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SecurityZoneConfig() {
  const { selectedDevice } = useSelector((state) => state.inventories);
  const [Interfaces, setInterfaces] = useState([]);
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      zoneName: '',
      interfaces: [],
      services: [],
      addresses: [],
    },
  });

  useEffect(() => {
    const fetchInterfaces = async () => {
      if (!selectedDevice) return;
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/interfaces/names/?device=${selectedDevice}`,
        );
        setInterfaces(response.data);
      } catch (error) {
        console.error('Failed to fetch interfaces:', error);
      }
    };
    fetchInterfaces();
  }, []);

  const onSubmit = async (data) => {
    const finalPayload = { ...data, device: selectedDevice };
    try {
      if (!editingData) {
        // Create a new IKE proposal
        await axios.post(
          'http://127.0.0.1:8000/api/ipsec/ikeproposal/create/',
          finalPayload,
        );
      } else {
        // Update existing IKE proposal
        await axios.put(
          `http://127.0.0.1:8000/api/ipsec/ikeproposal/${editingData?.id}/update/`,
          finalPayload,
        );
      }
      // Optionally trigger a UI refresh or success handler
      onSaved();
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col bg-white p-8 rounded-xl shadow max-w-4xl mx-auto mt-2 gap-6"
    >
      <div className="flex items-center gap-4">
        <label className="w-40 font-semibold text-sm text-gray-700">
          Zone Name:
        </label>
        <input
          type="text"
          {...register('zoneName')}
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
            <DualListSelector items={Interfaces} {...rest} />
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
              items={['SSH', 'HTTPS', 'PING', 'DNS']}
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
              items={['10.0.0.0/24', '192.168.1.0/24', '172.16.0.0/16']}
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
