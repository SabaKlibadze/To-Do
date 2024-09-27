from django.shortcuts import render
from django.http import JsonResponse
import json
from . models import Task, TaskCategory, Note
from django.contrib.auth import authenticate, login, logout
from .forms import RegisterForm
from django.middleware.csrf import get_token
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


def index(request):
    return render(request, "index.html")


def add_task(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        project_template = data.get('project_template')
        print(project_template)
        category = None
        project = None

        if project_template:
            project = project_template
            category = TaskCategory.objects.get(user=request.user, template=project_template)
           

        print(f"Received data: {data}")
        task = Task.objects.create(
            title = data['title'],
            details = data['details'],    
            priority = data['priority'],        
            due_date = data['due_date'],
            project = project,
            category = category,
            completed = False,
            user = request.user,
        )
        # print(f"Task created: {task}")
        return JsonResponse({'success': True, 'user': request.user.username, 'task': {
            'id': task.id, 
            'title': task.title, 
            'due_date': task.due_date, 
            'priority': task.priority,
            'details': task.details,
            'completed': task.completed,
            'project': task.project,
        }})
    return JsonResponse({'success': False, 'error': 'Invalid request method'})


def get_tasks(request):
    if request.user.is_authenticated:
        tasks = Task.objects.filter(user=request.user).values(
            'id', 'title', 'due_date', 'priority', 'project', 'completed', 'user')
        # print(tasks)
        return JsonResponse(list(tasks), safe=False)
    else:
        default_user = User.objects.get(username="Default")
        tasks = Task.objects.filter(user=default_user).values(
            'id', 'title', 'due_date', 'priority', 'project', 'completed', 'user')
        return JsonResponse(list(tasks), safe=False)


def get_task_details(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
        task_data = {
            'title': task.title,
            'details': task.details,
            'priority': task.priority,
            'due_date': task.due_date,
            'completed': task.completed
        }
        return JsonResponse(task_data)
    except Task.DoesNotExist:
        return JsonResponse({'error': 'Task not found!'}, status=404)



def toggle_task_completion(request, task_id):
    if request.method == 'POST':
        try:
            task = Task.objects.get(id=task_id)
            data = json.loads(request.body)
            task.completed = data.get('completed', False) 
            task.save()
            return JsonResponse({'completed': task.completed})
        
        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task not found'}, status=404)
        
    return JsonResponse({'error': 'Invalid request'}, status=400)



def update_task(request, task_id):
    if request.method == 'POST':
        try:
            task = Task.objects.get(id=task_id)
            data = json.loads(request.body)
            # print(f"Received data: {data}")
            task.title = data['title']
            task.details = data['details']
            task.due_date = data['due_date']
            task.priority = data['priority']
            task.save()
            return JsonResponse({'message': 'Task updated successfully!'}, status=200)
        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task not found!'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=400)
        


def delete_task(request, task_id):
    if request.method == 'POST':
        try:
            task = Task.objects.get(id=task_id)
            task.delete()
            return JsonResponse({'message': 'Task deleted successfully!'}, status=200)
        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task not found!'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=400)



def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        form = RegisterForm(data)
        # print(data)
        if form.is_valid():
            user = form.save()
            TaskCategory.objects.create(user=user, template='project-n1', name='Gym')
            TaskCategory.objects.create(user=user, template='project-n2', name='Study')
            TaskCategory.objects.create(user=user, template='project-n3',name='Work')
            return JsonResponse({'success': True})
        else:
            # print(form.errors)
            return JsonResponse({'success': False, 'error': form.errors})
    return JsonResponse({'success': False, 'error': 'Invalid request method'})



def user_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        # print(data)
        email = data.get('email')
        password = data.get('password')
        user = authenticate_by_email(request, email=email, password=password)
        if user is not None:
            login(request, user)
            project_n1 = TaskCategory.objects.get(user=user, template='project-n1')
            project_n2 = TaskCategory.objects.get(user=user, template='project-n2')
            project_n3 = TaskCategory.objects.get(user=user, template='project-n3')
            return JsonResponse({'success': True,
                                 'username': request.user.username, 
                                 'project_n1': project_n1.name,
                                 'project_n2': project_n2.name,
                                 'project_n3': project_n3.name,
                                })
        else:
            return JsonResponse({'success': False, 'error': 'Invalid credentials'})
    return JsonResponse({'success': False, 'error': 'Invalid request method'})



def authenticate_by_email(request, email, password):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return None
    return authenticate(request, username=user.username, password=password)



def user_logout(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': 'Invalid request method'})



def get_new_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})



def check_user_status(request):
    if request.user.is_authenticated:
        project_n1 = TaskCategory.objects.get(user=request.user, template='project-n1')
        project_n2 = TaskCategory.objects.get(user=request.user, template='project-n2')
        project_n3 = TaskCategory.objects.get(user=request.user, template='project-n3')
        return JsonResponse({
            'is_authenticated': True,
            'username': request.user.username,
            'project_n1': project_n1.name,
            'project_n2': project_n2.name,
            'project_n3': project_n3.name,
        })
    else:
        return JsonResponse({
            'is_authenticated': False,
            'username': None,
        })
    


def validate_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        username_exist = User.objects.filter(username=username).exists()
        email_exist = User.objects.filter(email=email).exists()

        try:
            temp_user = User(username=username, email=email)

            validate_password(password, user=temp_user)

        except ValidationError as e:
            return JsonResponse({'username': username_exist,
                                 'email': email_exist,
                                 'password': True,
                                 'error': e.messages})
        
        return JsonResponse({'username': username_exist,
                             'email': email_exist,
                             'password': False})
    
    return JsonResponse({'success': False, 'error': 'Invalid request method'})



def rename_category(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        new_name = data.get('category_name')

        category = TaskCategory.objects.get(user=request.user, template=data.get('category_template'))
        category.name = new_name
        category.save()

        return JsonResponse({'success': True, 'category_template': category.template, 'category_name': new_name})
    
    return JsonResponse({'success': False, 'error': 'Invalid request method'})  


def add_note(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        note = Note.objects.create(
            title = data['title'],
            details = data['details'],    
            user = request.user,
        )
        print(f"Note created: {note}")
        return JsonResponse({'success': True, 'user': request.user.username, 'note': {
            'id': note.id, 
            'title': note.title, 
            'details': note.details,
        }})
    return JsonResponse({'success': False, 'error': 'Invalid request method'})


def get_notes(request):
    if request.user.is_authenticated:
        notes = Note.objects.filter(user=request.user).order_by('-created_at').values('id', 'title', 'details', 'user')
        return JsonResponse(list(notes), safe=False)
    else:
        default_user = User.objects.get(username="Default")
        notes = Note.objects.filter(user=default_user).order_by('-created_at').values('id', 'title', 'details')
        return JsonResponse(list(notes), safe=False)



def delete_note(request, note_id):
    if request.method == 'POST':
        try:
            note = Note.objects.get(id=note_id)
            note.delete()
            return JsonResponse({'message': 'Note deleted successfully!'}, status=200)
        except Note.DoesNotExist:
            return JsonResponse({'error': 'Note not found!'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=400)