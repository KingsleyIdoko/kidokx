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


def serialized_ikepolicy(payload):
    policyname, main, proposal, pre_shared_key = payload

    set_config = [
        f"set security ike policy {policyname} mode {main}",
        f"set security ike policy {policyname} proposals {proposal}",
        f"set security ike policy {policyname} pre-shared-key ascii-text \"{pre_shared_key}\""
    ]
    return "\n".join(set_config)



def serialized_delete_ikepolicies(payload):
    policyname, _ = payload
    set_config = f"delete security ike policy {policyname}"
    print(set_config)
    return set_config
