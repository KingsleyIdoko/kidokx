import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setEditSecurityZone,
  setSecurityConfigType,
  setSelectedZoneID,
} from '../../../store/reducers/security';

export default function SecurityZone() {
  const dispatch = useDispatch();
  const { createzone } = useSelector((state) => state.security);
  const { selectedDevice } = useSelector((state) => state.inventories);
  const navigate = useNavigate();

  const [zones, setZones] = useState([]);
  const { register, watch, reset } = useForm({
    defaultValues: { selectedZoneId: '' },
  });
  const selectedZoneId = watch('selectedZoneId');
  useEffect(() => {
    dispatch(setSelectedZoneID(selectedZoneId));
  }, [selectedZoneId]);

  useEffect(() => {
    dispatch(setSecurityConfigType('zones'));
  }, [dispatch]);

  const handleCheckbox = (zones) => {
    dispatch(setEditSecurityZone(zones));
  };

  useEffect(() => {
    const fetchZones = async () => {
      if (!selectedDevice) return;
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/security/zones/?device=${selectedDevice}`,
        );
        setZones(response.data);
        reset({ selectedZoneId: '' });
      } catch (err) {
        console.error('Error fetching Zones:', err.message);
      }
    };
    fetchZones();
  }, [selectedDevice, reset]);

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {/* Removed the header checkbox completely */}
              <th className="px-2 py-3">Select</th>

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
                Description
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
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {zones.map((zone, index) => {
              const zoneId = String(zone.id);

              return (
                <tr
                  key={zone.id}
                  className={`" border-b border-gray-400 ${
                    zoneId && zoneId === selectedZoneId ? 'bg-sky-200' : ''
                  }
                      "`}
                >
                  <td className="px-2 m-3 scale-125 accent-gray-800">
                    <input
                      type="radio"
                      value={zoneId}
                      className="m-3"
                      onClick={() => handleCheckbox(zone)}
                      {...register('selectedZoneId')}
                    />
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {index + 1}
                  </td>

                  <td className="px-6 py-4">{zone.device}</td>
                  <td className="px-6 py-4">{zone.zone_name}</td>
                  <td className="px-6 py-4">{zone.description}</td>
                  <td className="px-6 py-4">{(zone.system_services ?? []).join(', ')}</td>
                  <td className="px-6 py-4">{zone.system_protocols}</td>
                  <td className="px-6 py-4">{zone.interface_names}</td>
                  <td className="px-6 py-4">"Deployed"</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
