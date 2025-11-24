def normalize_interfaces(intf_list):
    """Strip .0 suffix from interface names."""
    return sorted([
        intf[:-2] if intf and intf.endswith(".0") else intf
        for intf in (intf_list or [])
    ])


def compare_device_and_backend_data(device_data, backend_data):
    # Fast lookup: {"trust": {...}, "untrust": {...}}
    backend_lookup = {item["zone_name"]: item for item in backend_data}
    updated_data = []
    for zone in device_data:
        zone_name = zone["zone_name"]

        # ✅ Case 1: Zone missing in backend → create
        if zone_name not in backend_lookup:
            updated_data.append({
                "action": "create",
                "payload": zone
            })
            continue

        # Load the corresponding backend zone dict
        backend_zone = backend_lookup[zone_name]

        # ✅ Normalize device zone
        normalized_device = {
            "zone_name": zone_name,
            "description": zone.get("description"),
            "system_services": sorted(zone.get("system_services", [])),
            "system_protocols": sorted(zone.get("system_protocols", [])),
            "interface_names": normalize_interfaces(zone.get("interfaces", [])),
        }

        # ✅ Normalize backend zone
        normalized_backend = {
            "zone_name": backend_zone["zone_name"],
            "description": backend_zone.get("description"),
            "system_services": sorted(backend_zone.get("system_services", [])),
            "system_protocols": sorted(backend_zone.get("system_protocols", [])),
            "interface_names": normalize_interfaces(backend_zone.get("interface_names", [])),
        }

        # ✅ Compute diff
        diff = {
            key: normalized_device[key]
            for key in normalized_device
            if normalized_device[key] != normalized_backend[key]
        }

        # ✅ Case 2: Differences → update backend
        if diff:
            updated_data.append({
                "action": "update",
                "id": backend_zone["id"],
                "zone_name": zone_name,
                "diff": diff
            })
    return updated_data
