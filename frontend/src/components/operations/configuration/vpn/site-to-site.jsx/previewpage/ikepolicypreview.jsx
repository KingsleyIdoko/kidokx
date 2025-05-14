export function ikePolicyPreview({ selectedFormat = 'cli', ikePolicyData }) {
  const safeName = ikePolicyData.policyName || 'empty';
  const safeProposalName = ikePolicyData.proposalName || 'empty';
  const safeMode = ikePolicyData.ike_mode || 'empty';
  const safePolicyPasswd = ikePolicyData.authentication_method || 'empty'; // Assuming this is the password

  const styledName = `<span class="text-green-400 font-bold">${safeName}</span>`;
  const styledMode = `<span class="text-blue-400 font-bold">${safeMode}</span>`;
  const styledProposal = `<span class="text-yellow-400 font-bold">${safeProposalName}</span>`;
  const styledPasswd = `<span class="text-purple-400 font-bold">${safePolicyPasswd}</span>`;

  const formats = {
    cli: `
<pre class="whitespace-pre-wrap text-white">
set security ike policy ${styledName} mode ${styledMode}
set security ike policy ${styledName} proposals ${styledProposal}
set security ike policy ${styledName} pre-shared-key ascii-text ${styledPasswd}
</pre>`,

    json: `
<pre class="whitespace-pre-wrap text-white">
{
    "configuration": {
        "security": {
            "ike": {
                "policy": [
                    {
                        "name": "${safeName}",
                        "mode": "${safeMode}",
                        "proposals": ["${safeProposalName}"],
                        "pre-shared-key": {
                            "ascii-text": "${safePolicyPasswd}"
                        }
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
        &lt;ike&gt;
            &lt;policy&gt;
                &lt;name&gt;${safeName}&lt;/name&gt;
                &lt;mode&gt;${safeMode}&lt;/mode&gt;
                &lt;proposals&gt;${safeProposalName}&lt;/proposals&gt;
                &lt;pre-shared-key&gt;
                    &lt;ascii-text&gt;${safePolicyPasswd}&lt;/ascii-text&gt;
                &lt;/pre-shared-key&gt;
            &lt;/policy&gt;
        &lt;/ike&gt;
    &lt;/security&gt;
&lt;/configuration&gt;
</pre>`,
  };

  return formats;
}
