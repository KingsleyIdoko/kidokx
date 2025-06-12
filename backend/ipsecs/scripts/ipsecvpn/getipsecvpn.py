from ncclient import manager
import xmltodict

from ncclient import manager
import xmltodict

def get_ipsecvpn(host, username, password):
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
                        <vpn></vpn>
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
                       .get('vpn')
        )

        if isinstance(ipsecpolicy_dict, dict):
            return [ipsecpolicy_dict]
        return ipsecpolicy_dict or []


def normalized_vpn(vpn):
    return {
        'vpn_name': vpn.get("name"),
        'bind_interface': vpn.get("bind-interface"),
        'ike_gateway': vpn.get('ike').get('gateway'),
        'ipsec_policy': vpn.get("ike").get('ipsec-policy'),
        'establish_tunnel': vpn.get("establish-tunnels"),
        'is_published': True,
    }