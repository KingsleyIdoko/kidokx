import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import SelectedDevice from '../selectDevice';
export default function AddressList() {
  const { selectedDevice } = useSelector((state) => state.inventories);
  const editingData = false;
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      name: '',
      description: '',
      address: '',
    },
  });
  const onSubmit = async (data) => {
    const finalPayload = { ...data, device: selectedDevice };
    console.log(finalPayload);
    try {
      if (!editingData) {
        // Create a new IKE proposal
        await axios.post('http://127.0.0.1:8000/api/addresses/create/', finalPayload);
      } else {
        // Update existing IKE proposal
        await axios.put(
          `http://127.0.0.1:8000/api/security/addresses/${editingData?.id}/update/`,
          finalPayload,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-4 min-h-screen">
      <div className="sticky top-14 z-10 bg-white shadow">
        <SelectedDevice />
      </div>
      {/* Top Buttons */}
      <div className="flex flex-row gap-6 justify-start mt-5 font-bold">
        <button className="w-40 py-2 px-3 capitalize hover:bg-white rounded-lg text-lg border">
          Address
        </button>
        <button className="w-40 py-2 px-3 capitalize hover:bg-white rounded-lg text-lg border">
          Address Group
        </button>
      </div>

      {/* Address Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="ml-12">
        {/* Name */}
        <div className="mt-6 space-y-4  max-w-3xl">
          <div className="flex items-center gap-4">
            <label className="w-40 font-semibold">Name:</label>
            <input
              type="text"
              placeholder="local_subnets"
              {...register('name')}
              className="flex-1 placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Description */}
          <div className="flex items-start gap-4">
            <label className="w-40 font-semibold">Description:</label>
            <textarea
              {...register('description')}
              className="flex-1 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            ></textarea>
          </div>

          {/* Address */}
          <div className="flex items-center gap-4">
            <label className="w-40 font-semibold">Address:</label>
            <input
              placeholder="192.168.10.0/24 or 192.168.10.1/32"
              type="text"
              {...register('ip_prefix')}
              className="flex-1 placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>
        <div className="flex justify-end mt-10 max-w-6xl">
          <button className="w-40 py-2 px-3 bg-sky-400 rounded text-white hover:bg-sky-300">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
