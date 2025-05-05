import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import RaVPN from './ra-vpn/ra-vpn';
import IkeProposalConfig from './site-to-site.jsx/ikeProposalGen';
import IkePolicyConfig from './site-to-site.jsx/ikePolicyGen';
import IkeGatewayConfig from './site-to-site.jsx/ikeGatewayGen';
import IPsecProposalConfig from './site-to-site.jsx/ipsecProposalGen';
import IPsecPolicyConfig from './site-to-site.jsx/ipsecPolicyGen';
import IPsecVPNConfig from './site-to-site.jsx/ipsecVpnGen';
import NavigationBar from './site-to-site.jsx/navigation';
import SaveConfig from './site-to-site.jsx/saveconfig';
import IpsecSteps from './site-to-site.jsx/ipsec_steps';
import PagePreview from './site-to-site.jsx/previewpage/pagepreview';
import SearchDevice from '../../../inventory/searchdevice';

function VPN() {
  const navigate = useNavigate();
  const location = useLocation();
  const [webPage, setWebPage] = useState('IKE Proposal');
  const [nextPage, setNextPage] = useState(true);
  const [prevPage, setPrevPage] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('CLI');
  const [clickedPreview, setClickedPreview] = useState(false);

  // IPsec navigation steps
  const ipsecSelection = () => {
    const isPreview = location.pathname.includes('/preview/');
    const basePath = `/vpn/site-to-site/${isPreview ? 'preview' : 'config'}`;
    return [
      { name: 'IKE Proposal', path: `${basePath}/ikeproposal` },
      { name: 'IKE Policy', path: `${basePath}/ikepolicy` },
      { name: 'IKE Gateway', path: `${basePath}/ikegateway` },
      { name: 'IPsec Proposal', path: `${basePath}/ipsecproposal` },
      { name: 'IPsec Policy', path: `${basePath}/ipsecpolicy` },
      { name: 'IPsec VPN', path: `${basePath}/ipsecvpn` },
    ];
  };

  const handlePreviewBtn = () => {
    const currentPath = location.pathname.split('/').pop();
    const isCurrentlyPreview = location.pathname.includes('/preview/');
    const nextBasePath = isCurrentlyPreview
      ? '/vpn/site-to-site/config'
      : '/vpn/site-to-site/config/preview';

    navigate(`${nextBasePath}/${currentPath}`);

    setClickedPreview((prev) => !prev);
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const selection = ipsecSelection();

    const currentIndex = selection.findIndex(
      (item) => item.path === currentPath,
    );

    if (currentIndex !== -1) {
      setWebPage(selection[currentIndex].name);
      setNextPage(currentIndex < selection.length - 1);
      setPrevPage(currentIndex > 0);
    }
  }, [location]);

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
        <div className="w-[80rem] h-[48rem] flex flex-col bg-white space-y-6 shadow-xl items-center relative rounded-xl">
          <div className="w-[64rem] pt-6">
            <SearchDevice />
          </div>
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
              <IpsecSteps webpage={webPage} />
            </div>

            {/* Routes for Site-to-Site and Remote Access VPN */}
            <div className="w-[50rem] rounded-lg">
              <Routes>
                <Route
                  path="/preview/:ipsecType"
                  element={<PagePreview selectedFormat={selectedFormat} />}
                />

                <Route
                  path="/ikeproposal/edit/:id/"
                  element={<IkeProposalConfig />}
                />
                <Route
                  path="/ikepolicy/edit/:id/"
                  element={<IkePolicyConfig />}
                />
                <Route
                  path="/ikegateway/edit/:id/"
                  element={<IkeGatewayConfig />}
                />
                <Route
                  path="/ipsecpolicy/edit/:id/"
                  element={<IPsecPolicyConfig />}
                />
                <Route
                  path="/ipsecvpn/edit/:id/"
                  element={<IPsecVPNConfig />}
                />
                <Route path="/remote-access/edit/:id/" element={<RaVPN />} />

                <Route path="/ikeproposal/" element={<IkeProposalConfig />} />
                <Route path="/ikepolicy/" element={<IkePolicyConfig />} />
                <Route path="/ikegateway/" element={<IkeGatewayConfig />} />
                <Route path="/ipsecpolicy/" element={<IPsecPolicyConfig />} />
                <Route path="/ipsecvpn/" element={<IPsecVPNConfig />} />
                <Route path="/remote-access/" element={<RaVPN />} />
                <Route
                  path="/ipsecproposal"
                  element={<IPsecProposalConfig />}
                />
              </Routes>
            </div>
          </div>
          <div className="w-[64rem] pb-10">
            <SaveConfig
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
