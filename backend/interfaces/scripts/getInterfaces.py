from ncclient import manager
import xmltodict
from interfaces.models import Interface
from inventories.models import Device

def interfaceData(host, username, password):
    with manager.connect(
        host=host,
        port=830,
        username=username,
        password=password,
        hostkey_verify=False,
        device_params={"name": "junos"},
        look_for_keys=False,
        allow_agent=False
    ) as m:
        filter_xml = """
        <configuration>
            <interfaces>
                <interface/>
            </interfaces>
        </configuration>
        """
        response = m.get_config(source="candidate", filter=("subtree", filter_xml))
        try:
            parsed = xmltodict.parse(response.data_xml)
        except Exception as e:
            print("XML parsing failed:", str(e))
            raise

        interfaces = (
            parsed.get("rpc-reply", {})
                  .get("data", {})
                  .get("configuration", {})
                  .get("interfaces", {})
                  .get("interface", [])
        )

        if isinstance(interfaces, dict):
            return [interfaces]
        return interfaces


def sync_interfaces_to_db(device_name):
    device = Device.objects.get(device_name=device_name)
    interfaces = interfaceData(device.ip_address, device.username, device.password)

    for iface in interfaces:
        name = iface.get('name')
        description = iface.get('description', None)
        ip_address = None

        unit = iface.get('unit')
        units = [unit] if isinstance(unit, dict) else unit or []

        for u in units:
            if not isinstance(u, dict):
                continue
            family = u.get('family', {})
            inet = family.get('inet')
            if not isinstance(inet, dict):
                continue
            address = inet.get('address')
            if isinstance(address, dict):
                ip_address = address.get('name')
                break
            elif isinstance(address, list) and address:
                ip_address = address[0].get('name')
                break

        Interface.objects.update_or_create(
            device=device,
            name=name,
            defaults={
                'description': description,
                'ip_address': ip_address,
                'status': None,
                'speed': None,
                'mac_address': None,
                'interface_type': 'physical',
            }
        )
