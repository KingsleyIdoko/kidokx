import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SearchDevice from '../../../../../inventory/searchdevice';
import { BaseUrl } from '../api/postikeproposal';
import {
  setEditedData,
  setValidated,
  setSaveConfiguration,
  setDeployconfiguration,
  setIkeProposalData,
  setEditing,
  setCreateVpnData,
  setIpsecVpnData,
} from '../../../../../store/reducers/vpnReducer';
import { setSelectedDevice } from '../../../../../store/reducers/inventoryReducers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function VpnConfigList() {
  const [updatedData, setUpdatedData] = useState([]);
  const [error, setError] = useState(null);
  const [pendingRedirect, setPendingRedirect] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    configtype,
    editeddata,
    ikeProposalData: proposalFromStore,
    validsearchcomponent,
  } = useSelector((state) => state.vpn || {});
  const { selectedDevice } = useSelector((state) => state.inventories);

  useEffect(() => {
    const fetchData = async () => {
      const errors = [];
      const urlPath = `${BaseUrl}/api/ipsec/${configtype}/`;
      try {
        if (!selectedDevice) return;
        const vpndata = await axios.get(urlPath);
        if (Array.isArray(vpndata.data)) {
          // console.log(vpndata.data);
          setUpdatedData(vpndata.data);
          dispatch(setIpsecVpnData(vpndata.data));
        }
      } catch (err) {
        errors.push(`Error fetching data: ${err.message}`);
        console.error('Error fetching IPsec data:', err);
      } finally {
        setError(errors.length ? errors : null);
      }
    };

    fetchData();
  }, [configtype, dispatch, selectedDevice]);

  const handleEdit = (item) => {
    dispatch(setEditedData(item));
    dispatch(setSelectedDevice(item.device));
    dispatch(setEditing(true));
    dispatch(setSaveConfiguration(false));
    navigate(`/vpn/site-to-site/config/${configtype}/edit/${item.id}/`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/ipsec/${configtype}/${id}/delete/`,
      );
      if (response.status === 204 || response.status === 200) {
        setUpdatedData((prevData) =>
          prevData.filter((proposal) => proposal.id !== id),
        );
      }
    } catch (err) {
      console.error('Error deleting proposal:', err.message);
    }
  };

  const handleCreateBtn = () => {
    dispatch(setCreateVpnData(true));
    dispatch(setEditedData({}));
    dispatch(setIkeProposalData({}));
    dispatch(setValidated(false));
    dispatch(setSaveConfiguration(false));
    dispatch(setDeployconfiguration(false));
    dispatch(setEditing(false));
    setPendingRedirect(true);
    setTimeout(() => dispatch(setCreateVpnData(false)), 2000);
  };

  const isEditedDataEmpty =
    editeddata &&
    Object.keys(editeddata).length === 0 &&
    editeddata.constructor === Object;

  const isIkeProposalEmpty =
    proposalFromStore &&
    Object.keys(proposalFromStore).length === 0 &&
    proposalFromStore.constructor === Object;

  const isSamePath =
    location.pathname === `/vpn/site-to-site/config/${configtype}/`;

  useEffect(() => {
    if (
      pendingRedirect &&
      isEditedDataEmpty &&
      isIkeProposalEmpty &&
      configtype &&
      validsearchcomponent &&
      !isSamePath
    ) {
      navigate(`/vpn/site-to-site/config/${configtype}/`);
      setPendingRedirect(false);
    }
  }, [
    editeddata,
    proposalFromStore,
    configtype,
    pendingRedirect,
    navigate,
    location.pathname,
    isEditedDataEmpty,
    isIkeProposalEmpty,
    isSamePath,
    validsearchcomponent,
  ]);

  const titleMap = {
    ikeproposal: 'IKEPROPOSAL NAME',
    ikepolicy: 'IKEPOLICY NAME',
    ikegateway: 'IKEGATEWAY NAME',
    ipsecproposal: 'IPSECPROPOSAL NAME',
    ipsecpolicy: 'IPSECPOLICY NAME',
    ipsecvpn: 'IPSECVPN NAME',
  };

  const title = titleMap[configtype] || 'IKEPROPOSAL NAME';

  return (
    <div className="max-w-[96rem] mx-auto bg-white rounded-lg p-8 shadow-md mt-10">
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <div className="w-[90rem] justify-between items-start gap-3 mb-4">
        <SearchDevice />
      </div>
      <button
        className="w-[12rem] mb-6 bg-sky-400 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={handleCreateBtn}
      >
        {`Create ${configtype ? configtype : 'Ike Proposal'}`}
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left bg-white border border-gray-200">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 border-b">#</th>
              <th className="py-3 px-6 border-b">Device Name</th>
              <th className="py-3 px-6 border-b">{title}</th>
              <th className="py-3 px-6 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {(updatedData || []).length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No {configtype} data found.
                </td>
              </tr>
            ) : (
              updatedData
                .sort((a, b) => b.id - a.id)
                .map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-6 border-b">{index + 1}</td>
                    <td className="py-3 px-6 border-b">
                      <button>{item.device}</button>
                    </td>
                    <td className="py-3 px-6 border-b">
                      <button
                        onClick={() => handleEdit(item)}
                        className="hover:underline"
                      >
                        {configtype === 'ikeproposal'
                          ? item.proposalname
                          : configtype === 'ikepolicy'
                          ? item.policyname
                          : configtype === 'ikegateway'
                          ? item.gatewayname
                          : item.proposal_name}
                      </button>
                    </td>
                    <td className="py-3 px-6 border-b">
                      <div className="flex space-x-6 justify-center items-center">
                        <button onClick={() => handleEdit(item)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button onClick={() => handleDelete(item.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
