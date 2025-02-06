function Navbar() {
  return (
    <header>
      <div className="flex flex-row items-center justify-between py-10 mx-auto w-full bg-sky-400 p-6">
        <div>
          <img
            src="src/components/header/images/kidokoX.jpg"
            alt=""
            className="rounded-lg w-1/2"
          />
        </div>
        <div className="w-full flex flex-row justify-between text-2xl text-white">
          <div className="flex flex-row gap-6">
            <div className=" text-2xl capitalize">Home</div>
            <div className="relative  flex items-center capitalize gap-2 group">
              <div> configuration</div>
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
            <div className=" capitalize">monitoring</div>
            <div className=" capitalize">alarms</div>
          </div>
          <div>
            <div className="">Sign In</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
