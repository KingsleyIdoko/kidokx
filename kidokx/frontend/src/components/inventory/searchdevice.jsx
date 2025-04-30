import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  setIsSelectedDevice,
  setSelectedDevice,
} from '../store/reducers/inventoryReducers';
import {
  setConfigType,
  setValidSearchComponent,
} from '../store/reducers/vpnReducer';
import { setGetSiteName } from '../store/reducers/siteReducer';

export function SearchDevice() {
  const { configtype, saveconfiguration, editingData, createvpndata } =
    useSelector((state) => state.vpn);
  const { selectedDevice, inventories } = useSelector(
    (state) => state.inventories,
  );
  const { sitenames = [] } = useSelector((state) => state.site.sitenames);

  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const [siteNames, setSiteNames] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditPath = location.pathname.includes('/edit/');

  const {
    watch,
    register,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      device: selectedDevice || '',
      config: configtype || '',
    },
  });
  const watchConfig = watch('config');
  const watchDevice = watch('device');
  const selectedsite = watch('site');

  let filteredDevice = [];
  if (selectedsite) {
    filteredDevice = devices.filter((device) => device.site === selectedsite);
  } else {
    filteredDevice = devices;
  }

  useEffect(() => {
    if (configtype) {
      setValue('config', configtype);
    }
  }, [configtype, setValue]);

  useEffect(() => {
    if (watchConfig) {
      dispatch(setConfigType(watchConfig.toLowerCase()));
      dispatch(setSelectedDevice(watchDevice));
    }
  }, [watchConfig, watchDevice, dispatch]);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/api/inventories/sites/names/',
        );
        if (response.status === 200) {
          setSiteNames(response.data);
          dispatch(setGetSiteName(response.data));
        }
      } catch (err) {
        console.log('Error occurred fetching site names:', err);
      }
    };

    if (sitenames) {
      setSiteNames(siteNames);
    }

    if (!siteNames || Object.keys(siteNames).length === 0) {
      fetchSiteData();
    }
  }, [siteNames, dispatch]);

  useEffect(() => {
    if (saveconfiguration || createvpndata) {
      const validateAndNavigate = async () => {
        const isValid = await trigger(['device', 'config']);
        if (isValid) {
          const { device: watchDevice, config: watchConfig } = getValues();
          const config = watchConfig.toLowerCase();
          dispatch(setConfigType(config));
          dispatch(setSelectedDevice(watchDevice));
          dispatch(setIsSelectedDevice(true));
          dispatch(setValidSearchComponent(true));
        } else {
          dispatch(setIsSelectedDevice(false));
        }
      };
      validateAndNavigate();
    }
  }, [
    saveconfiguration,
    createvpndata,
    trigger,
    getValues,
    dispatch,
    navigate,
  ]);

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

  if (error) {
    return <p className="text-red-500">Error fetching data: {error.message}</p>;
  }

  return (
    <form className="flex py-3 justify-between mx-auto items-start gap-3">
      <div className="w-full flex flex-col">
        <select
          {...register('site', { required: 'Select site' })}
          className="w-full py-3 px-3 border rounded focus:outline-none capitalize"
        >
          <option value=""> select Site</option>
          {siteNames.map((site, index) => (
            <option key={index} value={site}>
              {site}
            </option>
          ))}
        </select>
        {errors.device && (
          <p className="pl-3 text-sm text-red-500 font-medium flex items-center mt-2">
            {errors.device.message}
          </p>
        )}
      </div>
      <div className="w-full flex flex-col">
        <select
          {...register('device', { required: 'Select device' })}
          className={`w-full py-3 px-3 border focus:outline-none rounded 
            ${errors.device ? 'border-red-500' : ''}
            ${editingData ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          disabled={editingData}
        >
          <option value="">Select Device</option>
          {filteredDevice.map((device) => {
            return (
              <option key={device.id} value={device.name}>
                {device.device_name}
              </option>
            );
          })}
        </select>
        {errors.device && (
          <p className="pl-3 text-sm text-red-500 font-medium flex items-center mt-2">
            {errors.device.message}
          </p>
        )}
      </div>

      <div className="w-full flex flex-col">
        <select
          {...register('config', { required: 'Select config type' })}
          className={`w-full py-3 px-3 border focus:outline-none rounded ${
            errors.config ? 'border-red-500' : ''
          } ${editingData ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={editingData}
        >
          <option value="">Select Config</option>
          <option value="ikeproposal">IKE Proposals</option>
          <option value="ikepolicy">IKE Policies</option>
          <option value="ikegateway">IKE Gateways</option>
          <option value="ipsecproposal">IPSec Proposals</option>
          <option value="ipsecpolicy">IPSec Policies</option>
          <option value="ipsecvpn">IPSec VPNs</option>
        </select>
        {errors.config && (
          <p className="pl-3 text-sm text-red-500 font-medium flex items-center mt-2">
            {errors.config.message}
          </p>
        )}
      </div>

      <div className="w-full flex flex-col">
        <select className="w-full py-3 px-3 border rounded focus:outline-none">
          <option value="">Vendor</option>
        </select>
      </div>
    </form>
  );
}

export default SearchDevice;
