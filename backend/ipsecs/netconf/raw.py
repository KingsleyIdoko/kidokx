# from utiliites_scripts.commons import (get_valid_string, get_ike_lifetime, get_valid_choice,get_ike_lifetime,
#                                         get_valid_selection, get_valid_name, validate_yes_no)
# encrypt = ['3des-cbc', 'aes-128-cbc', 'aes-128-gcm', 'aes-192-cbc', 'aes-256-cbc', 'aes-256-gcm', 'des-cbc']
# dh_group = ['group1', 'group14', 'group19', 'group2', 'group20', 'group24', 'group5']
# auth_meth = ['dsa-signatures', 'ecdsa-signatures-256', 'ecdsa-signatures-384', 'pre-shared-keys', 'rsa-signatures']
# auth_algo = ['md5', 'sha-256', 'sha-384', 'sha1']


# def extract_and_update_proposal(ike_config, used_proposals):
#     changed_key = []
#     proposals = ike_config.get('proposal', [])
#     proposals = [proposals] if isinstance(proposals, dict) else proposals
#     proposal_names = [proposal['name'] for proposal in proposals]
#     selected_index = get_valid_choice("Select a proposal to update", proposal_names)
#     selected_proposal = proposals[selected_index]
#     if selected_index == len(proposals) - 1 and len(proposals) > 1:
#         insert_after = proposals[selected_index - 1]['name']
#     else:
#         insert_after = None
#     old_name = selected_proposal['name']
#     print("Selected Proposal:", selected_proposal['name'])
#     while True:
#         proposal_keys = [f"{key}: {selected_proposal[key]}" for key in selected_proposal.keys()]
#         key_index = get_valid_choice("Select a key to update (shown with value)", proposal_keys)
#         selected_key_with_value = proposal_keys[key_index]
#         selected_key = selected_key_with_value.split(": ")[0]
#         choice_mappings = {
#             'encryption-algorithm': encrypt,
#             'dh-group': dh_group,
#             'authentication-method': auth_meth,
#             'authentication-algorithm': auth_algo
#         }
#         if selected_key in choice_mappings:
#             new_value = get_valid_selection(f"Enter new value for {selected_key}", choice_mappings[selected_key])
#             if selected_key == 'encryption-algorithm' and 'gcm' in new_value:
#                 if 'authentication-algorithm' in selected_proposal:
#                     print("We'll remove 'authentication-algorithm' from the configuration due to GCM selection.")
#                     selected_proposal.pop('authentication-algorithm', None)
#                     changed_key.append({'authentication-algorithm': None})
#             elif selected_key == 'encryption-algorithm' and 'gcm' not in new_value:
#                 if 'authentication-algorithm' not in selected_proposal:
#                     selected_proposal['authentication-algorithm'] = get_valid_selection("Please select 'authentication-algorithm'", auth_algo)
#         elif selected_key == "name":
#             new_value = get_valid_name(f"Enter new value for {selected_key}: ")
#             if used_proposals and selected_proposal['name'] in used_proposals:
#                 print(f"Proposal {selected_proposal['name']} is currently in use by IKE Policy")
#                 return None, None, None, None, None
#         elif selected_key == "lifetime-seconds":
#             new_value = get_ike_lifetime()
#         else:
#             new_value = get_valid_string(f"Enter new value for {selected_key}: ", max_words=10)
#         old_value = selected_proposal.get(selected_key, 'N/A')
#         selected_proposal[selected_key] = new_value
#         changed_key.append({selected_key: new_value})
#         if selected_key == 'name':
#             old_name = old_value
#         choice = validate_yes_no("Do you want to update another parameter in the IKE Proposal, yes/no: ")
#         if not choice:
#             break
#     description = f"Updated Proposal: {selected_proposal.get('name', 'N/A')}, changes applied."
#     return selected_proposal, insert_after, old_name, description, changed_key



# def update_ikeproposal_xml(**kwargs):
#     updated_proposal = kwargs.get('updated_proposal', None)
#     old_name = kwargs.get('old_name', None)
#     insert_after = kwargs.get('insert_after', None)
#     changed_key = kwargs.get('changed_key', None)
#     ike_opening_tag = "<ike>"
#     if old_name is None or old_name == updated_proposal['name']:
#         proposal_updates_str = sub_xml_config(changed_key)
#         proposal_elements = create_xml_elements_from_dict(updated_proposal)
#         ike_proposal_xml = f"""
#             <configuration>
#                 <security>
#                     {ike_opening_tag}
#                         <proposal>
#                             <name>{updated_proposal['name']}</name>
#                             {proposal_updates_str}
#                             {proposal_elements}
#                         </proposal>
#                     </ike>
#                 </security>
#             </configuration>""".strip()
#     else:
#         insert_str = f'insert="after" key="[ name=\'{insert_after}\' ]"' if insert_after else ""
#         proposal_elements = create_xml_elements_from_dict(updated_proposal)
#         ike_proposal_xml = f"""
#             <configuration>
#                 <security>
#                     {ike_opening_tag}
#                         <proposal {insert_str} operation="create">
#                             {proposal_elements}
#                         </proposal>
#                     </ike>
#                 </security>
#             </configuration>""".strip()
#     print("Generated IKE Proposal Configuration:")
#     return ike_proposal_xml


