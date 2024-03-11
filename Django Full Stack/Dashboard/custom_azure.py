from storages.backends.azure_storage import AzureStorage

class AzureMediaStorage(AzureStorage):
    account_name = 'cairocoinstorage' # Must be replaced by your <storage_account_name>
    account_key = 'bvsb6+1GdJCgqVUsM7iaACdb99KI5CaFh0Aj1oBwpZeK4C4BbG771ONdJcJHF7oGD/jJJp1zb2QN+AStZywHVg==' # Must be replaced by your <storage_account_key>
    azure_container = 'media'
    expiration_secs = None

class AzureStaticStorage(AzureStorage):
    account_name = 'cairocoinstorage' # Must be replaced by your storage_account_name
    account_key = 'bvsb6+1GdJCgqVUsM7iaACdb99KI5CaFh0Aj1oBwpZeK4C4BbG771ONdJcJHF7oGD/jJJp1zb2QN+AStZywHVg==' # Must be replaced by your <storage_account_key>
    azure_container = 'static'
    expiration_secs = None