import React, { useState } from 'react';
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronsRight,
  ChevronRight,
  Search,
  EllipsisVertical,
  SortDesc,
} from 'lucide-react';

const initialAvailable = [
  { text: 'Item1', selected: false, isVisible: true },
  { text: 'Item2', selected: false, isVisible: true },
  { text: 'Item3', selected: false, isVisible: true },
  { text: 'Item4', selected: false, isVisible: true },
  { text: 'Item5', selected: false, isVisible: true },
];

export default function DualListSelector() {
  const [available, setAvailable] = useState(initialAvailable);
  const [chosen, setChosen] = useState([]);
  const [filterAvailable, setFilterAvailable] = useState('');
  const [filterChosen, setFilterChosen] = useState('');

  const selectOption = (index, isChosen) => {
    const arr = isChosen ? [...chosen] : [...available];
    arr[index].selected = !arr[index].selected;
    isChosen ? setChosen(arr) : setAvailable(arr);
  };

  const moveSelected = (fromAvailable) => {
    if (fromAvailable) {
      const toMove = available
        .filter((o) => o.selected && o.isVisible)
        .map((o) => ({ ...o, selected: false }));
      setAvailable(available.filter((o) => !o.selected || !o.isVisible));
      setChosen([...chosen, ...toMove]);
    } else {
      const toMove = chosen
        .filter((o) => o.selected && o.isVisible)
        .map((o) => ({ ...o, selected: false }));
      setChosen(chosen.filter((o) => !o.selected || !o.isVisible));
      setAvailable([...available, ...toMove]);
    }
  };

  const moveAll = (fromAvailable) => {
    if (fromAvailable) {
      const toMove = available.filter((o) => o.isVisible).map((o) => ({ ...o, selected: false }));
      setAvailable(available.filter((o) => !o.isVisible));
      setChosen([...chosen, ...toMove]);
    } else {
      const toMove = chosen.filter((o) => o.isVisible).map((o) => ({ ...o, selected: false }));
      setChosen(chosen.filter((o) => !o.isVisible));
      setAvailable([...available, ...toMove]);
    }
  };

  const handleFilter = (val, isChosen) => {
    if (isChosen) {
      setFilterChosen(val);
      setChosen(
        chosen.map((o) => ({ ...o, isVisible: o.text.toLowerCase().includes(val.toLowerCase()) }))
      );
    } else {
      setFilterAvailable(val);
      setAvailable(
        available.map((o) => ({
          ...o,
          isVisible: o.text.toLowerCase().includes(val.toLowerCase()),
        }))
      );
    }
  };

  return (
    <div className="flex bg-white rounded-2xl shadow-md w-fit mx-auto mt-10">
      <div className="flex flex-col w-64 p-4">
        <div className="font-semibold mb-2">Available options</div>
        <div className="flex items-center mb-2">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2 text-gray-400" size={18} />
            <input
              className="pl-8 pr-2 py-1 rounded border w-full text-sm focus:outline-none"
              value={filterAvailable}
              onChange={(e) => handleFilter(e.target.value, false)}
              placeholder="Search"
            />
          </div>
          <button className="ml-1 p-1 text-gray-500 hover:bg-gray-100 rounded">
            <SortDesc size={16} />
          </button>
          <button className="ml-1 p-1 text-gray-500 hover:bg-gray-100 rounded">
            <EllipsisVertical size={16} />
          </button>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          {available.filter((o) => o.selected && o.isVisible).length} of{' '}
          {available.filter((o) => o.isVisible).length} items selected
        </div>
        <ul className="border rounded  min-h-[120px] max-h-52 overflow-auto divide-y">
          {available.map(
            (o, i) =>
              o.isVisible && (
                <li
                  key={i}
                  onClick={() => selectOption(i, false)}
                  className={`px-3 py-2 cursor-pointer ${
                    o.selected ? ' font-bold' : 'hover:bg-blue-50'
                  }`}
                >
                  {o.text}
                </li>
              )
          )}
        </ul>
      </div>
      <div className="flex flex-col justify-center items-center gap-2 px-2">
        <button
          className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 disabled:opacity-30"
          disabled={!available.some((o) => o.selected)}
          onClick={() => moveSelected(true)}
        >
          <ChevronRight size={20} />
        </button>
        <button
          className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 disabled:opacity-30"
          disabled={!available.some((o) => o.isVisible)}
          onClick={() => moveAll(true)}
        >
          <ChevronsRight size={20} />
        </button>
        <button
          className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 disabled:opacity-30"
          disabled={!chosen.some((o) => o.isVisible)}
          onClick={() => moveAll(false)}
        >
          <ChevronsLeft size={20} />
        </button>
        <button
          className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 disabled:opacity-30"
          disabled={!chosen.some((o) => o.selected)}
          onClick={() => moveSelected(false)}
        >
          <ChevronLeft size={20} />
        </button>
      </div>
      <div className="flex flex-col w-64 p-4">
        <div className="font-semibold mb-2">Chosen options</div>
        <div className="flex items-center mb-2">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2 text-gray-400" size={18} />
            <input
              className="pl-8 pr-2 py-1 rounded border w-full text-sm focus:outline-none"
              value={filterChosen}
              onChange={(e) => handleFilter(e.target.value, true)}
              placeholder="Search"
            />
          </div>
          <button className="ml-1 p-1 text-gray-500 hover:bg-gray-100 rounded">
            <SortDesc size={16} />
          </button>
          <button className="ml-1 p-1 text-gray-500 hover:bg-gray-100 rounded">
            <EllipsisVertical size={16} />
          </button>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          {chosen.filter((o) => o.selected && o.isVisible).length} of{' '}
          {chosen.filter((o) => o.isVisible).length} items selected
        </div>
        <ul className="border rounded-lg bg-gray-50 min-h-[120px] max-h-52 overflow-auto divide-y">
          {chosen.map(
            (o, i) =>
              o.isVisible && (
                <li
                  key={i}
                  onClick={() => selectOption(i, true)}
                  className={`px-3 py-2 cursor-pointer ${
                    o.selected ? 'bg-blue-100 font-bold' : 'hover:bg-blue-50'
                  }`}
                >
                  {o.text}
                </li>
              )
          )}
        </ul>
      </div>
    </div>
  );
}
