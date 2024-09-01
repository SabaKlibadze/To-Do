from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('get_tasks/', views.get_tasks, name='get_tasks'),
    path('add_task/', views.add_task, name='add_task'),
    path('get_task_details/<int:task_id>/', views.get_task_details, name='get_task_details'),
    path('delete_task/<int:task_id>/', views.delete_task, name='delete_task'),
    path('toggle_task_completion/<int:task_id>/', views.toggle_task_completion, name='toggle_task_completion')
]