from google.cloud import storage
import firebase_admin
from firebase_admin import credentials


storage_client= storage.Client()

bucket_name='iotproject999-b5fee.appspot.com'

bucket= storage_client.get_bucket(bucket_name)

destination_blob_name = 'mynewimage'

blob =bucket.blob(destination_blob_name)

source_file_name = '/home/pi/Downloads/image.jpeg'

blob.upload_from_filename(source_file_name)

