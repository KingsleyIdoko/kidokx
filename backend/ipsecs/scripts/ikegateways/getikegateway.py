from ncclient import manager
import xmltodict

def device_ikegateway_policies(host, username, password):
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
                <ike>
                    <gateway/>
                </ike>
            </security>
        </configuration>
        """

        response = m.get_config(source='candidate', filter=('subtree', xml_filter))

        try:
            parsed_data = xmltodict.parse(response.data_xml)
        except Exception as e:
            print("XML parse failed: " + str(e))
            raise

        ikegateways_dict = (
            parsed_data.get('rpc-reply', {})
                       .get('data', {})
                       .get('configuration', {})
                       .get('security', {})
                       .get('ike', {})
                       .get('gateway')
        )

        if isinstance(ikegateways_dict, dict):
            return [ikegateways_dict]
        return ikegateways_dict or []

def serialized_ikegateway_policies(gw):
    return {
        "gatewayname": gw.get("name"),
        "ike_policy": gw.get("ike-policy"),
        "remote_address": gw.get("address"),  # maps to <address>
        "local_address": gw.get("local-address"),
        "external_interface": gw.get("external-interface"),
        "ike_version": gw.get("version"),
        "is_published": True  # or use logic if needed
    }
