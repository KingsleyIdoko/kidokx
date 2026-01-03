import axios from 'axios';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DualListSelector from './listselector';
import SelectedDevice from './selectDevice';

export default function SecurityZoneConfig() {
  const navigate = useNavigate();
  const { selectedDevice } = useSelector((state) => state.inventories);
  const { editsecurityzone, editingdata } = useSelector((state) => state.security);

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

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      zone_name: '',
      description: '',
      interfaces: [],
      system_services: [],
      system_protocols: [],
    },
  });

  useEffect(() => {
    const fetchInterfaces = async () => {
      if (!selectedDevice) return;
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/interfaces/zones/?device=${selectedDevice}`,
        );
        setInterfaces(response.data);
      } catch (error) {
        console.error('Failed to fetch interfaces:', error);
      }
    };
    fetchInterfaces();
  }, [selectedDevice]);

  // Prefill form when editing
  useEffect(() => {
    if (!editingdata) {
      // Back to create mode: clear form
      reset({
        zone_name: '',
        description: '',
        interfaces: [],
        system_services: [],
        system_protocols: [],
      });
      return;
    }

    // If editsecurityzone is FormData
    reset({
      zone_name: editsecurityzone.get('zone_name') ?? '',
      description: editsecurityzone.get('description') ?? '',
      interfaces: editsecurityzone.getAll('interfaces') ?? [],
      system_services: editsecurityzone.getAll('system_services') ?? [],
      system_protocols: editsecurityzone.getAll('system_protocols') ?? [], // use getAll for DualList
    });
  }, [editsecurityzone, reset]);

  const onSubmit = async (data) => {
    const finalPayload = { ...data, device: selectedDevice };

    try {
      if (!editsecurityzone) {
        await axios.post('http://127.0.0.1:8000/api/security/zones/create/', finalPayload);
      } else {
        await axios.put(
          `http://127.0.0.1:8000/api/security/zones/${editsecurityzone.get('id')}/update/`,
          finalPayload,
        );
      }

      navigate('/security/zones/list');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="sticky top-14 z-10 bg-white shadow">
        <SelectedDevice />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col bg-white p-8 rounded-xl shadow max-w-4xl mx-auto mt-2 gap-6"
      >
        <div className="flex items-center gap-4">
          <label className="w-40 font-semibold text-sm text-gray-700">Zone Name:</label>
          <input
            type="text"
            {...register('zone_name')}
            placeholder="Enter Zone name"
            className="flex-1 border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-40 font-semibold text-sm text-gray-700">Description:</label>
          <input
            type="text"
            {...register('description')}
            placeholder="Enter Description"
            className="flex-1 border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="flex items-start gap-4">
          <label className="w-40 font-semibold text-sm text-gray-700 mt-3">Interfaces:</label>
          <Controller
            name="interfaces"
            control={control}
            render={({ field: { ref, ...rest } }) => (
              <DualListSelector items={Interfaces} {...rest} />
            )}
          />
        </div>

        <div className="flex items-start gap-4">
          <label className="w-40 font-semibold text-sm text-gray-700 mt-3">System Services:</label>
          <Controller
            name="system_services"
            control={control}
            render={({ field: { ref, ...rest } }) => (
              <DualListSelector items={services} {...rest} />
            )}
          />
        </div>

        <div className="flex items-start gap-4">
          <label className="w-40 font-semibold text-sm text-gray-700 mt-3">System Protocols:</label>
          <Controller
            name="system_protocols"
            control={control}
            render={({ field: { ref, ...rest } }) => (
              <DualListSelector items={protocols} {...rest} />
            )}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded text-sm font-medium"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
