
def data_comparison(db_data, device_data):
    updated_data = {}
    for key, db_value in db_data.items():
        if key not in device_data:
            continue
        device_value = device_data[key]
        if db_value != device_value:
            updated_data[key] =  device_value
    return updated_data



