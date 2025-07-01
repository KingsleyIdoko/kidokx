from jnpr.junos import Device
from jnpr.junos.utils.config import Config
from jnpr.junos.exception import ConnectError, LockError, ConfigLoadError, CommitError
import traceback

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


def serialized_ikeproposal(payload, old_payloads):
    if len(payload) == 6:
        proposalname,  dh_group, authentication_algorithm, encryption_algorithm, lifetime_seconds = payload
    elif len(payload) == 5:
        proposalname,  dh_group, encryption_algorithm, lifetime_seconds = payload
        authentication_algorithm = None
    else:
        raise ValueError("Invalid payload length for IKE proposal.")
    set_config = [
        f"set security ike proposal {proposalname} dh-group {dh_group}",
        f"set security ike proposal {proposalname} encryption-algorithm {encryption_algorithm}",
        f"set security ike proposal {proposalname} lifetime-seconds {lifetime_seconds}"
    ]
    if authentication_algorithm and "gcm" not in encryption_algorithm.lower():
        set_config.insert(3, f"set security ike proposal {proposalname} authentication-algorithm {authentication_algorithm}")
    elif encryption_algorithm and "gcm" in encryption_algorithm.lower():
        set_config.insert(1, f"delete security ike proposal {proposalname} authentication-algorithm")
    return "\n".join(set_config)


def serialized_delete_ikeproposal(proposalname):
    return f"delete security ike proposal {proposalname}"

