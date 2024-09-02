from django.shortcuts import render
from django.http import JsonResponse
import json
from . models import Task


def index(request):
    return render(request, "index.html")


def add_task(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print(f"Received data: {data}")
        task = Task.objects.create(
            title = data['title'],
            details = data['details'],    
            priority = data['priority'],        
            due_date = data['due_date'],
            completed = False
        )
        print(f"Task created: {task}")
        return JsonResponse({'success': True, 'task': {
            'id': task.id, 
            'title': task.title, 
            'due_date': task.due_date, 
            'priority': task.priority,
            'details': task.details,
            'completed': task.completed,
        }})
    return JsonResponse({'success': False, 'error': 'Invalid request method'})


def get_tasks(request):
    tasks = Task.objects.all().values('id', 'title', 'due_date', 'priority', 'completed')
    return JsonResponse(list(tasks), safe=False)


def get_task_details(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
        task_data = {
            'title': task.title,
            'details': task.details,
            'priority': task.priority,
            'due_date': task.due_date,
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



def delete_task(request, task_id):
    if request.method == 'POST':
        try:
            task = Task.objects.get(id=task_id)
            task.delete()
            return JsonResponse({'message': 'Task deleted successfully!'}, status=200)
        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task not found!'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=400)
