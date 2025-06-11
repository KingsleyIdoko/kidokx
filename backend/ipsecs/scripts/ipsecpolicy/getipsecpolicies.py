from ncclient import manager
import xmltodict

def get_ipsecpolicies(host, username, password):
    with manager.connect(
        host=host,
        port=830,
        username=username,
        password=password,
        hostkey_verify=False,
        allow_agent=False,
        look_for_keys=False,
        device_params={'name': 'junos'}
    ) as m:
        xml_filter = """
            <configuration>
                <security>
                    <ipsec>
                        <policy></policy>
                    </ipsec>
                </security>
            </configuration>
        """
        response = m.get_config(source='candidate', filter=('subtree', xml_filter))

        try:
            parsed_data = xmltodict.parse(response.data_xml)
        except Exception as e:
            print("XML parse failed: " + str(e))
            raise

        config_data = (
            parsed_data.get('rpc-reply', {})
                       .get('data', {})
                       .get('configuration')
        )

        if not config_data:
            return []

        ipsecpolicy_dict = (
            config_data.get('security', {})
                       .get('ipsec', {})
                       .get('policy')
        )

        if isinstance(ipsecpolicy_dict, dict):
            return [ipsecpolicy_dict]
        return ipsecpolicy_dict or []

def normalized_policies(policy):
    return {
        'policy_name': policy.get("name"),
        'description': policy.get("description"),
        'ipsec_proposal': policy.get("proposals"),
        'pfs_group': (policy.get("perfect-forward-secrecy") or {}).get("keys"),
        'is_published': True,
    }