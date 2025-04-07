import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ikeProposalPreview } from './ikeproposalpreview';
import { ikePolicyPreview } from './ikepolicypreview';
import { ikeGatewayPreview } from './ikegatewaypreview';
import { ipsecProposalPreview } from './ipsecproposalpreview';
import { ipsecPolicyPreview } from './ipsecpolicy';
import { ipsecVpnPolicyPreview } from './ipsecvpnpreview';
import { useSelector } from 'react-redux';

function PagePreview({ selectedFormat = 'cli' }) {
  const { ipsecType } = useParams();
  const {
    ikeProposalData,
    ikePolicyData,
    ikeGatewayData,
    ipsecProposalData,
    ipsecPolicyData,
    ipsecVpnData,
  } = useSelector((state) => state.vpn);
  let formats;
  console.log(ipsecProposalData);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [ipsecType]);

  switch (ipsecType) {
    case 'ikeproposal':
      formats = ikeProposalPreview({
        selectedFormat,
        ikeProposalData,
      });
      break;
    case 'ikepolicy':
      formats = ikePolicyPreview({
        selectedFormat,
        ikePolicyData,
      });
      break;
    case 'ikegateway':
      formats = ikeGatewayPreview({
        selectedFormat,
        ikeGatewayData,
      });
      break;
    case 'ipsecproposal':
      formats = ipsecProposalPreview({
        selectedFormat,
        ipsecProposalData,
      });
      break;
    case 'ipsecpolicy':
      formats = ipsecPolicyPreview({
        selectedFormat,
        ipsecPolicyData,
      });
      break;
    case 'ipsecvpn':
      formats = ipsecVpnPolicyPreview({
        selectedFormat,
        ipsecVpnData,
      });
      break;
    default:
      formats = ikeProposalPreview({
        selectedFormat,
        ikeProposalData,
      });
  }

  const formatToDisplay = formats[selectedFormat] || formats['cli'];

  return (
    <div className="max-w-full w-[46rem] h-[22rem] flex items-center justify-center mx-auto bg-black p-3 rounded-lg shadow-lg border border-gray-700">
      <div
        className="w-full h-full flex items-center justify-center bg-gray-800 text-sm text-white font-semibold rounded-lg overflow-auto whitespace-pre-wrap p-3"
        dangerouslySetInnerHTML={{ __html: formatToDisplay }}
      />
    </div>
  );
}

export default PagePreview;
