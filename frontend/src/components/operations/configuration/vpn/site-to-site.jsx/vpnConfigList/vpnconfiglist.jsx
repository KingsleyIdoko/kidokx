import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { DEVICEINVENTORIES } from '../../vpnActions.jsx/actionTypes';

export default function VpnConfigList() {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const { inventories = [] } = useSelector((state) => state.inventories || {});

  useEffect(() => {
    let isMounted = true;
    const FetchDeviceList = async () => {
      try {
        const res = await axios.get(
          'http://127.0.0.1:8000/api/inventories/devices/',
        );
        if (isMounted) {
          dispatch({ type: DEVICEINVENTORIES, payload: res.data });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error('Error has occurred:', err.message);
        }
      }
    };
    FetchDeviceList();
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return (
    <div className="max-w-[96rem] mx-auto bg-white rounded-lg p-8 shadow-md mt-10">
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {/* Dropdown Filters */}
      <div className="flex space-x-6 mb-8 border-b-2 pb-4 justify-between">
        {/* Device Dropdown */}
        <select className="w-60 h-12 capitalize border px-4 rounded-lg focus:outline-none">
          <option value="">Select Device</option>
          {inventories.map((device, index) => (
            <option key={index} value={device.id}>
              {device.name}
            </option>
          ))}
        </select>
        {/* Site Dropdown */}
        <select className="w-60 h-12 capitalize border px-4 rounded-lg focus:outline-none">
          <option value="">Select Config</option>
          <option>Ike Propsals</option>
          <option>Ike Policys</option>
          <option>Ike Gateways</option>
          <option>IPsec Proposals</option>
          <option>IPsec Policys</option>
          <option>IPsec VPNs</option>
        </select>

        {/* Site Dropdown */}
        <select className="w-60 h-12 capitalize border px-4 rounded-lg focus:outline-none">
          <option value="">Select Site</option>
          <option>Site 1</option>
          <option>Site 2</option>
        </select>

        {/* VPN Type Dropdown */}
        <select className="w-60 h-12 capitalize border px-4 rounded-lg focus:outline-none">
          <option value="">Select VPN Type</option>
          <option value="site-to-site">Site-to-Site</option>
          <option value="remote-access">Remote Access</option>
        </select>
      </div>

      {/* VPN List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left bg-white border border-gray-200">
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
