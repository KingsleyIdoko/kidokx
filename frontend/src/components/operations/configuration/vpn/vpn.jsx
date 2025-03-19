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
import DeployPreview from './site-to-site.jsx/deploypreview';
import IpsecSteps from './site-to-site.jsx/ipsec_steps';
import PagePreview from './site-to-site.jsx/previewpage/pagepreview';
import { SearchDevice } from '../../../inventory/searchdevice';
import { useSelector, useDispatch } from 'react-redux';
import { APIDATA } from './vpnActions.jsx/actionTypes';

function VPN() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [webPage, setWebPage] = useState('IKE Proposal');
  const [nextPage, setNextPage] = useState(true);
  const [prevPage, setPrevPage] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('CLI');
  const [ipsecPath, setIpsecPath] = useState('');
  const [clickedPreview, setClickedPreview] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('');
  const { apiData } = useSelector((state) => state.vpn);

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

  function onConfigChange(api_data) {
    const updated_apiData = {
      ...api_data,
      device: selectedDevice,
    };
    dispatch({ type: APIDATA, payload: updated_apiData });
  }

  const handleSelection = (ipsecName, ipsecPath, ipsecSelection) => {
    const currentPath = location.pathname.split('/').pop();
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
        <div className="w-[68rem] h-[48rem] flex flex-col bg-white space-y-6 shadow-xl items-center relative rounded-xl">
          <div className="w-[64rem] pt-6">
            <SearchDevice
              setSelectedDevice={setSelectedDevice}
              selectedDevice={selectedDevice}
            />
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
              <IpsecSteps
                webpage={webPage}
                onhandleSelection={handleSelection}
                ipsecPath={ipsecPath}
              />
            </div>

            {/* Routes for Site-to-Site and Remote Access VPN */}
            <div className="w-[50rem] rounded-lg">
              <Routes>
                <Route
                  path="/ikeproposal"
                  element={
                    <IkeProposalConfig onConfigChange={onConfigChange} />
                  }
                />
                <Route
                  path="/preview/:ipsecType"
                  element={
                    <PagePreview
                      selectedFormat={selectedFormat}
                      ipsecPath={ipsecPath}
                      apiData={apiData}
                    />
                  }
                />
                <Route path="/ikepolicy" element={<IkePolicyConfig />} />
                <Route path="/ikegateway" element={<IkeGatewayConfig />} />
                <Route
                  path="/ipsecproposal"
                  element={<IPsecProposalConfig />}
                />
                <Route path="/ipsecpolicy" element={<IPsecPolicyConfig />} />
                <Route path="/ipsecvpn" element={<IPsecVPNConfig />} />
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
