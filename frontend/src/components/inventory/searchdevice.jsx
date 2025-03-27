import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  SELECTEDDEVICE,
  CONFIGTYPE,
} from '../operations/configuration/vpn/vpnActions.jsx/actionTypes';
import { useForm } from 'react-hook-form';

export function SearchDevice() {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' });
  const dispatch = useDispatch();
  const { selectedDevice, configtype } = useSelector((state) => state.vpn);

  // Fetch devices from API on component mount
  useEffect(() => {
    const getDevice = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/api/inventories/devices/',
        );
        setDevices(response.data);
      } catch (error) {
        console.error('Error fetching device data:', error);
        setError(error);
      }
    };

    getDevice();
  }, []);

  // Handler for selecting a device
  const handleSelectedDevice = (e) => {
    dispatch({ type: SELECTEDDEVICE, payload: e.target.value });
  };

  // Handler for selecting a configuration type
  const watchConfig = watch('config');

  useEffect(() => {
    if (watchConfig) {
      const config = watchConfig.toLowerCase();
      dispatch({ type: CONFIGTYPE, payload: config });
      navigate(`/vpn/site-to-site/config/${config}/`);
    }
  }, [watchConfig]);

  if (error) {
    return <p className="text-red-500">Error fetching data: {error.message}</p>;
  }

  return (
    <form className="flex py-3 justify-between mx-auto items-center gap-3">
      <select
        className="w-full py-3 px-3 border focus:outline-none"
        value={selectedDevice || ''}
        onChange={handleSelectedDevice}
      >
        <option value="">Select Device</option>
        {devices.map((device, index) => (
          <option key={device.id || index} value={device.name}>
            {device.name}
          </option>
        ))}
      </select>

      <select
        value={configtype || ''}
        {...register('config', { required: true })}
        className={`w-full py-3 px-3 border focus:outline-none ${
          errors.config ? 'border-b-2 border-red-500' : ''
        }`}
        aria-label="Select Configuration Type"
      >
        <option value="">Select Config</option>
        <option value="ikeproposal">IKE Proposals</option>
        <option value="ikepolicy">IKE Policies</option>
        <option value="ikegateway">IKE Gateways</option>
        <option value="ipsecproposal">IPSec Proposals</option>
        <option value="ipsecpolicy">IPSec Policies</option>
        <option value="ipsecvpn">IPSec VPNs</option>
      </select>

      <select className="w-full py-3 px-3 border focus:outline-none">
        <option value="">Site</option>
        <option value="AMS">AMS</option>
        <option value="LON">LON</option>
        <option value="NYC">NYC</option>
        <option value="LA">LA</option>
      </select>
      <select className="w-full py-3 px-3 border focus:outline-none">
        <option value="">Vendor</option>
      </select>
    </form>
  );
}

export default SearchDevice;
