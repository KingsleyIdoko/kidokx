import { useState } from 'react';

function DeployPreview({ onPreviewBtn, onSelectedFormat, setSelectedFormat }) {
  return (
    <div className="flex items-center justify-between">
      {/* Preview Button */}
      <button
        className="capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 hover:opacity-70"
        onClick={onPreviewBtn}
      >
        Preview
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
          value={onSelectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
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
