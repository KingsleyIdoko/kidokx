import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSecurityConfigType } from '../../../store/reducers/security';
import SelectedDevice from './selectDevice';
import SecurityZoneConfig from './zoneconfig';

export default function SecurityZone() {
  const dispatch = useDispatch();
  const { securityconfigtype, createzone } = useSelector((state) => state.security);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);

  const { selectedDevice } = useSelector((state) => state.inventories);

  console.log(selectedDevice);
  useEffect(() => {
    dispatch(setSecurityConfigType('zones'));
  }, [dispatch]);

  useEffect(() => {
    const fetchZones = async () => {
      if (!selectedDevice) return;
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/security/zones/?device=${selectedDevice}`,
        );
        console.log(response.data);
        setZones(response.data);
      } catch (err) {
        console.error('Error fetching IKE Policy data:', err.message);
      } finally {
      }
    };
    fetchZones();
  }, [selectedDevice]);

  return (
    <div>
      <div className="sticky top-14 z-10 bg-white shadow">
        <SelectedDevice />
      </div>
      {createzone ? (
        <SecurityZoneConfig />
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th></th>
                <th scope="col" className="px-6 py-3">
                  SN
                </th>
                <th scope="col" className="px-6 py-3">
                  Device
                </th>
                <th scope="col" className="px-6 py-3">
                  Zone-Name
                </th>
                <th scope="col" className="px-6 py-3">
                  System-Services
                </th>
                <th scope="col" className="px-6 py-3">
                  Protocols
                </th>
                <th scope="col" className="px-6 py-3">
                  Interfaces
                </th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone, index) => (
                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                  <td>
                    <input
                      type="checkbox"
                      id="vehicle1"
                      name="vehicle1"
                      value="Bike"
                      className="m-3"
                    />
                  </td>

                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {index}
                  </td>

                  <td className="px-6 py-4">{zone.device}</td>
                  <td className="px-6 py-4">{zone.zone_name}</td>
                  <td className="px-6 py-4">{zone.system_services}</td>
                  <td className="px-6 py-4">{zone.system_protocols}</td>
                  <td className="px-6 py-4">{zone.interface_names}</td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
