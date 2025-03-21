export function ipsecPolicyPreview({
  selectedFormat = 'cli',
  ipsecPolicyData,
}) {
  const safeName = ipsecPolicyData.policyName || 'empty';
  const safeDescription = ipsecPolicyData.description || 'empty';
  const safePfsGroup = ipsecPolicyData.pfs_group || 'empty';
  const safeProposalName = ipsecPolicyData.proposalName || 'empty';

  const styledName = `<span class="text-green-400 font-bold">${safeName}</span>`;
  const styledDescription = `<span class="text-blue-400 font-bold">${safeDescription}</span>`;
  const styledPfsGroup = `<span class="text-yellow-400 font-bold">${safePfsGroup}</span>`;
  const styledProposal = `<span class="text-purple-400 font-bold">${safeProposalName}</span>`;

  const formats = {
    cli: `
<pre class="whitespace-pre-wrap text-white">
set security ipsec policy ${styledName} description ${styledDescription}
set security ipsec policy ${styledName} perfect-forward-secrecy keys ${styledPfsGroup}
set security ipsec policy ${styledName} proposals ${styledProposal}
</pre>`,

    json: `
<pre class="whitespace-pre-wrap text-white">
{
    "configuration": {
        "security": {
            "ipsec": {
                "policy": [
                    {
                        "name": "${safeName}",
                        "description": "${safeDescription}",
                        "perfect-forward-secrecy": {
                            "keys": "${safePfsGroup}"
                        },
                        "proposals": ["${safeProposalName}"]
                    }
                ]
            }
        }
    }
}
</pre>`,

    xml: `
<pre class="whitespace-pre-wrap text-white">
&lt;configuration&gt;
    &lt;security&gt;
        &lt;ipsec&gt;
            &lt;policy&gt;
                &lt;name&gt;${safeName}&lt;/name&gt;
                &lt;description&gt;${safeDescription}&lt;/description&gt;
                &lt;perfect-forward-secrecy&gt;
                    &lt;keys&gt;${safePfsGroup}&lt;/keys&gt;
                &lt;/perfect-forward-secrecy&gt;
                &lt;proposals&gt;${safeProposalName}&lt;/proposals&gt;
            &lt;/policy&gt;
        &lt;/ipsec&gt;
    &lt;/security&gt;
&lt;/configuration&gt;
</pre>`,
  };

  return formats;
}
