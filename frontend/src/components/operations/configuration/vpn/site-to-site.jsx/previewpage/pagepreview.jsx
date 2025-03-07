import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ikeProposalPreview } from './ikeproposalpreview';
import { ikePolicyPreview } from './ikepolicypreview';
import { ikeGatewayPreview } from './ikegatewaypreview';
import { ipsecProposalPreview } from './ipsecproposalpreview';
import { ipsecPolicyPreview } from './ipsecpolicy';
import { ipsecVpnPreview } from './ipsecvpnpreview';

function PagePreview({
  selectedFormat = 'cli',
  proposal_name,
  group,
  auth_mth,
  auth_algo,
  encrypt_algo,
  lifetime,
}) {
  const { ipsecType } = useParams();

  let formats;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [ipsecType]);

  switch (ipsecType) {
    case 'ikeproposal':
      formats = ikeProposalPreview({
        selectedFormat,
        proposal_name,
        group,
        auth_mth,
        auth_algo,
        encrypt_algo,
        lifetime,
      });
      break;
    case 'ikepolicy':
      formats = ikePolicyPreview({
        selectedFormat,
        proposal_name,
        group,
        auth_mth,
        auth_algo,
        encrypt_algo,
        lifetime,
      });
      break;
    case 'ikegateway':
      formats = ikeGatewayPreview({
        selectedFormat,
        proposal_name,
        group,
        auth_mth,
        auth_algo,
        encrypt_algo,
        lifetime,
      });
      break;
    case 'ipsecproposal':
      formats = ipsecProposalPreview({
        selectedFormat,
        proposal_name,
        group,
        auth_mth,
        auth_algo,
        encrypt_algo,
        lifetime,
      });
      break;
    case 'ipsecpolicy':
      formats = ipsecPolicyPreview({
        selectedFormat,
        proposal_name,
        group,
        auth_mth,
        auth_algo,
        encrypt_algo,
        lifetime,
      });
      break;
    case 'ipsecvpn':
      formats = ipsecVpnPreview({
        selectedFormat,
        proposal_name,
        group,
        auth_mth,
        auth_algo,
        encrypt_algo,
        lifetime,
      });
      break;
    default:
      formats = ikeProposalPreview({
        selectedFormat,
        proposal_name,
        group,
        auth_mth,
        auth_algo,
        encrypt_algo,
        lifetime,
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
