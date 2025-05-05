# device_managers/junos_manager.py
from nornir import InitNornir
from nornir_pyez.plugins.tasks import pyez_get_config, pyez_config, pyez_commit, pyez_diff, pyez_rollback

class JunosDeviceManager:
    def __init__(self, config_file="../nornir_files/config.yml"):
        self.nr = InitNornir(config_file=config_file)

    def get_ike_proposals(self, target):
        response = self.nr.filter(name=target).run(task=pyez_get_config, database='candidate')
        if response.failed:
            raise Exception("Failed to connect to device.")
        for _, result in response.items():
            ike_config = result.result['configuration']['security'].get('ike', {})
            proposals = ike_config.get('proposal', [])
            # proposals = [proposals] if isinstance(proposals, dict) else proposals
            # ike_proposal_names = [p['name'] for p in proposals if 'name' in p]
            print(proposals)
        # return ike_proposal_names

object1 = JunosDeviceManager()
object1.get_ike_proposals("R4")