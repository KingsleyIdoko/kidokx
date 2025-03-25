import { useDispatch, useSelector } from 'react-redux';
import { VALIDATEIKEPROPOSAL } from '../vpnActions.jsx/actionTypes';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function DeployPreview({
  onPreviewBtn,
  onSelectedFormat,
  setSelectedFormat,
  onPreview,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { validatedData } = useSelector((state) => state.inventories);

  const handleSaveClick = () => {
    dispatch({ type: VALIDATEIKEPROPOSAL, payload: true });
  };

  const handleDeployClick = () => {
    dispatch({ type: VALIDATEIKEPROPOSAL, payload: true });
  };

  useEffect(() => {
    if (validatedData && validatedData.valid) {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      const currentPath = pathSegments[pathSegments.length - 1];
      if (currentPath) navigate(`/vpn/site-to-site/list/config/${currentPath}`);
    } else if (validatedData && validatedData.valid === false) {
      console.log('Validation failed. Fix errors before proceeding.');
    }
  }, [validatedData, navigate, location]);

  return (
    <div className="flex items-center justify-between">
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
          <button
            type="button"
            className="w-full capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 duration-200 hover:opacity-70"
            onClick={handleSaveClick}
          >
            Save
          </button>
          <button
            type="button"
            className="capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 duration-200 hover:opacity-70"
            onClick={handleDeployClick}
          >
            Deploy
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeployPreview;
