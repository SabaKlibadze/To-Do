from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('get_tasks/', views.get_tasks, name='get_tasks'),
    path('add_task/', views.add_task, name='add_task'),
    path('get_task_details/<int:task_id>/', views.get_task_details, name='get_task_details'),
    path('update_task/<int:task_id>/', views.update_task, name='update_task'),
    path('delete_task/<int:task_id>/', views.delete_task, name='delete_task'),
    path('toggle_task_completion/<int:task_id>/', views.toggle_task_completion, name='toggle_task_completion'),
    path('register/', views.register, name='register'),
    path('user_login/', views.user_login, name='user_login'),
    path('user_logout/', views.user_logout, name='user_logout'),
    path('get_new_csrf_token/', views.get_new_csrf_token, name='get_new_csrf_token'),
    path('check_user_status/', views.check_user_status, name='check_user_status'),
    path('validate_user/', views.validate_user, name='validate_user'),
    path('rename_category/', views.rename_category, name='rename_category'),
    path('add_note/', views.add_note, name='add_note'),
    path('get_notes/', views.get_notes, name='get_notes'),
    path('delete_note/<int:note_id>/', views.delete_note, name='delete_note'),
]