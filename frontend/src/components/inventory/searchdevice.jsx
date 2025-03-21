import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SELECTEDDEVICE } from '../operations/configuration/vpn/vpnActions.jsx/actionTypes';

export function SearchDevice() {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { selectedDevice } = useSelector((state) => state.vpn);

  const handleSelectedDevice = (device) => {
    dispatch({ type: SELECTEDDEVICE, payload: device });
  };

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

  if (error) {
    return <p className="text-red-500">Error fetching data: {error.message}</p>;
  }

  return (
    <form className="flex py-3 justify-between mx-auto items-center gap-3">
      <select
        className="w-full py-3 px-3 border focus:outline-none"
        value={selectedDevice || ''}
        onChange={(e) => handleSelectedDevice(e.target.value)}
      >
        <option value="">Select Device</option>
        {devices.map((device, index) => (
          <option key={device.id || index} value={device.name}>
            {device.name}
          </option>
        ))}
      </select>

      <select className="w-full py-3 px-3 border focus:outline-none">
        <option value="">Site</option>
        <option value="AMS">AMS</option>
        <option value="LON">LON</option>
        <option value="NYC">NYC</option>
        <option value="LA">LA</option>
      </select>

      <select className="w-full py-3 px-3 border focus:outline-none">
        <option value="">Model</option>
      </select>

      <select className="w-full py-3 px-3 border focus:outline-none">
        <option value="">Vendor</option>
      </select>
    </form>
  );
}

export default SearchDevice;
