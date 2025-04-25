import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function DeviceInventory() {
  const navigate = useNavigate();
  const handlecreatedevice = () => {
    navigate('/inventory/device/create/');
  };

  return (
    <div className="w-[120rem] p-6 bg-gray-50 mx-auto mt-10">
      <div className="py-2">
        <button
          className="py-2 px-8 rounded-md bg-green-600 text-white hover:opacity-70"
          onClick={handlecreatedevice}
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
              <th className="px-4 py-3 font-medium w-[14rem]">IPv4 address</th>
              <th className="px-4 py-3 font-medium w-[16rem]">Device name</th>
              <th className="px-4 py-3 font-medium w-[14rem]">Device type</th>
              <th className="px-4 py-3 font-medium w-[12rem]">Vendor</th>
              <th className="px-4 py-3 font-medium w-[12rem]">Device model</th>
              <th className="px-4 py-3 font-medium w-[10rem]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-800">
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-2">1</td>
              <td className="px-4 py-2">site</td>
              <td className="px-4 py-2">10.166.113.53</td>
              <td className="px-4 py-2">TSW-73-7F459CCC</td>
              <td className="px-4 py-2">Smart Display</td>
              <td className="px-4 py-2">Crestron</td>
              <td className="px-4 py-2">TSW-730</td>
              <td className="px-4 py-2">
                <div className="flex space-x-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
