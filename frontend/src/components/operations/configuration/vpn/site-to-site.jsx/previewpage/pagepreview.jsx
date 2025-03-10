import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ikeProposalPreview } from './ikeproposalpreview';
import { ikePolicyPreview } from './ikepolicypreview';
import { ikeGatewayPreview } from './ikegatewaypreview';
import { ipsecProposalPreview } from './ipsecproposalpreview';
import { ipsecPolicyPreview } from './ipsecpolicy';
import { ipsecVpnPolicyPreview } from './ipsecvpnpreview';

function PagePreview({
  selectedFormat = 'cli',
  proposal_name,
  group,
  auth_mth,
  auth_algo,
  encrypt_algo,
  lifetime,
  policy_name,
  mode,
  policyPasswd,
  gateway_name,
  ike_policy,
  address,
  external_interface,
  local_address,
  version,
  bind_interface,
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
        policy_name,
        proposal_name,
        mode,
        policyPasswd,
      });
      break;
    case 'ikegateway':
      formats = ikeGatewayPreview({
        selectedFormat,
        gateway_name,
        ike_policy,
        address,
        external_interface,
        local_address,
        version,
      });
      break;
    case 'ipsecproposal':
      formats = ipsecProposalPreview({
        selectedFormat,
        proposal_name,
        protocol: 'esp',
        authentication_algorithm: auth_algo,
        encryption_algorithm: encrypt_algo,
        lifetime_seconds: lifetime,
      });
      break;
    case 'ipsecpolicy':
      formats = ipsecPolicyPreview({
        selectedFormat,
        policy_name,
        proposals: proposal_name,
        perfect_forward_secrecy: group,
        proposal_set: 'basic',
      });
      break;
    case 'ipsecvpn':
      formats = ipsecVpnPolicyPreview({
        selectedFormat,
        vpn_name: policy_name,
        bind_interface,
        ike_gateway: gateway_name,
        ipsec_policy: ike_policy,
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
