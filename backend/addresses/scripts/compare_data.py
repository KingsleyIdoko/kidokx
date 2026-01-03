from typing import Any, Dict, List, Tuple

def data_comparison(db_data, device_data):
    updated_data = {}
    for key, db_value in db_data.items():
        device_value = device_data[key]
        if db_value != device_value:
            updated_data[key] =  device_value
    return updated_data


from typing import Any, Dict, List, Tuple


def missing_from_db(device_data: Any, db_data: Any) -> List[Dict[str, Any]]:

    def ensure_list(data: Any) -> List[Dict[str, Any]]:
        if data is None:
            return []
        return data if isinstance(data, list) else [data]

    def normalize(items: Any) -> List[Dict[str, Any]]:
        items = ensure_list(items)
        out: List[Dict[str, Any]] = []

        for d in items:
            if not isinstance(d, dict):
                continue

            name = d.get("name")
            zone = d.get("attached_zone")
            desc = d.get("description") or ""  # normalize None -> ""

            if name and zone:
                out.append({"name": name, "attached_zone": zone, "description": desc})

        return out

    dev = normalize(device_data)
    db = normalize(db_data)

    db_map: Dict[Tuple[str, str], Dict[str, Any]] = {
        (x["name"], x["attached_zone"]): x for x in db
    }

    delta: List[Dict[str, Any]] = []
    for x in dev:
        key = (x["name"], x["attached_zone"])
        if key not in db_map:
            # missing -> create
            delta.append(x)
        else:
            # exists -> include if changed
            if x["description"] != db_map[key]["description"]:
                delta.append(x)
    print(delta)
    return delta


