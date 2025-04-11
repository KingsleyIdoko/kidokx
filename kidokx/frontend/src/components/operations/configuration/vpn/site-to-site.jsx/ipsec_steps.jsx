import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setConfigType } from "../../../../store/reducers/vpnReducer";

function IpsecSteps() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { configtype, editingData } = useSelector((store) => store.vpn);

  const ipsecSelection = [
    {
      name: "IKE Proposal",
      storename: "ikeproposal",
      path: "/vpn/site-to-site/config/ikeproposal/",
    },
    {
      name: "IKE Policy",
      storename: "ikepolicy",
      path: "/vpn/site-to-site/config/ikepolicy/",
    },
    {
      name: "IKE Gateway",
      storename: "ikegateway",
      path: "/vpn/site-to-site/config/ikegateway/",
    },
    {
      name: "IPsec Proposal",
      storename: "ipsecproposal",
      path: "/vpn/site-to-site/config/ipsecproposal/",
    },
    {
      name: "IPsec Policy",
      storename: "ipsecpolicy",
      path: "/vpn/site-to-site/config/ipsecpolicy/",
    },
    {
      name: "IPsec VPN",
      storename: "ipsecvpn",
      path: "/vpn/site-to-site/config/ipsecvpn/",
    },
  ];

  const handleSelection = () => {
    navigate(`/vpn/site-to-site/config/${configtype}/`);
  };

  useEffect(() => {
    navigate(`/vpn/site-to-site/config/${configtype}/`);
  }, [configtype, navigate]);

  return (
    <div>
      {/* Sidebar with IPsec Options */}
      <div className="w-[16rem] flex flex-col py-6 items-left space-y-6 justify-left bg-white">
        {ipsecSelection.map((ipsec) => {
          const isActive = configtype === ipsec.storename;
          const isDisabled = editingData;

          return (
            <div
              key={ipsec.name}
              className={`border py-2 px-6 text-left rounded-lg cursor-pointer 
            ${isActive ? "bg-sky-400 text-white" : ""}
            ${
              isDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-sky-300 hover:text-white"
            }
          `}
              onClick={() => {
                if (isDisabled) return; // prevent click if disabled
                handleSelection(ipsec.name, ipsec.path, ipsecSelection);
                dispatch(setConfigType(ipsec.storename));
                navigate(ipsec.path);
              }}
            >
              {ipsec.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default IpsecSteps;
