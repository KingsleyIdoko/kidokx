import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import RaVPN from './ra-vpn/ra-vpn';
import IPsecListgroup from './site-to-site.jsx/ipsec_listgroup';
import IkeProposalConfig from './site-to-site.jsx/ikeProposalGen';
import IkePolicyConfig from './site-to-site.jsx/ikePolicyGen';
import IkeGatewayConfig from './site-to-site.jsx/ikeGatewayGen';
import IPsecProposalConfig from './site-to-site.jsx/ipsecProposalGen';
import IPsecPolicyConfig from './site-to-site.jsx/ipsecPolicyGen';
import IPsecVPNConfig from './site-to-site.jsx/ipsecVpnGen';
import NavigationBar from './site-to-site.jsx/navigation';
import DeployPreview from './site-to-site.jsx/deploypreview';
import IpsecSteps from './site-to-site.jsx/ipsec_steps';
import PagePreview from './site-to-site.jsx/previewpage/pagepreview';

function VPN() {
  const navigate = useNavigate();
  const location = useLocation();
  const [webPage, setWebPage] = useState('IKE Proposal');
  const [nextPage, setNextPage] = useState(true);
  const [prevPage, setPrevPage] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('CLI');
  const [ipsecPath, setIpsecPath] = useState('');
  const [clickedPreview, setClickedPreview] = useState(false);

  // IPsec navigation steps
  const ipsecSelection = [
    { name: 'IKE Proposal', path: '/vpn/site-to-site/config/ikeproposal' },
    { name: 'IKE Policy', path: '/vpn/site-to-site/config/ikepolicy' },
    { name: 'IKE Gateway', path: '/vpn/site-to-site/config/ikegateway' },
    { name: 'IPsec Proposal', path: '/vpn/site-to-site/config/ipsecproposal' },
    { name: 'IPsec Policy', path: '/vpn/site-to-site/config/ipsecpolicy' },
    { name: 'IPsec VPN', path: '/vpn/site-to-site/config/ipsecvpn' },
  ];
  useEffect(() => {
    const currentPath = location.pathname;
    const currentIndex = ipsecSelection.findIndex(
      (item) => item.path === currentPath,
    );

    if (currentIndex !== -1) {
      setWebPage(ipsecSelection[currentIndex].name);
      setNextPage(currentIndex < ipsecSelection.length - 1);
      setPrevPage(currentIndex > 0);
    }
  }, [location, ipsecSelection]);

  const handlePreviewBtn = () => {
    const currentPath = location.pathname.split('/').pop();
    if (!clickedPreview) {
      navigate(`/vpn/site-to-site/config/preview/${currentPath}`);
    } else {
      navigate(`/vpn/site-to-site/config/${currentPath}`);
    }
    setClickedPreview((prev) => !prev);
  };

  const handleSelection = (ipsecName, ipsecPath, ipsecSelection) => {
    const selected = ipsecSelection.find((item) => item.name === ipsecName);
    if (selected?.path) {
      setIpsecPath(ipsecPath);
      navigate(selected.path);
      setClickedPreview(false);
    }
  };

  function handleNextBtn() {
    setTimeout(() => {
      const currentIndex = ipsecSelection.findIndex(
        (item) => item.path === location.pathname,
      );

      if (currentIndex !== -1 && currentIndex < ipsecSelection.length - 1) {
        const nextPath = ipsecSelection[currentIndex + 1].path;
        navigate(nextPath);
      }
    }, 50);
  }

  function handlePreviousBtn() {
    setTimeout(() => {
      const currentIndex = ipsecSelection.findIndex(
        (item) => item.path === location.pathname,
      );
      if (currentIndex > 0) {
        const prevPath = ipsecSelection[currentIndex - 1].path;
        navigate(prevPath);
      }
    }, 50);
  }

  return (
    <>
      <div className="min-h-screen bg-sky-100 flex justify-center mx-auto py-12 rounded-xl">
        {/* Main container for the VPN configuration steps */}
        <div className="w-[68rem] h-[38rem] flex flex-col bg-white space-y-6 shadow-xl items-center relative">
          {/* Navigation Bar */}
          <div className="w-[64rem] pt-6">
            <NavigationBar
              urlPath={location.pathname}
              onhandleNextBtn={handleNextBtn}
              onhandlePreviousBtn={handlePreviousBtn}
              nextPage={nextPage}
              prevPage={prevPage}
              pageTitle={webPage}
            />
          </div>
          {/* IPsec Steps Sidebar */}
          <div className="w-[64rem] h-[26rem] flex items-center justify-between bg-white p-3 gap-3">
            <div>
              <IpsecSteps
                webpage={webPage}
                onhandleSelection={handleSelection}
                ipsecPath={ipsecPath}
              />
            </div>

            {/* Routes for Site-to-Site and Remote Access VPN */}
            <div className="w-[50rem] rounded-lg">
              <Routes>
                <Route path="/site-to-site" element={<IPsecListgroup />} />
                <Route
                  path="/site-to-site/config/ikeproposal"
                  element={<IkeProposalConfig />}
                />
                <Route
                  path="/site-to-site/config/preview/:ipsecType"
                  element={
                    <PagePreview
                      selectedFormat={selectedFormat}
                      ipsecPath={ipsecPath}
                    />
                  }
                />
                <Route
                  path="/site-to-site/config/ikepolicy"
                  element={<IkePolicyConfig />}
                />
                <Route
                  path="/site-to-site/config/ikegateway"
                  element={<IkeGatewayConfig />}
                />
                <Route
                  path="/site-to-site/config/ipsecproposal"
                  element={<IPsecProposalConfig />}
                />
                <Route
                  path="/site-to-site/config/ipsecpolicy"
                  element={<IPsecPolicyConfig />}
                />
                <Route
                  path="/site-to-site/config/ipsecvpn"
                  element={<IPsecVPNConfig />}
                />
                <Route path="/remote-access" element={<RaVPN />} />
              </Routes>
            </div>
          </div>
          <div className="w-[64rem] pb-10">
            <DeployPreview
              onPreviewBtn={handlePreviewBtn}
              onSelectedFormat={selectedFormat}
              setSelectedFormat={setSelectedFormat}
              onPreview={clickedPreview}
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default VPN;
