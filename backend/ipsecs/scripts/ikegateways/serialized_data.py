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


def serialized_ikegateway(payload):
    gatewayname = payload.get("gatewayname")
    ike_policy = payload.get("ike_policy")
    remote_address = payload.get("remote_address")
    local_address = payload.get("local_address")
    external_interface = payload.get("external_interface")
    ike_version = payload.get("ike_version")

    set_config = [
        f"set security ike gateway {gatewayname} ike-policy {ike_policy}",
        f"set security ike gateway {gatewayname} address {remote_address}",
        f"set security ike gateway {gatewayname} external-interface {external_interface}",
        f"set security ike gateway {gatewayname} local-address {local_address}",
        f"set security ike gateway {gatewayname} version {ike_version}",
    ]
    return "\n".join(set_config)

def serialized_delete_gateway(gatewayname):
    return f"delete security ike gateway {gatewayname}"

