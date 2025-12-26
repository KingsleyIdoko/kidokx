from typing import Any, Dict, List, Tuple

def data_comparison(db_data, device_data):
    updated_data = {}
    for key, db_value in db_data.items():
        if key not in device_data:
            continue
        device_value = device_data[key]
        if db_value != device_value:
            updated_data[key] =  device_value
    return updated_data


def ensure_list(data: Any) -> List[Dict[str, Any]]:
    if data is None:
        return []
    return data if isinstance(data, list) else [data]


def normalize_addressbooks(items: Any) -> List[Dict[str, str]]:
    items = ensure_list(items)
    normalized: List[Dict[str, str]] = []
    for d in items:
        name = d.get("name")
        zone = d.get("attached_zone")
        if name and zone:
            normalized.append({"name": name, "attached_zone": zone})
    return normalized


def missing_from_db(device_data: Any, db_data: Any) -> List[Dict[str, str]]:
    dev = normalize_addressbooks(device_data)
    db = normalize_addressbooks(db_data)
    db_keys = {(x["name"], x["attached_zone"]) for x in db}
    return [x for x in dev if (x["name"], x["attached_zone"]) not in db_keys]

