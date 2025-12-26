from ncclient import manager
import xmltodict
import json

def parse_junos_address_book(dict_data):
    security = (
        dict_data
        .get("rpc-reply", {})
        .get("data", {})
        .get("configuration", {})
        .get("security", {})
    )

    # Could be dict OR list
    address_books = security.get("address-book", [])

    if isinstance(address_books, dict):
        address_books = [address_books]

    results = []

    for book in address_books:
        book_name = book.get("name")
        zone_name = (
            book.get("attach", {})
                .get("zone", {})
                .get("name")
        )

    print(results)
    return results


def device_addresses(host, username, password):
    xml_filter = """
        <configuration>
            <security>
                <address-book/>
            </security>
        </configuration>
    """
    with manager.connect(
        host=host,
        port=830,
        username=username,
        password=password,
        hostkey_verify=False,
        allow_agent=False,
        look_for_keys=False,
        device_params={'name': 'junos'}
    ) as m:
        response = m.get_config(source="running", filter=("subtree", xml_filter))
    dict_data  = xmltodict.parse(response.data_xml)
    addr_data  =  parse_junos_address_book(dict_data)
    return addr_data
