import { useNavigate } from 'react-router-dom';

function NavigationBar({
  previousPath,
  nextPath,
  onhandleNextBtn,
  onhandlePreviousBtn,
  nextPage,
  prevPage,
  pageTitle,
}) {
  const navigate = useNavigate();

  const handlePreviousClick = () => {
    onhandlePreviousBtn();
    navigate(previousPath);
  };

  const handleNextClick = () => {
    onhandleNextBtn();
    navigate(nextPath);
  };

  console.log(nextPage);

  return (
    <div className="flex items-center justify-between mb-4">
      {/* Previous Button */}
      <button
        onClick={handlePreviousClick}
        className={`capitalize font-semibold ${
          prevPage ? 'bg-sky-400' : 'bg-gray-400'
        } text-white rounded-lg py-2 px-6`}
      >
        Previous
      </button>

      <h2 className="text-lg font-semibold text-center flex-1 capitalize">
        {`Juniper ${pageTitle} Configuration`}
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
