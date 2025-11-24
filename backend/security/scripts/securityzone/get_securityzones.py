from ncclient import manager
import xmltodict

def get_securityzones(host, username, password):
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
        filter_xml = """
        <configuration>
          <security>
            <zones>
              <security-zone/>
            </zones>
          </security>
        </configuration>
        """
        res = m.get_config(source="running", filter=("subtree", filter_xml))
        d_data = xmltodict.parse(
            res.data_xml,
            force_list=("security-zone", "system-services", "protocols", "interfaces", "name")
        )
        zones_raw = (
            d_data.get("rpc-reply", {})
                  .get("data", {})
                  .get("configuration", {})
                  .get("security", {})
                  .get("zones", {})
                  .get("security-zone", [])
        )

        def names_from_list(lst):
            out = []
            for items in lst or []:
                names = items.get('name')
                if isinstance(names, list):
                    out += [x for x in names if x]
                else:
                    out.append(names)
            return out
        result = []
        for data in zones_raw:
            zone_name = data.get('name')
            if isinstance(zone_name, list):
                zone_name = zone_name[0]
            description = data.get('description')
            hit = data.get('host-inbound-traffic',{})
            system_services  = names_from_list(hit.get('system-services',[]))
            system_protocols  = names_from_list(hit.get('protocols',[]))
            interfaces  = names_from_list(data.get('interfaces'))
            result.append({
                'zone_name': zone_name,
                'description': description,
                'system_services': system_services,
                'system_protocols': system_protocols,
                'interfaces': interfaces,
            })
        return result
