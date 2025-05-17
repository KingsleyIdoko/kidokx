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


def serialized_ikeproposal(payload, old_proposals):
    proposalname, authentication_method, dh_group, authentication_algorithm, encryption_algorithm, lifetime_seconds = payload

    set_config = [
        f"set security ike proposal {proposalname} authentication-method {authentication_method}",
        f"set security ike proposal {proposalname} dh-group {dh_group}",
        f"set security ike proposal {proposalname} authentication-algorithm {authentication_algorithm}",
        f"set security ike proposal {proposalname} encryption-algorithm {encryption_algorithm}",
        f"set security ike proposal {proposalname} lifetime-seconds {lifetime_seconds}"
    ]
    return "\n".join(set_config)

def serialized_delete_ikeproposal(payload):
    proposalname, _ = payload
    set_config = f"delete security ike proposal {proposalname}"
    print(set_config)
    return "\n".join(set_config)
