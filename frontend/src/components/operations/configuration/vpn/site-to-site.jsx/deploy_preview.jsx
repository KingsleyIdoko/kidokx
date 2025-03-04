import { useState } from 'react';

function DeployPreview() {
  // State to handle the selected format (json, xml, cli)
  const [selectedFormat, setSelectedFormat] = useState('json');

  return (
    <div className="flex items-center justify-between">
      {/* Preview Button */}
      <button className="capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 hover:opacity-70">
        preview
      </button>

      <div className="flex space-x-3 items-center justify-center">
        {/* Format label and select input */}
        <label
          htmlFor="format"
          className="capitalize text-black bg-gray-100 rounded-lg py-2 px-6 hover:opacity-70"
        >
          Format:
        </label>
        <select
          id="format"
          className="capitalize text-black rounded-lg py-2 px-6 hover:opacity-70 focus:outline-none"
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)} // Update selected format
        >
          <option value="json" className="capitalize">
            JSON
          </option>
          <option value="xml" className="capitalize">
            XML
          </option>
          <option value="cli" className="capitalize">
            CLI
          </option>
        </select>
      </div>

      {/* Deploy Button */}
      <button className="capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 duration-200 hover:opacity-70">
        deploy
      </button>
    </div>
  );
}

export default DeployPreview;
