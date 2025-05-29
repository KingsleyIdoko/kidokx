import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';


function NavigationBar({nextPath,onhandleNextBtn,nextPage,}) {
  const { configtype,editingData} = useSelector((state) => state.vpn);
  const navigate = useNavigate();
  const handleListView = () => {
    navigate(`/vpn/site-to-site/list/config/${configtype}/`)
  };

  const handleNextClick = () => {
    onhandleNextBtn();
    navigate(nextPath);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={handleListView}
        className={`capitalize font-semibold bg-sky-400 ${editingData ? "opacity-50 cursor-not-allowed" : ""} text-white rounded-lg py-2 px-6`}
        disabled={editingData}
      >
        ListView
      </button>

      <h2 className="text-lg font-semibold text-center flex-1 capitalize">
        {`Juniper ${configtype} Configuration`}
      </h2>
      {/* Next Button */}
      <button
        onClick={handleNextClick}
        className={`capitalize font-semibold ${
          nextPage ? 'bg-sky-400' : 'bg-gray-400'
        } text-white rounded-lg py-2 px-6`}
      >
        Next
      </button>
    </div>
  );
}

export default NavigationBar;
