import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SearchDevice from "../../../../../inventory/searchdevice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BaseUrl } from "../api/postikeproposal";
import {
  setEditedData,
  setValidated,
  setSaveConfiguration,
  setDeployconfiguration,
  setIkeProposalData,
  setEditing,
  setCreateVpnData,
  setIpsecVpnData,
} from "../../../../../store/reducers/vpnReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function VpnConfigList() {
  const [updatedData, setUpdatedData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const fetchData = async () => {
    if (!selectedDevice || selectedDevice.trim() === "") {
      setUpdatedData([]);
      return;
    }
    setLoading(true);
    const urlPath = `${BaseUrl}/api/ipsec/${configtype}/?device=${selectedDevice}`;
    try {
      const vpndata = await axios.get(urlPath);
      if (Array.isArray(vpndata.data)) {
        const modified_data = vpndata.data.map((item) => {
          if ("device_name" in item && !("device" in item)) {
            const { device_name, ...rest } = item;
            return { ...rest, device: device_name };
          }
          return item;
        });
        setUpdatedData(modified_data);
      }
    } catch (err) {
      toast.error(`Error fetching data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    dispatch(setEditing(true));
    dispatch(setSaveConfiguration(false));
    dispatch(setEditedData(item));
    navigate(`/vpn/site-to-site/config/${configtype}/edit/${item.id}/`);
  };

  const handleDelete = async (id) => {
    const item = updatedData.find((p) => p.id === id);
    const payload = {
      device: item.device,
      ikename:
        item.proposalname ||
        item.policyname ||
        item.gatewayname ||
        item.proposal_name ||
        item.policy_name ||
        item.vpn_name,
    };
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/ipsec/${configtype}/${id}/delete/`,
        { data: payload }
      );
      if (response.status === 204 || response.status === 200) {
        setUpdatedData((prevData) =>
          prevData.filter((proposal) => proposal.id !== id)
        );
      }
    } catch (err) {
      toast.error(`Error fetching data: ${err.message}`);
    }
  };

  const handleDeploy = async (item) => {
    const deployData = {
      ...item,
      is_published: true,
      is_sendtodevice: true,
    };
    console.log(deployData);
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/ipsec/${configtype}/${item.id}/update/`,
        deployData
      );
      await fetchData();
    } catch (err) {
      console.error("Post/Put failed:", err.message);
      dispatch(setValidated(false));
    }
  };

  const handleCreateBtn = () => {
    dispatch(setEditedData({}));
    dispatch(setIkeProposalData({}));
    dispatch(setValidated(false));
    dispatch(setSaveConfiguration(false));
    dispatch(setDeployconfiguration(false));
    dispatch(setEditing(false));
    dispatch(setCreateVpnData(true));
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
    fetchData();
  }, [selectedDevice, configtype, dispatch]);

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
    ikeproposal: "IKEPROPOSAL NAME",
    ikepolicy: "IKEPOLICY NAME",
    ikegateway: "IKEGATEWAY NAME",
    ipsecproposal: "IPSECPROPOSAL NAME",
    ipsecpolicy: "IPSECPOLICY NAME",
    ipsecvpn: "IPSECVPN NAME",
  };
  const title = titleMap[configtype] || "IKEPROPOSAL NAME";
  return (
    <div className="max-w-[96rem] mx-auto bg-white rounded-lg p-8 shadow-md mt-10">
      <div className="w-[90rem] justify-between items-start gap-3 mb-4">
        <ToastContainer
          position="top-center" // change this to "top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <SearchDevice />
      </div>
      <button
        className="w-[12rem] mb-6 bg-sky-400 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={handleCreateBtn}
      >
        {`Create ${configtype ? configtype : "Ike Proposal"}`}
      </button>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left bg-white border border-gray-200">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 border-b w-[10rem]">#</th>
                <th className="py-3 px-6 border-b w-[10rem]">Device Name</th>
                <th className="py-3 px-6 border-b w-[10rem]">{title}</th>
                <th className="py-3 px-6 border-b text-center w-[10rem]">
                  Action
                </th>
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
                  .map((item, index) => {
                    return (
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
                            {configtype === "ikeproposal"
                              ? item.proposalname
                              : configtype === "ikepolicy"
                              ? item.policyname
                              : configtype === "ikegateway"
                              ? item.gatewayname
                              : configtype === "ipsecproposal"
                              ? item.proposalname
                              : configtype === "ipsecpolicy"
                              ? item.policy_name
                              : configtype === "ipsecvpn"
                              ? item.vpn_name
                              : ""}
                          </button>
                        </td>
                        <td className="py-3 px-6 border-b">
                          <div className="flex flex-col items-center">
                            <div className="flex space-x-6 justify-center items-center">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-sky-400"
                                title={`edit ${
                                  configtype === "ikeproposal"
                                    ? item.proposalname?.toLowerCase()
                                    : configtype === "ikepolicy"
                                    ? item.policyname?.toLowerCase()
                                    : configtype === "ikegateway"
                                    ? item.gatewayname?.toLowerCase()
                                    : configtype === "ipsecproposal"
                                    ? item.proposalname?.toLowerCase()
                                    : configtype === "ipsecpolicy"
                                    ? item.policy_name?.toLowerCase()
                                    : configtype === "ipsecvpn"
                                    ? item.vpn_name?.toLowerCase()
                                    : ""
                                }`}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className={`text-sky-400 ${
                                  item.in_use
                                    ? "cursor-not-allowed text-gray-400"
                                    : ""
                                }`}
                                disabled={item.in_use}
                                title={`${item.in_use ? "In-use:" : "delete"} ${
                                  configtype === "ikeproposal"
                                    ? item.proposalname?.toLowerCase()
                                    : configtype === "ikepolicy"
                                    ? item.policyname?.toLowerCase()
                                    : configtype === "ikegateway"
                                    ? item.gatewayname?.toLowerCase()
                                    : configtype === "ipsecproposal"
                                    ? item.proposalname?.toLowerCase()
                                    : configtype === "ipsecpolicy"
                                    ? item.policy_name?.toLowerCase()
                                    : configtype === "ipsecvpn"
                                    ? item.vpn_name?.toLowerCase()
                                    : ""
                                }`}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                              <button
                                onClick={() => handleDeploy(item)}
                                disabled={item.is_published}
                                className={`w-[5rem] text-gray-600 ${
                                  item.is_published
                                    ? "bg-sky-200 opacity-70 cursor-not-allowed"
                                    : "bg-sky-400 text-white hover:opacity-70"
                                } py-1 rounded-lg`}
                              >
                                {item.is_published ? "Deployed" : "Deploy"}
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
