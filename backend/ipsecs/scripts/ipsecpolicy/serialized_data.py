from jnpr.junos import Device
from jnpr.junos.utils.config import Config
from jnpr.junos.exception import ConnectError, LockError, ConfigLoadError, CommitError

def push_junos_config(host, username, password, config_set_string):
    try:
        with Device(host=host, user=username, passwd=password, gather_facts=False) as dev:
            try:
                cu = Config(dev)
                cu.lock()
                print("🔓 Configuration locked.")
                cu.load(config_set_string, format="set", merge=True)
                cu.commit(sync=True)
                return True, "Commit successful"
            except (LockError, ConfigLoadError, CommitError) as e:
                return False, f"Config Error: {str(e)}"
            except Exception as e:
                return False, f"Exception: {str(e)}"
            finally:
                try:
                    cu.unlock()
                    print("🔓 Configuration unlocked.")
                except Exception as unlock_error:
                    print(f"⚠️ Unlock failed: {unlock_error}")
    except ConnectError as ce:
        print("🚨 Connection Error:", str(ce))
        return False, f"Connection Error: {str(ce)}"


def format_set(payload):
    name = payload.get("policy_name")
    description = payload.get("description")
    pfs_group = payload.get("pfs_group")
    proposals = payload.get("ipsec_proposal")
    set_config = [
        f'set security ipsec policy {name} description "{description}"',
        f"set security ipsec policy {name} perfect-forward-secrecy keys {pfs_group}",
        f"set security ipsec policy {name} proposals {proposals}",
    ]
    return "\n".join(set_config)


def generate_delete_ipsecPolicy(policy_name):
    return f"delete security ipsec policy {policy_name}"

