import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  CONFIGTYPE,
  DEVICEINVENTORIES,
  SELECTEDDEVICE,
} from '../../vpnActions.jsx/actionTypes';
import { useIpsecData } from '../api/ikeProposalItems';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function VpnConfigList() {
  const { ikeProposalData: backendIkeProposalData } = useIpsecData();
  const [ikeProposalData, setIkeProposalData] = useState([]);

  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const { inventories = [], selectedDevice } = useSelector(
    (state) => state.inventories || {},
  );
  const { configtype } = useSelector((state) => state.vpn || {});

  useEffect(() => {
    if (backendIkeProposalData) {
      setIkeProposalData(backendIkeProposalData);
    }
  }, [backendIkeProposalData]);

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

  const handleEdit = (id) => {
    console.log(`Edit proposal with ID: ${id}`);
    // Implement modal or form logic here
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/ipsec/ikeproposal/${id}/delete/`,
      );
      if (response.status === 204 || response.status === 200) {
        setIkeProposalData((prevData) =>
          prevData.filter((proposal) => proposal.id !== id),
        );
      }
    } catch (err) {
      console.error('Error deleting proposal:', err.message);
    }
  };

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

      <button className="mb-6 bg-sky-400 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Create IKE Proposal
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left bg-white border border-gray-200">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 border-b">#</th>
              <th className="py-3 px-6 border-b">Device Name</th>
              <th className="py-3 px-6 border-b">Proposal Name</th>
              <th className="py-3 px-6 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {ikeProposalData.map((proposal) => (
              <tr key={proposal.id} className="hover:bg-gray-50">
                <td className="py-3 px-6 border-b">{proposal.id}</td>
                <td className="py-3 px-6 border-b">
                  <button
                    onClick={() => handleEdit(proposal.id)}
                    className="hover:underline"
                  >
                    {proposal.device}
                  </button>
                </td>
                <td className="py-3 px-6 border-b">
                  <button
                    onClick={() => handleEdit(proposal.id)}
                    className="hover:underline"
                  >
                    {proposal.proposalname}
                  </button>
                </td>
                <td className="py-3 px-6 border-b">
                  <div className="flex space-x-6 justify-center items-center">
                    <button onClick={() => handleEdit(proposal.id)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDelete(proposal.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
