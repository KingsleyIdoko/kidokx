export function ikePolicyPreview({
  selectedFormat = 'cli',
  policy_name,
  proposal_name,
  mode,
  policyPasswd,
}) {
  const safeName = policy_name || 'ike-policy-1';
  const safeProposalName = proposal_name || 'proposal-1';
  const safeMode = mode || 'main';
  const safePolicyPasswd = policyPasswd || 'cisco123';

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
                        "name": "${styledName}",
                        "mode": "${styledMode}",
                        "proposals": ["${styledProposal}"],
                        "pre-shared-key": {
                            "ascii-text": "${styledPasswd}"
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
                &lt;name&gt;${styledName}&lt;/name&gt;
                &lt;mode&gt;${styledMode}&lt;/mode&gt;
                &lt;proposals&gt;${styledProposal}&lt;/proposals&gt;
                &lt;pre-shared-key&gt;
                    &lt;ascii-text&gt;${styledPasswd}&lt;/ascii-text&gt;
                &lt;/pre-shared-key&gt;
            &lt;/policy&gt;
        &lt;/ike&gt;
    &lt;/security&gt;
&lt;/configuration&gt;
</pre>`,
  };

  return formats;
}
