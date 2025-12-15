from ncclient import manager
import xmltodict

def get_address_book_config(host, username, password):
    xml_filter = """
        <configuration>
            <security>
                <address-book>
                </address-book>
            </security>
    </configuration>
    """

    with manager.connect(
        username=username,
        password=password,
        host=host,
        ports=830,
        hostkey_verify=False,
        allow_agent=False,
        look_for_keys=False,
        device_params={'name':'junos'}
    ) as m:
        response =  m.get_config(source="running", filter=("subtree", xml_filter))
        print(xmltodict.parse(response.data_xml))
