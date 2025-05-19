# ipsecs/netconf_client.py
from ncclient import manager
import xmltodict

def get_junos_ike_proposals(host, username, password):
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
                    <proposal/>
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
        proposals = (
            parsed.get("rpc-reply", {})
                  .get("data", {})
                  .get("configuration", {})
                  .get("security", {})
                  .get("ike", {})
                  .get("proposal", [])
        )
        # Always return a list
        if isinstance(proposals, dict):
            return [proposals]
        return proposals
    
def normalize_device_proposal(raw):
    return {
        "proposalname": raw.get("name"),
        "authentication_algorithm": raw.get("authentication-algorithm", "").lower(),
        "authentication_method": raw.get("authentication-method", "").lower(),
        "encryption_algorithm": raw.get("encryption-algorithm", "").lower(),
        "dh_group": raw.get("dh-group", "").lower(),
        "lifetime_seconds": int(raw.get("lifetime-seconds", 86400)),
        "is_published": True,
    }



def sync_ike_proposals(device, db_serialized, device_proposals_raw):
    device_proposals = [normalize_device_proposal(p) for p in device_proposals_raw]
    db_names = {p['proposalname']: p for p in db_serialized}
    device_names = {p['proposalname']: p for p in device_proposals}

    to_create = []
    to_update = []

    # Create or update proposals from device
    for name, proposal in device_names.items():
        if name not in db_names:
            to_create.append(proposal)
        else:

            if not db_names[name]["is_published"]:
                to_update.append((name, True))

    # Mark DB-only proposals as unpublished
    for name, record in db_names.items():
        if name not in device_names and record["is_published"]:
            to_update.append((name, False))

    # Perform DB operations
    from ipsecs.models import IkeProposal

    for proposal in to_create:
        IkeProposal.objects.create(device=device, **proposal)

    for name, publish_flag in to_update:
        IkeProposal.objects.filter(device=device, proposalname=name).update(is_published=publish_flag)

    return {
        "created": [p["proposalname"] for p in to_create],
        "updated": [name for name, _ in to_update]
    }