# def delete_ike_proposal(**kwargs):
#     ike_proposal_names = kwargs.get('ike_proposal_names', None)
#     used_proposals = kwargs.get('used_proposals', None)
#     direct_delete = kwargs.get('direct_delete', False)
#     key_values =  kwargs.get('key_values', None)    
#     if not ike_proposal_names:
#         print("No proposals to delete.")
#         return None
#     proposal_names_to_delete = []
#     if not direct_delete:
#         choice_index = get_valid_choice("Enter proposal number to delete", ike_proposal_names)
#         proposal_name_to_delete = ike_proposal_names[choice_index]
#         if used_proposals and proposal_name_to_delete in used_proposals:
#             print(f"{proposal_name_to_delete} is in use in IKE Policy and cannot be deleted.")
#             return None
#         proposal_names_to_delete.append(proposal_name_to_delete)
#     else:
#         if isinstance(ike_proposal_names, str):
#             proposal_names_to_delete.append(ike_proposal_names)
#         else:
#             proposal_names_to_delete.extend(ike_proposal_names)
#     proposals_payload = "".join(
#         f"""
#                 <proposal operation="delete">
#                     <name>{name}</name>
#                 </proposal>""" for name in proposal_names_to_delete
#     )
#     payload = f"""
#     <configuration>
#         <security>
#             <ike>{proposals_payload}
#             </ike>
#         </security>
#     </configuration>""".strip()
#     print(f"Proposals to delete: {', '.join(proposal_names_to_delete)}")
#     return payload

# def gen_ikeprop_config(old_proposal_names, encrypt=encrypt, dh_group=dh_group, 
#                        auth_meth=auth_meth, auth_algo=auth_algo):
#     if old_proposal_names:
#         print(f"{len(old_proposal_names)} proposals already exist on the device.")
#         for index, proposal in enumerate(old_proposal_names, start=1):
#             print(f"{index}. {proposal}")
#     while True:
#         ikeproposal_name = get_valid_name("Enter New IKE Proposal Name: ")
#         if ikeproposal_name in old_proposal_names:
#             print("Ike Proposal already exists, please enter a different name.")
#             continue
#         break
#     ikeproposal_desc = get_valid_string("Enter Ike Proposal Description: ", max_words=10)
#     encrypt_algorithm = get_valid_selection("Select Encryption Algorithm: ", encrypt)
#     is_gcm = encrypt_algorithm in ["aes-128-gcm", "aes-256-gcm"]
#     dhgroup = get_valid_selection("Select DH Group: ", dh_group)
#     auth_method = get_valid_selection("Select Authentication Method: ", auth_meth)
#     if not is_gcm:
#         auth_algorithm = get_valid_selection("Select Authentication Algorithm: ", auth_algo)
#     else:
#         auth_algorithm = None
#     ike_lifetime = get_ike_lifetime()
#     proposal_attributes = ""
#     if old_proposal_names:
#         last_old_proposal = old_proposal_names[-1]
#         proposal_attributes = f'insert="after" key="[ name=\'{last_old_proposal}\' ]" operation="create"'
#     xml_components = [
#         f"<name>{ikeproposal_name}</name>",
#         f"<description>{ikeproposal_desc}</description>"
#     ]
#     if auth_method:
#         xml_components.append(f"<authentication-method>{auth_method}</authentication-method>")
#     if auth_algorithm:
#         xml_components.append(f"<authentication-algorithm>{auth_algorithm}</authentication-algorithm>")
#     xml_components.extend([
#         f"<dh-group>{dhgroup}</dh-group>",
#         f"<encryption-algorithm>{encrypt_algorithm}</encryption-algorithm>",
#         f"<lifetime-seconds>{ike_lifetime}</lifetime-seconds>"
#     ])
#     formatted_xml_components = "\n                ".join(xml_components)
#     ike_proposal_xml = (
#         "<configuration>\n"
#         "    <security>\n"
#         "        <ike>\n"
#         f"            <proposal {proposal_attributes}>\n"
#         f"                {formatted_xml_components}\n"
#         "            </proposal>\n"
#         "        </ike>\n"
#         "    </security>\n"
#         "</configuration>"
#     ).strip()
#     print("Generated IKE Proposal Configuration:")
#     return ike_proposal_xml

# def sub_xml_config(data):
#     proposal_updates = []
#     for item in data:
#         if not item or not isinstance(item, dict):
#             continue  
#         key, value = next(iter(item.items()), (None, None))
#         if key is None:
#             continue
#         if value is None:
#             proposal_updates.append(f"""<{key} operation="delete"/>""")
#         else:
#             proposal_updates.append(f"""        
#                             <{key} operation="delete"/>""")
#             proposal_updates.append(f"""        
#                             <{key} operation="create">{value}</{key}>""")
#     proposal_updates_str = "\n".join(proposal_updates)
#     return proposal_updates_str.strip()

# def create_xml_elements_from_dict(proposal):
#     elements = []
#     for key, value in proposal.items():
#         if value and key != "name": 
#             elements.append(f"""
#                             <{key}>{value}</{key}>""")
#     return "\n".join(elements)


