import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SearchDevice from "../../../../../inventory/searchdevice";
import {
  setEditedData,
  setValidated,
  setSaveConfiguration,
  setDeployconfiguration,
  setIkeProposalData,
  setEditing,
  setCreateVpnData,
} from "../../../../../store/reducers/vpnReducer";
import {
  setDeviceInventories,
  setSelectedDevice,
} from "../../../../../store/reducers/inventoryReducers";
import { useIpsecData } from "../api/ikeProposalItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function VpnConfigList() {
  const { ikeProposalData, ikePolicyData } = useIpsecData();
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

  useEffect(() => {
    if (configtype === "ikeproposal") {
      setUpdatedData(Array.isArray(ikeProposalData) ? ikeProposalData : []);
    } else if (configtype === "ikepolicy") {
      setUpdatedData(Array.isArray(ikePolicyData) ? ikePolicyData : []);
    }
  }, [configtype, ikeProposalData, ikePolicyData]);

  useEffect(() => {
    let isMounted = true;

    const fetchDeviceList = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/inventories/devices/"
        );
        if (isMounted) {
          dispatch(setDeviceInventories(res.data));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error("Error fetching device list:", err.message);
        }
      }
    };

    fetchDeviceList();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const handleEdit = (proposal) => {
    dispatch(setEditedData(proposal));
    dispatch(setSelectedDevice(proposal.device));
    dispatch(setEditing(true));
    dispatch(setSaveConfiguration(false));
    navigate(`/vpn/site-to-site/config/ikeproposal/edit/${proposal.id}/`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/ipsec/ikeproposal/${id}/delete/`
      );
      if (response.status === 204 || response.status === 200) {
        setUpdatedData((prevData) =>
          prevData.filter((proposal) => proposal.id !== id)
        );
      }
    } catch (err) {
      console.error("Error deleting proposal:", err.message);
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
        {`Create ${configtype ? configtype : "Ike Proposal"}`}
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
            {(updatedData || []).length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No {configtype} data found.
                </td>
              </tr>
            ) : (
              updatedData
                .sort((a, b) => b.id - a.id)
                .map((proposal, index) => (
                  <tr key={proposal.id} className="hover:bg-gray-50">
                    <td className="py-3 px-6 border-b">{index + 1}</td>
                    <td className="py-3 px-6 border-b">
                      <button>{proposal.device}</button>
                    </td>
                    <td className="py-3 px-6 border-b">
                      <button
                        onClick={() => handleEdit(proposal)}
                        className="hover:underline"
                      >
                        {proposal.proposalname}
                      </button>
                    </td>
                    <td className="py-3 px-6 border-b">
                      <div className="flex space-x-6 justify-center items-center">
                        <button onClick={() => handleEdit(proposal)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button onClick={() => handleDelete(proposal.id)}>
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
