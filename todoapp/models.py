from django.db import models
from datetime import date
from django.contrib.auth.models import User

# Create your models here.

class Task(models.Model):
    title = models.CharField(max_length=30)
    due_date = models.DateField(default=date.today)
    priority = models.CharField(max_length=10, default='Low')
    details = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(User, related_name='tasks', on_delete=models.CASCADE)

    def __str__(self):
        return f" - {self.title} - {self.due_date} - {self.priority} - {self.details} - {self.completed}"
    

