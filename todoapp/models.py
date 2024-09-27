from django.db import models
from datetime import date
from django.contrib.auth.models import User

# Create your models here.
class Note(models.Model):
    title = models.CharField(max_length=40)
    details = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.title} {self.details}"

class TaskCategory(models.Model):
    template = models.CharField(max_length=10)
    name = models.CharField(max_length=10)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.template} {self.name}"

class Task(models.Model):
    title = models.CharField(max_length=40)
    due_date = models.DateField(default=date.today)
    priority = models.CharField(max_length=10, default='Low')
    details = models.TextField(blank=True, null=True)
    project = models.CharField(max_length=10, blank=True, null=True)
    completed = models.BooleanField(default=False)
    category = models.ForeignKey(TaskCategory, null=True, blank=True, on_delete=models.SET_NULL, related_name='tasks')
    user = models.ForeignKey(User, related_name='tasks', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.title} {self.due_date} {self.priority} {self.details} {self.category} {self.completed}"
    
