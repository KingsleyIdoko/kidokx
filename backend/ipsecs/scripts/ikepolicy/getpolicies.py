# ipsecs/netconf_client.py
from ncclient import manager
import xmltodict

def get_junos_ike_policies(host, username, password):
    with manager.connect(
        host=host,
        port=830,
        username=username,
        password=password,
        hostkey_verify=False,
        device_params={"name": "junos"},
        look_for_keys=False,
        allow_agent=False,
    ) as m:

        filter_xml = """
        <configuration>
            <security>
                <ike>
                    <policy/>
                </ike>
            </security>
        </configuration>
        """

        response = m.get_config(source="candidate", filter=("subtree", filter_xml))
        try:
            parsed = xmltodict.parse(response.data_xml)
        except Exception as e:
            print("XML parsing failed:", str(e))
            raise

        policies = (
            parsed.get("rpc-reply", {})
                  .get("data", {})
                  .get("configuration", {})
                  .get("security", {})
                  .get("ike", {})
                  .get("policy", [])
        )
        # Always return a list
        if isinstance(policies, dict):
            return [policies]
        return policies

    
def normalize_device_policies(raw):
    return {
        "policyname": raw.get("name"),
        "mode": raw.get("mode", "").lower(),
        "proposals": raw.get("proposals"),
        "pre_shared_key": raw.get("pre-shared-key", {}).get("ascii-text", ""),
        "is_published": True,
    }



def sync_ike_policies(device, db_serialized, device_policies_raw):
    from ipsecs.models import IkePolicy  # adjust path if needed
    device_policies = [normalize_device_policies(p) for p in device_policies_raw]
    db_names = {p['policyname']: p for p in db_serialized}
    device_names = {p['policyname']: p for p in device_policies}

    to_create = []
    to_update = []

    for name, policy in device_names.items():
        if name not in db_names:
            to_create.append(policy)
        else:
            if not db_names[name]["is_published"]:
                to_update.append((name, True))

    for name, record in db_names.items():
        if name not in device_names and record["is_published"]:
            to_update.append((name, False))

    for policy in to_create:
        IkePolicy.objects.create(device=device, **policy)

    for name, publish_flag in to_update:
        IkePolicy.objects.filter(device=device, policyname=name).update(is_published=publish_flag)

    return {
        "created": [p["policyname"] for p in to_create],
        "updated": [name for name, _ in to_update]
    }
