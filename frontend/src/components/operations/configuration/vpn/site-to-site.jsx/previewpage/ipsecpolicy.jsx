export function ipsecPolicyPreview({
  selectedFormat = 'cli',
  policy_name,
  proposals,
  perfect_forward_secrecy,
  proposal_set,
}) {
  // Ensure variables have default values
  const safeName = policy_name || 'no-value';
  const safeProposals = proposals || 'no-value';
  const safePfs = perfect_forward_secrecy || 'no-value';
  const safeProposalSet = proposal_set || 'no-value';

  // Styled variables with inline HTML
  const styledName = `<span class="text-green-400 font-bold">${safeName}</span>`;
  const styledProposals = `<span class="text-yellow-400 font-bold">${safeProposals}</span>`;
  const styledPfs = `<span class="text-purple-400 font-bold">${safePfs}</span>`;
  const styledProposalSet = `<span class="text-red-400 font-bold">${safeProposalSet}</span>`;

  const formats = {
    cli: `
<pre class="whitespace-pre-wrap text-white">
set security ipsec policy ${styledName} proposals ${styledProposals}
set security ipsec policy ${styledName} perfect-forward-secrecy keys ${styledPfs}
set security ipsec policy ${styledName} proposal-set ${styledProposalSet}
</pre>`,

    json: `
<pre class="whitespace-pre-wrap text-white">
{
    "configuration": {
        "security": {
            "ipsec": {
                "policy": [
                    {
                        "name": "${styledName}",
                        "proposals": "${styledProposals}",
                        "perfect-forward-secrecy": {
                            "keys": "${styledPfs}"
                        },
                        "proposal-set": "${styledProposalSet}"
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
                &lt;name&gt;${styledName}&lt;/name&gt;
                &lt;proposals&gt;${styledProposals}&lt;/proposals&gt;
                &lt;perfect-forward-secrecy&gt;
                    &lt;keys&gt;${styledPfs}&lt;/keys&gt;
                &lt;/perfect-forward-secrecy&gt;
                &lt;proposal-set&gt;${styledProposalSet}&lt;/proposal-set&gt;
            &lt;/policy&gt;
        &lt;/ipsec&gt;
    &lt;/security&gt;
&lt;/configuration&gt;
</pre>`,
  };

  return formats;
}
