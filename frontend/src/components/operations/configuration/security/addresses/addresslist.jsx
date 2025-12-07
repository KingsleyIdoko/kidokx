import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SelectedDevice from '../selectDevice';
export default function AddressList() {
  const [addresses, setAddresses] = useState([]);
  const { selectedDevice } = useSelector((state) => state.inventories);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!selectedDevice) return;
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/addresses/?device=${selectedDevice}`,
        );
        setAddresses(response.data);
      } catch (err) {
        console.error('Error fetching IKE Policy data:', err.message);
      } finally {
      }
    };
    fetchAddresses();
  }, [selectedDevice]);

  return (
    <div className="p-4 min-h-screen">
      <div className="sticky top-14 z-10 bg-white shadow">
        <SelectedDevice />
      </div>
      {/* Top Buttons */}
      <div className="flex flex-row gap-6 justify-start mt-5 font-bold py-2 px-3 rounded-lg bg-white">
        <button className="w-40 py-2 px-3 capitalize hover:bg-sky-400 hover:text-white rounded-lg text-lg border">
          Address
        </button>
        <button className="w-40 py-2 px-3 capitalize hover:bg-sky-400 hover:text-white rounded-lg text-lg border">
          Address Group
        </button>
      </div>
      {/* Address Table */}
      <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">S/N</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Device</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subnet</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((add, index) => (
              <tr
                key={add.id || index}
                className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
              >
                <td className="px-4 py-3 text-sm text-gray-800">{index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{add.device}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{add.name}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{add.description}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{add.ip_prefix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
