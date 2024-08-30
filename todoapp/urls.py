from django.urls import path
from . import views
from .views import get_tasks, add_task

urlpatterns = [
    path('', views.test, name='index'),
    path('get_tasks/', get_tasks, name='get_tasks'),
    path('add_task/', add_task, name='add_task')
]