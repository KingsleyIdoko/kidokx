import axios from "axios";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSiteData } from "../store/reducers/siteReducer";

export default function SiteList() {
  const [siteApiData, setSiteAPiData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/inventories/sites/"
        );
        setSiteAPiData(res.data);
      } catch (err) {
        console.log("Api call failed", err);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleAddSite = () => {
    navigate("/inventory/sites/create/");
  };

  const handleEdit = (site) => {
    dispatch(setSiteData(site));
    navigate("/inventory/sites/create/");
  };

  const handleDelete = async (siteId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/inventories/sites/${siteId}/delete/`
      );
      setSiteAPiData((prev) => prev.filter((site) => site.id !== siteId));
    } catch (err) {
      console.error("Delete failed", err.message);
    }
  };

  return (
    <div className="max-w-[120rem] px-10 py-8 bg-white mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Sites Overview</h1>
      <button
        className="mb-6 text-white py-2 px-6 bg-sky-400 rounded-md"
        onClick={handleAddSite}
      >
        Add Site
      </button>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border-t border-b border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
              #
            </th>
            <th className="border-t border-b border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
              Name
            </th>
            <th className="border-t border-b border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
              Location
            </th>
            <th className="border-t border-b border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-700">
              Address
            </th>
            <th className="border-t border-b border-gray-300 px-6 py-3 text-center text-sm font-medium text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {siteApiData.map((site, index) => (
            <tr key={site.id || index} className="hover:bg-gray-50">
              <td className="border-t border-b border-gray-300 px-6 py-4 text-sm">
                {index + 1}
              </td>
              <td className="border-t border-b border-gray-300 px-6 py-4 text-sm">
                {site.site_name}
              </td>
              <td className="border-t border-b border-gray-300 px-6 py-4 text-sm">
                {site.location}
              </td>
              <td className="border-t border-b border-gray-300 px-6 py-4 text-sm">
                {site.description}
              </td>
              <td className="border-t border-b border-gray-300 px-6 py-4 text-center">
                <div className="flex space-x-3 justify-center">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEdit(site)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(site.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
