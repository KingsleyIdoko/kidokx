function NavigationBar() {
  return (
    <div className="flex items-center mb-4">
      {/* Previous Button wrapped with Link for routing */}

      <Link
        to="/vpn/site-to-site/config/ikeproposal"
        className="capitalize font-semibold text-white bg-gray-400 rounded-lg py-2 px-6"
      >
        Previous
      </Link>

      <h2 className="text-lg font-semibold text-center flex-1 capitalize">
        Juniper IKE Proposal Configuration
      </h2>

      {/* Next Button wrapped with Link for routing */}
      <Link
        to="/vpn/site-to-site/config/ikepolicy"
        className="capitalize font-semibold text-white bg-sky-400 rounded-lg py-2 px-6 hover:opacity-70"
      >
        Next
      </Link>
    </div>
  );
}
