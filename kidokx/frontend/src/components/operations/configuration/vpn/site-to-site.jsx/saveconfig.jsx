import { useDispatch, useSelector } from "react-redux";
import {
  setEditing,
  setSaveConfiguration,
} from "../../../../store/reducers/vpnReducer";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";

export default function SaveConfig({
  onPreviewBtn,
  onSelectedFormat,
  setSelectedFormat,
  onPreview,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { validatedData, editingData } = useSelector((state) => state.vpn);
  const { isSelectedDevice } = useSelector((state) => state.inventories);

  const pathSegments = useMemo(
    () => location.pathname.split("/").filter(Boolean),
    [location]
  );
  const currentPath = pathSegments[pathSegments.length - 1];

  const handleSaveBtn = () => {
    dispatch(setSaveConfiguration(true));
    setTimeout(() => {
      dispatch(setSaveConfiguration(false));
    }, 2000);
  };

  useEffect(() => {
    if (validatedData && isSelectedDevice && !editingData) {
      navigate(`/vpn/site-to-site/list/config/${currentPath}`);
    }
  }, [validatedData, isSelectedDevice, currentPath, navigate, editingData]);

  return (
    <div className="flex items-center justify-between">
      <button
        className={`capitalize font-semibold mr-20 text-white ${
          onPreview ? "bg-sky-400 opacity-50" : "bg-sky-400"
        } rounded-lg py-2 px-6 hover:opacity-70`}
        onClick={onPreviewBtn}
      >
        Preview
      </button>
      <div className="w-full flex justify-between">
        <div className="w-full flex items-center justify-center">
          <div
            className={`flex space-x-3 items-center justify-center ${
              onPreview ? "" : "hidden"
            }`}
          >
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
              <option value="cli">CLI</option>
              <option value="xml">XML</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between gap-5">
          <button
            type="button"
            className="w-full capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 duration-200 hover:opacity-70"
            onClick={handleSaveBtn}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
