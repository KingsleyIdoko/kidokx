from ncclient import manager
import xmltodict

def get_ipsecproposals(host, username, password):
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
                        <proposal>
                        </proposal>  
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

        ipsecproposal_dict = (
            parsed_data.get('rpc-reply', {})
                       .get('data', {})
                       .get('configuration', {})
                       .get('security', {})
                       .get('ipsec', {})
                       .get('proposal')
        )

        if isinstance(ipsecproposal_dict, dict):
            return [ipsecproposal_dict]
        return ipsecproposal_dict or []

def serialized_ipsecproposals_policies(gw):
    return {
        "proposalname": gw.get("name"),
        "encapsulation_protocol": gw.get("protocol"),
        "authentication_algorithm": gw.get("authentication-algorithm"),
        "encryption_algorithm": gw.get("encryption-algorithm"),
        'lifetime-seconds': gw.get('lifetime-seconds'),
        "is_published": True  
    }

