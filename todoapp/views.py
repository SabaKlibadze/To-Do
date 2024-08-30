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
            title = data.get('title'),
            details = data.get('details'),    
            priority = data.get('priority'),        
            due_date = data.get('due_date'),
            completed = data.get('completed', False),
        )
        print(f"Task created: {task}")
        return JsonResponse({
            'id': task.id, 
            'title': task.title, 
            'due_date': task.due_date, 
            'priority': task.priority,
            'details': task.details,
            'completed': task.completed,
        })
    return JsonResponse({'error': 'Invalid request'}, status=400)


def get_tasks(request):
    tasks = Task.objects.all().values('id', 'title', 'due_date', 'priority')
    return JsonResponse(list(tasks), safe=False)


def delete_task(request, task_id):
    if request.method == 'POST':
        try:
            task = Task.objects.get(id=task_id)
            task.delete()
            return JsonResponse({'message': 'Task deleted successfully!'}, status=200)
        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task not found!'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=400)
