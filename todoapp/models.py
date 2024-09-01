from django.db import models
from datetime import date

# Create your models here.

class Task(models.Model):
    title = models.TextField(max_length=30)
    due_date = models.DateField(default=date.today)
    priority = models.CharField(max_length=10, default='Low')
    details = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f" - {self.title} - {self.due_date} - {self.priority} - {self.details} - {self.completed}"
    

