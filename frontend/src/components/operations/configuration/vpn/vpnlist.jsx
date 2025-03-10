import { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

function VPNList() {
  const [ikeProposalData, setIkeProposalData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/api/ipsec/ikeproposal/',
        );
        setIkeProposalData(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="text-red-500">Error fetching data: {error}</div>;
  }

  return (
    <div className="w-[84rem] bg-white flex items-center justify-center mx-auto mt-10 rounded-xl shadow-lg p-4">
      <table className="w-full table-auto">
        <thead className="bg-sky-200 text-gray-700 capitalize text-sm">
          <tr>
            <th className="py-4 px-8 text-left">ID</th>
            <th className="py-4 px-8 text-left">Name</th>
            <th className="py-4 px-8 text-left">Device</th>
            <th className="py-4 px-8 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {ikeProposalData.map((entry, index) => (
            <tr
              key={entry.id || index}
              className="border-b border-gray-200 hover:bg-sky-100"
            >
              <td className="py-4 px-10 text-left">{index + 1}</td>
              <td className="py-4 px-10 text-left">{entry.name}</td>
              <td className="py-4 px-10 text-left">{entry.device_name}</td>
              <td className="py-4 px-10 text-center">
                <button className="text-gray-700 px-3 py-1 rounded text-xs">
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
                <button className="text-gray-700 px-3 py-1 rounded text-xs ml-2">
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VPNList;
