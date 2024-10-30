from django.db import models

# Create your models here.

class RecipeDietaryPreference(models.Model):
    vegan = models.BooleanField(default=False)
    glutenfree = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

class RecipeMealType(models.Model):
    breakfast = models.BooleanField(default=False)
    brunch = models.BooleanField(default=False)
    lunch = models.BooleanField(default=False)
    dinner = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

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
    meal_type = models.OneToOneField(RecipeMealType, on_delete=models.CASCADE)
    dietary_preference = models.OneToOneField(RecipeDietaryPreference, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

class RecipeIngredient(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False)
    quantity = models.CharField(max_length=100, blank=False, null=False)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

class RecipeInstruction(models.Model):
    step = models.TextField(blank=False, null=False)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='instructions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

