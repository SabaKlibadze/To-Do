from django.shortcuts import render
from django.http import JsonResponse
import json
from . models import Task


def test(request):
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
    tasks = Task.objects.all().values('title', 'due_date', 'priority')
    return JsonResponse(list(tasks), safe=False)



