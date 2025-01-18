from imagekitio import ImageKit
from dotenv import load_dotenv
import os
from rest_framework import serializers
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions
from django.core.files.uploadedfile import InMemoryUploadedFile
from io import BytesIO
import base64

def get_imagekit_instance():
    load_dotenv()

    return ImageKit(
        private_key=os.getenv('IMAGEKIT_PRIVATEKEY'),
        public_key=os.getenv('IMAGEKIT_PUBLICKEY'),
        url_endpoint='https://ik.imagekit.io/ozjxi1bzek'
    )

def upload_image(image_file: InMemoryUploadedFile, options = UploadFileRequestOptions(folder='/cookuisines_content/')):
        try:
            imagekit = get_imagekit_instance()

            result = imagekit.upload_file(base64.b64encode(image_file.file.read()).decode('utf-8'), image_file.name, options)

            return result
        except Exception:
                raise serializers.ValidationError({'image': 'Image upload failed.'})
        
def delete_image(file_id):
    try:
        imagekit = get_imagekit_instance()

        imagekit.delete_file(file_id)
    except Exception:
            raise serializers.ValidationError({'image': 'Image delete failed.'})