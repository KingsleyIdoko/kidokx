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
    vpn_name = payload.get("vpn_name")
    bind_interface = payload.get("bind_interface")
    gateway = payload.get("ike_gateway")
    ipsec_policy = payload.get("ipsec_policy")
    establish_tunnel = payload.get("establish_tunnel")
    set_config = [
        f"set security ipsec vpn {vpn_name} bind-interface {bind_interface}",
        f"set security ipsec vpn {vpn_name} ike gateway {gateway}",
        f"set security ipsec vpn {vpn_name} ike ipsec-policy {ipsec_policy}",
        f"set security ipsec vpn {vpn_name} establish-tunnels {establish_tunnel}",
    ]
    return "\n".join(set_config)

def generate_delete_ipsecVpn(vpn_name):
    return f"delete security ipsec vpn {vpn_name}"

