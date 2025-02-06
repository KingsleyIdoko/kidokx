function Navbar() {
  return (
    <header>
      <div className="flex flex-row items-center justify-between py-10 mx-auto w-full ">
        <div>
          <img
            src="src/components/header/images/kidokoX.jpg"
            alt=""
            className="rounded-lg w-1/2"
          />
        </div>
        <div className="w-full flex flex-row justify-between text-2xl">
          <div className="flex flex-row gap-6">
            <div className=" text-2xl capitalize">Home</div>
            <div className=" capitalize">configuration</div>
            <div className=" capitalize">monitoring</div>
            <div className=" capitalize">alarms</div>
          </div>
          <div>
            <div className="">Register/Sign In</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
