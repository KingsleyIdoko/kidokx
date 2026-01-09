import axios from 'axios';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import DualListSelector from './listselector';

export default function SecurityZoneConfig() {
  const navigate = useNavigate();
  const { id } = useParams(); // <-- /security/zones/update/:id
  const isEditMode = Boolean(id);

  const { selectedDevice } = useSelector((state) => state.inventories);
  const { editsecurityzone } = useSelector((state) => state.security);

  const [Interfaces, setInterfaces] = useState([]);

  const services = [
    'all',
    'any-service',
    'appqoe',
    'bootp',
    'dhcp',
    'dhcpv6',
    'dns',
    'finger',
    'ftp',
    'high-availability',
    'http',
    'https',
    'ident-reset',
    'ike',
    'lsping',
    'lsselfping',
    'netconf',
    'ntp',
    'ping',
    'r2cp',
    'reverse-ssh',
    'reverse-telnet',
    'rlogin',
    'rpm',
    'rsh',
    'snmp',
    'snmp-trap',
    'ssh',
    'tcp-encap',
    'telnet',
    'tftp',
    'traceroute',
    'webapi-clear-text',
    'webapi-ssl',
    'xnm-clear-text',
    'xnm-ssl',
  ];

  const protocols = [
    'all',
    'bfd',
    'bgp',
    'dvmrp',
    'igmp',
    'ldp',
    'msdp',
    'nhrp',
    'ospf',
    'ospf3',
    'pgm',
    'pim',
    'rip',
    'ripng',
    'router-discovery',
    'rsvp',
    'sap',
    'vrrp',
  ];

  const { register, handleSubmit, control, reset, getValues } = useForm({
    defaultValues: {
      zone_name: '',
      description: '',
      interfaces: [],
      system_services: [],
      system_protocols: [],
    },
  });

  // Load available interfaces for the dual list
  useEffect(() => {
    const fetchInterfaces = async () => {
      if (!selectedDevice) return;
      const res = await axios.get(
        `http://127.0.0.1:8000/api/interfaces/zones/?device=${selectedDevice}`,
      );
      setInterfaces(res.data);
    };

    fetchInterfaces().catch((e) => console.error('Failed to fetch interfaces:', e));
  }, [selectedDevice]);

  // ✅ Prefill logic (this is the important part)
  useEffect(() => {
    const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

    const fill = (zone) => {
      reset({
        zone_name: zone?.zone_name ?? '',
        description: zone?.description ?? '',
        interfaces: toArray(zone?.interface_names), // your API uses interface_names
        system_services: toArray(zone?.system_services),
        system_protocols: toArray(zone?.system_protocols),
      });

      // Quick sanity check in console:
      // If this shows correct values but input is empty -> something else is overwriting form state.
      console.log('RHF values after reset:', getValues());
    };

    // Create mode -> clear
    if (!isEditMode) {
      fill(null);
      return;
    }

    // Edit mode -> prefer redux if it matches this id
    if (editsecurityzone && String(editsecurityzone.id) === String(id)) {
      fill(editsecurityzone);
      return;
    }

    // If redux is empty (refresh) or mismatch -> fetch by id
    (async () => {
      const res = await axios.get(`http://127.0.0.1:8000/api/security/zones/${id}/`);
      fill(res.data);
    })().catch((e) => console.error('Failed to fetch zone for edit:', e));
  }, [isEditMode, id, editsecurityzone, reset, getValues]);

  const handleCloseBtn = () => navigate('/security/zones/list');

  const onSubmit = async (data) => {
    const finalPayload = { ...data, device: selectedDevice };
    console.log(finalPayload);
    try {
      if (!isEditMode) {
        await axios.post('http://127.0.0.1:8000/api/security/zones/create/', finalPayload);
      } else {
        await axios.put(`http://127.0.0.1:8000/api/security/zones/update/${id}/`, finalPayload);
      }
      navigate('/security/zones/list');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col bg-white p-8 rounded-xl shadow max-w-4xl mx-auto mt-2 gap-6"
    >
      {/* Close button */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          aria-label="Close"
          onClick={handleCloseBtn}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50"
        >
          <span className="absolute h-5 w-1 rotate-45 rounded bg-gray-800"></span>
          <span className="absolute h-5 w-1 -rotate-45 rounded bg-gray-800"></span>
        </button>
      </div>

      {/* Zone name */}
      <div className="flex items-center gap-4">
        <label className="w-40 font-semibold text-sm text-gray-700">Zone Name:</label>
        <input
          type="text"
          {...register('zone_name')}
          className="flex-1 border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Description */}
      <div className="flex items-center gap-4">
        <label className="w-40 font-semibold text-sm text-gray-700">Description:</label>
        <input
          type="text"
          {...register('description')}
          className="flex-1 border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Interfaces */}
      <div className="flex items-start gap-4">
        <label className="w-40 font-semibold text-sm text-gray-700 mt-3">Interfaces:</label>
        <Controller
          name="interfaces"
          control={control}
          render={({ field }) => (
            <DualListSelector
              items={Interfaces}
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="flex items-start gap-4">
        <label className="w-40 font-semibold text-sm text-gray-700 mt-3">System Services:</label>

        <Controller
          name="system_services"
          control={control}
          render={({ field }) => (
            <DualListSelector
              items={services}
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="flex items-start gap-4">
        <label className="w-40 font-semibold text-sm text-gray-700 mt-3">System Protocols:</label>

        <Controller
          name="system_protocols"
          control={control}
          render={({ field }) => (
            <DualListSelector
              items={protocols}
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded text-sm font-medium"
        >
          {isEditMode ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
}
