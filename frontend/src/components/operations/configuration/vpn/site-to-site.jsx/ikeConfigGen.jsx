import { useState } from 'react';
import ipsecItems from './ikeProposalItems';

function IpsecConfig() {
  // Store selected options for each category
  const initialSelections = Object.keys(ipsecItems.proposals).reduce(
    (acc, key) => {
      acc[key] = ipsecItems.proposals[key][0]; // Set first value as default
      return acc;
    },
    {}
  );

  const [selectedOptions, setSelectedOptions] = useState(initialSelections);
  return (
    <div className="w-[56rem] mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Heading */}
      <h2 className="text-lg font-semibold text-center mb-6 uppercase">
        SRX Ipsec Proposal Configuration
      </h2>
      <div className="flex mx-auto items-center justify-between">
        {/* Left Side - Buttons */}
        <div className="w-[32rem] flex flex-col space-y-4 items-center justify-center">
          {Object.keys(ipsecItems.proposals).map((category) => (
            <button
              key={category}
              className="w-3/4 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left"
            >
              {category}
            </button>
          ))}
        </div>
        <div className=" w-[24rem] flex flex-col space-y-5 items-center justify-center ">
          {Object.keys(ipsecItems.proposals).map((category) => (
            <select
              key={category}
              className="w-1/2 px-4 py-3 bg-gray-100 text-black border rounded-lg text-left"
              value={selectedOptions[category]}
              onChange={(e) =>
                setSelectedOptions({
                  ...selectedOptions,
                  [category]: e.target.value,
                })
              }
            >
              {ipsecItems.proposals[category].map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>
      <div className="max-w-2xl mt-10 flex items-center justify-between space-x-10 mx-auto">
        <button className="capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 hover:opacity-70">
          preview
        </button>
        <div className=" flex space-x-3 items-center justify-center ">
          <label htmlFor="" className="capitalize p-2 border rounded-lg">
            format:
          </label>
          <select className="border p-2 bg-gray-100 rounded-lg w-32 cursor-pointer">
            <option value="json" className="uppercase ">
              JSON
            </option>
            <option value="xml" className="uppercase">
              XML
            </option>
            <option value="cli" className="uppercase">
              CLI
            </option>
          </select>
        </div>
        <button className="capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 duration-200 hover:opacity-70">
          deploy
        </button>
      </div>
    </div>
  );
}

export default IpsecConfig;
