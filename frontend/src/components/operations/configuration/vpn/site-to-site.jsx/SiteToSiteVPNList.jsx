import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  DEVICEINVENTORIES,
  SELECTEDDEVICE,
  CONFIGTYPE,
} from '../vpnActions.jsx/actionTypes';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export default function SiteToSiteList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const { inventories = [] } = useSelector((state) => state.inventories || {});
  const { configtype = [] } = useSelector((state) => state.vpn || {});

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const handleUrlPath = async () => {
    const isValid = await trigger(['device', 'config']);
    if (!isValid) {
      return;
    }
    const config = getValues('config').toLowerCase();
    const updateURL = `/vpn/site-to-site/config/${config}/`;
    navigate(updateURL);
    dispatch({ type: SELECTEDDEVICE, payload: getValues('device') });
    dispatch({ type: CONFIGTYPE, payload: config });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchDeviceList = async () => {
      try {
        const res = await axios.get(
          'http://127.0.0.1:8000/api/inventories/devices/',
        );
        const lowerCaseData = res.data.map((device) => ({
          ...device,
          name: device.name.toLowerCase(),
        }));
        if (isMounted) {
          dispatch({ type: DEVICEINVENTORIES, payload: lowerCaseData });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error('Error occurred:', err.message);
        }
      }
    };

    fetchDeviceList();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return (
    <div className="max-w-[96rem] mx-auto bg-white rounded-lg p-4 shadow-md mt-10">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex space-x-12 mx-auto mb-1 items-center justify-center ">
        <span className="w-60 h-6 px-2 text-xs"></span>
        <span className="w-60 h-6 px-2 text-xs">
          {' '}
          {errors.device && (
            <span className="text-red-500 text-sm mb-1">
              Must Select Device
            </span>
          )}
        </span>
        <span className="w-60 h-6 px-2 text-xs">
          {' '}
          {errors.config && (
            <span className="text-red-500 text-sm mb-1">
              Must Select Config
            </span>
          )}
        </span>
        <span className="w-60 h-6 px-2 text-xs"></span>
        <span className="w-60 h-6 px-2 text-xs"></span>
      </div>

      <div className="flex space-x-6 mb-8 border-b-2 pb-4 items-center justify-between ">
        {/* Add New Button */}
        <button
          type="button"
          onClick={handleUrlPath}
          className="w-60 h-12 capitalize border px-4 rounded-lg bg-green-700 text-white hover:opacity-70 focus:outline-none"
        >
          Add New
        </button>

        {/* Device Dropdown */}
        <div className="flex flex-col w-60">
          <select
            {...register('device', { required: true })}
            className={`h-12 border px-4 rounded-lg focus:outline-none ${
              errors.device ? 'border-b-2 border-red-500' : ''
            }`}
          >
            <option value="">Select Device</option>
            {inventories.map((device) => (
              <option key={device.id} value={device.name}>
                {device.name}
              </option>
            ))}
          </select>
        </div>

        {/* Config Dropdown */}
        <div className="flex flex-col w-60">
          <select
            {...register('config', { required: true })}
            className={`h-12 capitalize border px-4 rounded-lg focus:outline-none ${
              errors.config ? 'border-b-2 border-red-500' : ''
            }`}
          >
            <option value="">Select Config</option>
            <option value="ikeproposal">IKE Proposals</option>
            <option value="ikepolicy">IKE Policies</option>
            <option value="ikegateway">IKE Gateways</option>
            <option value="ipsecproposal">IPSec Proposals</option>
            <option value="ipsecpolicy">IPSec Policies</option>
            <option value="ipsecvpn">IPSec VPNs</option>
          </select>
        </div>

        {/* Site Dropdown */}
        <select
          {...register('site')}
          className="w-60 h-12 capitalize border px-4 rounded-lg focus:outline-none"
        >
          <option value="">Select Site</option>
          <option value="site1">Site 1</option>
          <option value="site2">Site 2</option>
        </select>

        {/* VPN Type Dropdown */}
        <select
          {...register('vpnType')}
          className="w-60 h-12 capitalize border px-4 rounded-lg focus:outline-none"
        >
          <option value="">Select VPN Type</option>
          <option value="site-to-site">Site-to-Site</option>
          <option value="remote-access">Remote Access</option>
        </select>
      </div>

      {/* VPN List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
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
              {}
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
