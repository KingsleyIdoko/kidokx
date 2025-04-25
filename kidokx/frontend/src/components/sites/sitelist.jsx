import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function SiteList() {
  const [siteData, setSiteData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          'http://127.0.0.1:8000/api/inventories/sites/',
        );
        setSiteData(res.data);
      } catch (err) {
        console.log('Api call failed', err);
      }
    };
    fetchData();
  }, []);

  const handleAddSite = () => {
    navigate('/inventory/sites/create/');
  };

  return (
    <div className="w-[120rem] px-10 py-8 bg-white mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Sites Overview</h1>
      <button
        className=" mb-6 text-white py-2 px-6 bg-sky-400 rounded-md"
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
          {siteData.map((site, index) => (
            <tr key={index} className="hover:bg-gray-50">
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
                <div className="flex space-x-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
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
