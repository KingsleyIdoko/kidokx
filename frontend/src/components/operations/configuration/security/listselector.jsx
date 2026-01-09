import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  EllipsisVertical,
  Search,
  SortDesc,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const norm = (v) => String(v ?? '').trim();

const uniq = (arr) => {
  const seen = new Set();
  const out = [];
  for (const x of arr) {
    const t = norm(x);
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
};

export default function DualListSelector({ items = [], value = [], onChange }) {
  /**
   * Key behavior:
   * - We hydrate the UI (available/chosen lists) from props.
   * - We DO NOT call onChange from useEffect (prevents RHF infinite loops).
   * - We call onChange only on explicit user actions (move buttons).
   * - We keep "selected" and "isVisible" as UI-only state.
   */

  const [available, setAvailable] = useState([]);
  const [chosen, setChosen] = useState([]);
  const [filterAvailable, setFilterAvailable] = useState('');
  const [filterChosen, setFilterChosen] = useState('');

  // Build stable signatures so hydration doesn't run just because array references changed.
  const itemsList = useMemo(() => uniq(items), [items]);
  const valueList = useMemo(() => uniq(value), [value]);

  const itemsKey = useMemo(() => itemsList.join('|'), [itemsList]);
  const valueKey = useMemo(() => valueList.slice().sort().join('|'), [valueList]);

  // ✅ Hydrate UI from items + value (no onChange here)
  useEffect(() => {
    const valueSet = new Set(valueList);

    const makeObj = (text) => ({
      text,
      selected: false,
      isVisible: true,
    });

    const nextChosen = itemsList.filter((t) => valueSet.has(t)).map(makeObj);
    const nextAvailable = itemsList.filter((t) => !valueSet.has(t)).map(makeObj);

    setChosen(nextChosen);
    setAvailable(nextAvailable);

    // Reset filters so user sees prefills immediately
    setFilterAvailable('');
    setFilterChosen('');
  }, [itemsKey, valueKey]); // <-- stable deps, avoids update-depth loops

  const selectOption = (index, isChosen) => {
    if (isChosen) {
      setChosen((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], selected: !next[index].selected };
        return next;
      });
    } else {
      setAvailable((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], selected: !next[index].selected };
        return next;
      });
    }
  };

  const emitChosen = (nextChosen) => {
    // send strings back to RHF
    onChange?.(nextChosen.map((x) => x.text));
  };

  const moveSelected = (fromAvailable) => {
    if (fromAvailable) {
      const toMove = available
        .filter((o) => o.selected && o.isVisible)
        .map((o) => ({ ...o, selected: false }));

      if (!toMove.length) return;

      const nextAvailable = available.filter((o) => !o.selected || !o.isVisible);

      // Deduplicate by text
      const existing = new Set(chosen.map((x) => x.text));
      const filtered = toMove.filter((x) => !existing.has(x.text));

      const nextChosen = [...chosen, ...filtered];

      setAvailable(nextAvailable);
      setChosen(nextChosen);
      emitChosen(nextChosen);
    } else {
      const toMove = chosen
        .filter((o) => o.selected && o.isVisible)
        .map((o) => ({ ...o, selected: false }));

      if (!toMove.length) return;

      const nextChosen = chosen.filter((o) => !o.selected || !o.isVisible);

      const existing = new Set(available.map((x) => x.text));
      const filtered = toMove.filter((x) => !existing.has(x.text));

      const nextAvailable = [...available, ...filtered];

      setChosen(nextChosen);
      setAvailable(nextAvailable);
      emitChosen(nextChosen);
    }
  };

  const moveAll = (fromAvailable) => {
    if (fromAvailable) {
      const toMove = available.filter((o) => o.isVisible).map((o) => ({ ...o, selected: false }));
      if (!toMove.length) return;

      const remaining = available.filter((o) => !o.isVisible);

      const existing = new Set(chosen.map((x) => x.text));
      const filtered = toMove.filter((x) => !existing.has(x.text));

      const nextChosen = [...chosen, ...filtered];

      setAvailable(remaining);
      setChosen(nextChosen);
      emitChosen(nextChosen);
    } else {
      const toMove = chosen.filter((o) => o.isVisible).map((o) => ({ ...o, selected: false }));
      if (!toMove.length) return;

      const remaining = chosen.filter((o) => !o.isVisible);

      const existing = new Set(available.map((x) => x.text));
      const filtered = toMove.filter((x) => !existing.has(x.text));

      const nextAvailable = [...available, ...filtered];

      setChosen(remaining);
      setAvailable(nextAvailable);
      emitChosen(remaining);
    }
  };

  const handleFilter = (val, isChosenList) => {
    if (isChosenList) {
      setFilterChosen(val);
      setChosen((prev) =>
        prev.map((o) => ({
          ...o,
          isVisible: o.text.toLowerCase().includes(val.toLowerCase()),
        })),
      );
    } else {
      setFilterAvailable(val);
      setAvailable((prev) =>
        prev.map((o) => ({
          ...o,
          isVisible: o.text.toLowerCase().includes(val.toLowerCase()),
        })),
      );
    }
  };

  return (
    <div className="w-[32rem] flex bg-white rounded-2xl shadow-md">
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

          <button type="button" className="ml-1 p-1 text-gray-500 hover:bg-gray-100 rounded">
            <SortDesc size={16} />
          </button>
          <button type="button" className="ml-1 p-1 text-gray-500 hover:bg-gray-100 rounded">
            <EllipsisVertical size={16} />
          </button>
        </div>

        <ul className="border rounded min-h-[120px] max-h-52 overflow-auto divide-y">
          {available.map(
            (o, i) =>
              o.isVisible && (
                <li
                  key={`${o.text}-${i}`} // avoids duplicate key warnings
                  onClick={() => selectOption(i, false)}
                  className={`px-3 py-2 cursor-pointer ${
                    o.selected ? 'font-bold' : 'hover:bg-blue-50'
                  }`}
                >
                  {o.text}
                </li>
              ),
          )}
        </ul>
      </div>

      <div className="flex flex-col justify-center items-center gap-2 px-2">
        <button
          type="button"
          className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 disabled:opacity-30"
          disabled={!available.some((o) => o.selected)}
          onClick={() => moveSelected(true)}
        >
          <ChevronRight size={20} />
        </button>

        <button
          type="button"
          className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 disabled:opacity-30"
          disabled={!available.some((o) => o.isVisible)}
          onClick={() => moveAll(true)}
        >
          <ChevronsRight size={20} />
        </button>

        <button
          type="button"
          className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 disabled:opacity-30"
          disabled={!chosen.some((o) => o.isVisible)}
          onClick={() => moveAll(false)}
        >
          <ChevronsLeft size={20} />
        </button>

        <button
          type="button"
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

          <button type="button" className="ml-1 p-1 text-gray-500 hover:bg-gray-100 rounded">
            <SortDesc size={16} />
          </button>
          <button type="button" className="ml-1 p-1 text-gray-500 hover:bg-gray-100 rounded">
            <EllipsisVertical size={16} />
          </button>
        </div>

        <ul className="border rounded-lg bg-gray-50 min-h-[120px] max-h-52 overflow-auto divide-y">
          {chosen.map(
            (o, i) =>
              o.isVisible && (
                <li
                  key={`${o.text}-${i}`}
                  onClick={() => selectOption(i, true)}
                  className={`px-3 py-2 cursor-pointer ${
                    o.selected ? 'bg-blue-100 font-bold' : 'hover:bg-blue-50'
                  }`}
                >
                  {o.text}
                </li>
              ),
          )}
        </ul>
      </div>
    </div>
  );
}
