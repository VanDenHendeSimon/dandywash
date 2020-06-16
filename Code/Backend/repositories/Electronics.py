from repositories.DataRepository import DataRepository


class Electronics:
    def __init__(self):
        pass

    @staticmethod
    def store_historiek(value, component_id):
        print("trying to store '%s' in database (id=%s)" % (value, component_id))
        try:
            result = DataRepository.store_historiek(value, component_id)

            # Check voor notificaties

            if result is not None:
                print("Stored successfully")
            else:
                print("Storing failed - Resulted None")

        except Exception as ex:
            print("Storing failed - Some exception")
            print(ex)
