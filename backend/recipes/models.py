from django.db import models
from django.contrib.auth.models import User
from multiselectfield import MultiSelectField

# Create your models here.
EASY = "easy"
MEDIUM = "medium"
HARD = "hard"

difficulty_choices = {
        EASY: "Easy",
        MEDIUM: "Medium",
        HARD: "Hard",
    }

mealtype_choices = (('breakfast', 'Breakfast'),
              ('brunch', 'Brunch'),
              ('lunch', 'Lunch'),
              ('dinner', 'Dinner'))

dietarypreference_choices = (('vegan', 'Vegan'),
              ('glutenfree', 'Gluten free'))

class Recipe(models.Model):
    title = models.CharField(max_length=100, blank=False, null=False)
    preparation_time = models.DurationField(blank=False, null=False)
    cooking_time = models.DurationField(blank=False, null=False)
    difficulty = models.CharField(max_length=6, choices=difficulty_choices, blank=False, null=False)
    meal_types = MultiSelectField(choices=mealtype_choices, blank=True)
    dietary_preferences = MultiSelectField(choices=dietarypreference_choices, blank=True)
    instruction_steps = models.TextField(blank=False, null=False, default='Set instructions for this recipe!')
    ingredient_list = models.TextField(blank=False, null=False, default='Set ingredients for this recipe!')
    image_id = models.CharField(max_length=500, blank=False, null=False)
    image_url = models.URLField(max_length=2000,blank=False, null=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.title}'

