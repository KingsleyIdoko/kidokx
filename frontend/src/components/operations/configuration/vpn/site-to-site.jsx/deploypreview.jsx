import { useState } from 'react';

function DeployPreview({
  onPreviewBtn,
  onSelectedFormat,
  setSelectedFormat,
  onPreview,
}) {
  return (
    <div className="flex items-center justify-between">
      {/* Preview Button */}
      <button
        className={`capitalize font-semibold mr-20 text-white ${
          onPreview ? 'bg-sky-400 opacity-50' : 'bg-sky-400'
        } rounded-lg py-2 px-6 hover:opacity-70`}
        onClick={onPreviewBtn}
      >
        Preview
      </button>
      <div className="w-full flex justify-between">
        <div className="w-full flex items-center justify-center ">
          <div
            className={`flex space-x-3 items-center justify-center ${
              onPreview ? '' : 'hidden'
            }`}
          >
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
              <option value="cli" className="capitalize">
                CLI
              </option>
              <option value="xml" className="capitalize">
                XML
              </option>
              <option value="json" className="capitalize">
                JSON
              </option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between gap-5 ">
          {' '}
          <button className="w-full capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 duration-200 hover:opacity-70">
            save
          </button>
          {/* Deploy Button */}
          <button className="capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 duration-200 hover:opacity-70">
            deploy
          </button>
        </div>
      </div>
    </div>
  );
}
export default DeployPreview;
