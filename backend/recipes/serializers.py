from rest_framework import serializers
from recipes.models import Recipe, mealtype_choices, dietarypreference_choices
from recipes.services import upload_image, delete_image

class RecipeSerializer(serializers.HyperlinkedModelSerializer):
    title = serializers.CharField(trim_whitespace=True)
    preparation_time = serializers.DurationField(help_text='In hh:mm:ss format')
    cooking_time = serializers.DurationField(help_text='In hh:mm:ss format')
    image = serializers.ImageField(write_only=True, help_text='Upload a file')
    meal_types = serializers.MultipleChoiceField(choices=mealtype_choices)
    dietary_preferences = serializers.MultipleChoiceField(choices=dietarypreference_choices)
    instruction_steps = serializers.CharField(trim_whitespace=True)
    ingredient_list = serializers.CharField(trim_whitespace=True)
    image_id = serializers.CharField(read_only=True, trim_whitespace=True)
    image_url = serializers.CharField(read_only=True, trim_whitespace=True)
    created_by_username = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Recipe
        fields = ['url', 'title', 'preparation_time', 'meal_types', 'dietary_preferences', 'instruction_steps', 'ingredient_list', 'cooking_time', 'difficulty', 'created_by_username', 'image', 'image_id', 'image_url']

    def validate_image(self, value):
        max_mb = 2
        max_file_size = max_mb * 1024 * 1024
        if value.size <= max_file_size:
            return value
        else:
            raise serializers.ValidationError('Image size has to be 2mb or less')

    def validate_preparation_time(self, value):
        if value.total_seconds() > 0:
            return value
        else:
            raise serializers.ValidationError('Duration cannot be zero.')
        
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        
        ret['meal_types'] = [dict(mealtype_choices).get(meal, meal) for meal in ret['meal_types']]
        ret['dietary_preferences'] = [dict(dietarypreference_choices).get(preference, preference) for preference in ret['dietary_preferences']]

        ret['ingredient_list'] = ret['ingredient_list'].split('\r\n')
        ret['instruction_steps'] = ret['instruction_steps'].split('\r\n')

        return ret
        
    def save(self, **kwargs):
        # Upload the image to cloud
        if 'image' in self.validated_data or hasattr(self.validated_data, 'image'):
                result = upload_image(self.validated_data['image'])

                if self.instance:
                    delete_image(file_id=self.instance.image_id)

                self.validated_data.pop('image')

                self.validated_data['image_id'] = result.file_id
                self.validated_data['image_url'] = result.url
        
        return super().save(**kwargs)

    
class RecipeErrorsSerializer(serializers.Serializer):
    title = serializers.ListField()
    preparation_time = serializers.ListField()
    cooking_time = serializers.ListField()
    difficulty = serializers.ListField()
    image = serializers.ListField()
    ingredient_list = serializers.ListField()
    instruction_steps = serializers.ListField()

class BasicErrorSerializer(serializers.Serializer):
    detail = serializers.CharField()