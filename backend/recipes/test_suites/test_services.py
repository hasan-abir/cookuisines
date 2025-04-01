from django.test import TestCase
from unittest.mock import patch, MagicMock
from recipes.services import upload_image, delete_image
from .utils import generate_image
from rest_framework import serializers
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions

# Create your tests here.
class UploadImageTestCase(TestCase):
    @patch('recipes.services.get_imagekit_instance')
    def test_success(self, mock_get_imagekit_instance):
        mock_imagekit_instance = MagicMock()
        mock_upload_file = MagicMock()
        file_result = '123'
        mock_upload_file.return_value = file_result
        mock_imagekit_instance.upload_file = mock_upload_file

        mock_get_imagekit_instance.return_value = mock_imagekit_instance

        image_file = generate_image('cat_small.jpg')
        options = UploadFileRequestOptions(folder='/cookuisines_content/')

        results = upload_image(image_file, options)

        mock_upload_file.assert_called_once()

        self.assertEqual(results, file_result)

    @patch('recipes.services.get_imagekit_instance')
    def test_error(self, mock_get_imagekit_instance):
        mock_imagekit_instance = MagicMock()
        mock_upload_file = MagicMock()
        mock_upload_file.side_effect = KeyError('123')
        mock_imagekit_instance.upload_file = mock_upload_file

        mock_get_imagekit_instance.return_value = mock_imagekit_instance

        image_file = generate_image('cat_small.jpg')
        options = UploadFileRequestOptions(folder='/cookuisines_content/')


        with self.assertRaises(serializers.ValidationError):
            upload_image(image_file, options)

        mock_upload_file.assert_called_once()

class DeleteImageTestCase(TestCase):
    @patch('recipes.services.get_imagekit_instance')
    def test_success(self, mock_get_imagekit_instance):
        mock_imagekit_instance = MagicMock()
        mock_delete_file = MagicMock()
        mock_imagekit_instance.delete_file = mock_delete_file

        mock_get_imagekit_instance.return_value = mock_imagekit_instance

        file_id = '123'

        delete_image(file_id)

        mock_delete_file.assert_called_with(file_id)

    @patch('recipes.services.get_imagekit_instance')
    def test_error(self, mock_get_imagekit_instance):
        mock_imagekit_instance = MagicMock()
        mock_delete_file = MagicMock()
        mock_delete_file.side_effect = KeyError('123')
        mock_imagekit_instance.delete_file = mock_delete_file

        mock_get_imagekit_instance.return_value = mock_imagekit_instance

        file_id = '123'

        with self.assertRaises(serializers.ValidationError):
            delete_image(file_id)

        mock_delete_file.assert_called_with(file_id)
