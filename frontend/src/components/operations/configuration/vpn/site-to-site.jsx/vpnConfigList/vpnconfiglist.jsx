import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  CONFIGTYPE,
  DEVICEINVENTORIES,
  SELECTEDDEVICE,
} from '../../vpnActions.jsx/actionTypes';

export default function VpnConfigList() {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const { inventories = [], selectedDevice } = useSelector(
    (state) => state.inventories || {},
  );
  const { configtype } = useSelector((state) => state.vpn || {});
  const { ikeProposalData } = useSelector((state) => state.vpn || {});

  useEffect(() => {
    let isMounted = true;

    const fetchDeviceList = async () => {
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
          console.error('Error fetching device list:', err.message);
        }
      }
    };

    fetchDeviceList();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    const postData = async () => {
      console.log(ikeProposalData);
      try {
        if (!ikeProposalData || Object.keys(ikeProposalData).length === 0)
          return;

        const response = await axios.post(
          'http://127.0.0.1:8000/api/ipsec/ikeproposal/create/',
          ikeProposalData,
        );

        console.log('IKE Proposal posted successfully:', response.data);
      } catch (err) {
        console.error('Error posting IKE proposal data:', err.message);
      }
    };

    postData();
  }, [ikeProposalData]);

  const handleDeviceChange = (e) => {
    dispatch({ type: SELECTEDDEVICE, payload: e.target.value });
  };

  const handleConfigTypeChange = (e) => {
    dispatch({ type: CONFIGTYPE, payload: e.target.value });
  };

  return (
    <div className="max-w-[96rem] mx-auto bg-white rounded-lg p-8 shadow-md mt-10">
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      <div className="flex space-x-6 mb-8 border-b-2 pb-4 justify-between">
        <select
          className="w-60 h-12 border px-4 rounded-lg focus:outline-none"
          value={selectedDevice || ''}
          onChange={handleDeviceChange}
        >
          <option value="">Select Device</option>
          {inventories.map((device, index) => (
            <option key={index} value={device.name}>
              {device.name}
            </option>
          ))}
        </select>

        <select
          className="w-60 h-12 capitalize border px-4 rounded-lg focus:outline-none"
          value={configtype || ''}
          onChange={handleConfigTypeChange}
        >
          <option value="">Select Config</option>
          <option value="ikeproposal">IKE Proposals</option>
          <option value="ikepolicy">IKE Policies</option>
          <option value="ikegateway">IKE Gateways</option>
          <option value="ipsecproposal">IPSec Proposals</option>
          <option value="ipsecpolicy">IPSec Policies</option>
          <option value="ipsecvpn">IPSec VPNs</option>
        </select>

        <select className="w-60 h-12 capitalize border px-4 rounded-lg focus:outline-none">
          <option value="">Select Site</option>
          <option>Site 1</option>
          <option>Site 2</option>
        </select>

        <select className="w-60 h-12 capitalize border px-4 rounded-lg focus:outline-none">
          <option value="">Select VPN Type</option>
          <option value="site-to-site">Site-to-Site</option>
          <option value="remote-access">Remote Access</option>
        </select>
      </div>

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
