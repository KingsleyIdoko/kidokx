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


def format_set(payload):
    name = payload.get("proposalname")
    protocol = payload.get("encapsulation_protocol")
    authentication_algorithm = payload.get("authentication_algorithm")
    encryption_algorithm = payload.get("encryption_algorithm")
    lifetime_seconds = payload.get("lifetime_seconds")
    set_config = [
        f"set security ipsec proposal {name} protocol {protocol}",
        f"set security ipsec proposal {name} authentication-algorithm {authentication_algorithm}",
        f"set security ipsec proposal {name} encryption-algorithm {encryption_algorithm}",
        f"set security ipsec proposal {name} lifetime-seconds {lifetime_seconds}",
    ]
    return "\n".join(set_config)


def generate_delete_proposal(proposalname):
    return f"delete security ipsec proposal {proposalname}"

