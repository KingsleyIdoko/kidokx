from ncclient import manager
import xmltodict, json


def _as_list(value):
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]


def get_address_book_config(host, username, password):
    xml_filter = """
    <configuration>
      <security>
        <address-book/>
      </security>
    </configuration>
    """

    with manager.connect(
        host=host,
        port=830,
        username=username,
        password=password,
        hostkey_verify=False,
        allow_agent=False,
        look_for_keys=False,
        device_params={"name": "junos"},
        timeout=30,
    ) as m:
        reply = m.get_config(source="running", filter=("subtree", xml_filter))

    parsed = xmltodict.parse(reply.data_xml)
    config = (
        parsed.get("rpc-reply", {})
        .get("data", {})
        .get("configuration")
        or parsed.get("configuration", {})
    )

    security = config.get("security", {})
    address_book_node = security.get("address-book")

    results = []

    for ab in _as_list(address_book_node):
        ab_name = ab.get("name")
        description =  ab.get("description")
        if not ab_name:
            continue

        attach = ab.get("attach", {}) or {}
        zone = attach.get("zone", {}) or {}

        zone_names = []
        if isinstance(zone, dict):
            zone_names = _as_list(zone.get("name"))
        elif isinstance(zone, list):
            for z in zone:
                zone_names.extend(_as_list((z or {}).get("name")))

        zone_names = [z for z in zone_names if z]
        for zname in zone_names:
            results.append(
                {
                    "name": ab_name,
                    "description": description,
                    "attached_zone": zname,
                }
            )
    return results
