function Navbar() {
  return (
    <header>
      <div className="flex items-center justify-between mx-auto w-full bg-sky-400 p-3">
        <div className="11/10">
          <img
            src="src/components/header/images/kidokoX.jpg"
            alt=""
            className="rounded-lg w-1/2"
          />
        </div>
        <div className="w-full flex flex-row items-center justify-between  text-white">
          <div className="flex flex-row gap-4  items-center justify-between">
            <div className="relative  flex items-center capitalize gap-2 hover:text-black rounded-lg hover:bg-white border-2 border-sky-400 duration-200 py-2 px-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              <div className=" text-lg capitalize">Home</div>
            </div>

            <div className="relative  flex items-center capitalize gap-2 hover:text-black rounded-lg hover:bg-white border-2 border-sky-400 py-2 px-6">
              <div className="text-lg">inventory</div>
              <svg
                className="fill-current h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
            <div className="relative  flex items-center capitalize gap-2 hover:text-black rounded-lg hover:bg-white border-2 border-sky-400 py-2 px-6">
              <div className="text-lg">operations</div>
              <svg
                className="fill-current h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
            <div className="relative  flex items-center capitalize gap-2 hover:text-black rounded-lg hover:bg-white border-2 border-sky-400 py-2 px-6">
              <div className="text-lg">design</div>
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
            <div className="relative  flex items-center capitalize gap-2 hover:text-black rounded-lg hover:bg-white border-2 border-sky-400 py-2 px-6">
              <div className="text-lg">monitoring</div>
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
            <div className="relative  flex items-center capitalize gap-2 hover:text-black rounded-lg hover:bg-white border-2 border-sky-400 py-2 px-6">
              <div className="text-lg">alarms</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                />
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center text-lg">
              Sign In
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
