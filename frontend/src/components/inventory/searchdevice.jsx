import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SELECTEDDEVICE } from '../store/reducers/vpnReducer';
import { CONFIGTYPE } from '../store/reducers/vpnReducer';
import { useForm } from 'react-hook-form';

export function SearchDevice() {
  const { configtype, saveconfiguration } = useSelector((state) => state.vpn);
  const { selectedDevice, inventories } = useSelector(
    (state) => state.inventories,
  );
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  console.log(saveconfiguration);
  const {
    register,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      device: '',
      config: configtype || '',
    },
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (saveconfiguration) {
      const validateAndPost = async () => {
        await trigger(['device', 'config']);
      };
      validateAndPost();
    }
  }, [saveconfiguration]);

  useEffect(() => {
    if (selectedDevice && devices.some((d) => d.name === selectedDevice)) {
      setValue('device', selectedDevice, { shouldValidate: true });
    }
  }, [selectedDevice, devices, setValue]);

  useEffect(() => {
    if (inventories && inventories.length) {
      setDevices(inventories);
    } else {
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
    }
  }, [inventories]);

  const watchConfig = watch('config');
  const watchDevice = watch('device');

  useEffect(() => {
    if (watchConfig && watchDevice) {
      const config = watchConfig.toLowerCase();
      dispatch({ type: CONFIGTYPE, payload: config });
      dispatch({ type: SELECTEDDEVICE, payload: watchDevice });
      navigate(`/vpn/site-to-site/config/${config}/`);
    }
  }, [watchConfig, watchDevice]);

  if (error) {
    return <p className="text-red-500">Error fetching data: {error.message}</p>;
  }

  return (
    <form className="flex py-3 justify-between mx-auto items-start gap-3">
      <div className="w-full flex flex-col">
        <select
          {...register('device', { required: 'Select device' })}
          className={`w-full py-3 px-3 border focus:outline-none rounded ${
            errors.device ? 'border-red-500' : ''
          }`}
        >
          <option value="">Select Device</option>
          {devices.map((device) => (
            <option key={device.id} value={device.name}>
              {device.name}
            </option>
          ))}
        </select>
        <div className="h-6">
          {errors.device && (
            <p className="pl-3 text-sm text-red-500 font-medium flex items-center mt-2">
              {errors.device.message}
            </p>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col">
        <select
          {...register('config', { required: 'Select config type' })}
          className={`w-full py-3 px-3 border focus:outline-none rounded ${
            errors.config ? 'border-red-500' : ''
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
        <div className="h-6">
          {errors.config && (
            <p className="pl-3 text-sm text-red-500 font-medium flex items-center mt-2">
              {errors.config.message}
            </p>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col">
        <select className="w-full py-3 px-3 border rounded focus:outline-none">
          <option value="">Site</option>
          <option value="AMS">AMS</option>
          <option value="LON">LON</option>
          <option value="NYC">NYC</option>
          <option value="LA">LA</option>
        </select>
        <div className="h-6"></div>
      </div>

      <div className="w-full flex flex-col">
        <select className="w-full py-3 px-3 border rounded focus:outline-none">
          <option value="">Vendor</option>
        </select>
        <div className="h-6"></div>
      </div>
    </form>
  );
}

export default SearchDevice;
