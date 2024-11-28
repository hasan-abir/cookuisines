from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Recipe(models.Model):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    difficulty_choices = {
        EASY: "Easy",
        MEDIUM: "Medium",
        HARD: "Hard",
    }
    title = models.CharField(max_length=100, blank=False, null=False)
    preparation_time = models.DurationField(blank=False, null=False)
    cooking_time = models.DurationField(blank=False, null=False)
    difficulty = models.CharField(max_length=6, choices=difficulty_choices, blank=False, null=False)
    image_id = models.CharField(max_length=500, blank=False, null=False)
    image_url = models.URLField(max_length=2000,blank=False, null=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

class DietaryPreference(models.Model):
    vegan = models.BooleanField(default=False)
    glutenfree = models.BooleanField(default=False)
    recipe = models.OneToOneField(Recipe, on_delete=models.CASCADE, primary_key=True, related_name='dietary_preference')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

class MealType(models.Model):
    breakfast = models.BooleanField(default=False)
    brunch = models.BooleanField(default=False)
    lunch = models.BooleanField(default=False)
    dinner = models.BooleanField(default=False)
    recipe = models.OneToOneField(Recipe, on_delete=models.CASCADE, primary_key=True, related_name='meal_type')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

class Ingredient(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False)
    quantity = models.CharField(max_length=100, blank=False, null=False)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

class Instruction(models.Model):
    step = models.TextField(blank=False, null=False)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='instructions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

