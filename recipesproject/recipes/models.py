from django.db import models
from django.contrib.auth.models import User


class Recipe(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    cooking_time = models.DurationField()
    published = models.DateField(auto_now_add=True)
    creator = models.ForeignKey(
        User, related_name="creator", on_delete=models.CASCADE, null=True)


class Ingredient(models.Model):
    name = models.CharField(max_length=100)
    recipe = models.ForeignKey(
        Recipe, related_name='ingredients', on_delete=models.CASCADE)

    # def __str__(self):
    #     return '%d: %s' % ('ingredient', self.name)


class Step(models.Model):
    description = models.TextField()
    recipe = models.ForeignKey(
        Recipe, related_name='steps', on_delete=models.CASCADE)

    # def __str__(self):
    #     return '%d: %s' % ('step', self.name)
