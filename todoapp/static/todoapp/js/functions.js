
// _______________________________ TASKS CONTAINER ____________________________________


// New task popup
const  createNewTaskBTN= document.getElementById('create-new-task-btn')
createNewTaskBTN.addEventListener('click', () => {
    toggleNewTaskPopup()});

// Close new task popup
const createNewTaskCloseBtn = document.querySelector('.create-new__close-btn')
createNewTaskCloseBtn.addEventListener('click', () => {
    toggleNewTaskPopup(), removeActivePriority()});

// Create new task
const addTaskBtn = document.getElementById('new-task-submit')
addTaskBtn.addEventListener('click', () => {
    addTask(), toggleNewTaskPopup()});



function addTask(){
    const newTaskName = document.getElementById('create-new__name');
    const newTaskDetails = document.getElementById('create-new__details');
    const taskContainer = document.getElementById('task-container');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    if(newTaskName.value === ''){
        alert('You must write something!')
    }
    else{

        const task = document.createElement('div')
        task.classList.add('task')
        task.setAttribute('id', 'task');

        const priorityFlag = document.createElement('div');
        if (document.getElementById('create-priority-high').checked == true) {
            priorityFlag.classList.add('priority-flag-high');
        } else if (document.getElementById('create-priority-medium').checked == true) {
            priorityFlag.classList.add('priority-flag-medium');
        } else {
            priorityFlag.classList.add('priority-flag-low');       
        }

        const taskCheckbox = document.createElement('span');
        taskCheckbox.classList.add('task-checkbox');
        taskCheckbox.addEventListener('click', e => e.target.classList.toggle('task-checkbox-checked'));
        
        const taskName = document.createElement('span');
        taskName.classList.add('task-name');
        taskName.textContent = newTaskName.value;

        const taskDetails = document.createElement('button');
        taskDetails.setAttribute('type', 'button')
        taskDetails.classList.add('task-details')
        taskDetails.textContent = 'details'

        const taskDate = document.createElement('span');
        taskDate.classList.add('task-date');
        const dateInput = document.getElementById('calendar').value;
        const formattedDate = formatDate(dateInput);
        taskDate.textContent = `${formattedDate}`;

        const taskEdit = document.createElement('button');
        taskEdit.classList.add('task-edit');


        const taskDelete = document.createElement('button');
        taskDelete.classList.add('task-delete');
        taskDelete.addEventListener('click', (e, count) => {
            e.target.parentElement.remove(), count = homeCount()})

        task.appendChild(priorityFlag)
        task.appendChild(taskCheckbox)
        task.appendChild(taskName);
        task.appendChild(taskDetails);
        task.appendChild(taskDate);
        task.appendChild(taskEdit);
        task.appendChild(taskDelete);

        taskContainer.appendChild(task);
        homeCount()
        
        fetch('/add_task/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                priority: priorityFlag.classList.contains('priority-flag-high') ? 'high' :
                priorityFlag.classList.contains('priority-flag-medium') ? 'medium' :
                    'low',
                completed: taskCheckbox.classList.contains('checked') ? 'completed' :
                    'not completed',
                title: taskName.textContent,
                details: newTaskDetails.value,
                due_date: dateInput, 

            })
       })
       .then(response => response.json())
       .then(data => {
            console.log('Success:', data);
       })
       .catch((error) => {
            console.log('Error:', error);
       });
    }

    newTaskName.value = ''
    // saveData()
}



// function saveData() {
//     localStorage.setItem('data', taskContainer.innerHTML)
// }

// function showTasks() {
//     taskContainer.innerHTML = localStorage.getItem('data')
// }

// showTasks()



document.addEventListener('DOMContentLoaded', function() {
    fetch('/get_tasks/')
        .then(response => response.json())
        .then(data => {
            data.forEach(task => {
                addTasksFromBase(task);
            })
        homeCount()
        })    
        .catch(error => console.error('Error:', error));
});



function addTasksFromBase(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.setAttribute('id', `task-${task.id}`)

    const priorityFlag = document.createElement('span');
    priorityFlag.classList.add(`priority-flag-${task.priority.toLowerCase()}`);

    const taskCheckbox = document.createElement('span');
    taskCheckbox.classList.add('task-checkbox');
    taskCheckbox.addEventListener('click', e => e.target.classList.toggle('task-checkbox-checked'));

    const taskName = document.createElement('span');
    taskName.classList.add('task-name');
    taskName.textContent = task.title;

    const taskDetails = document.createElement('button');
    taskDetails.textContent = 'details'
    taskDetails.classList.add('task-details')

    const taskDate = document.createElement('span');
    taskDate.classList.add('task-date');
    taskDate.textContent = formatDate(task.due_date);

    const taskEdit = document.createElement('button');
    taskEdit.classList.add('task-edit');

    const taskDelete = document.createElement('button');
    taskDelete.classList.add('task-delete');
    taskDelete.setAttribute('data-task-id', task.id);
    taskDelete.addEventListener('click', (e) => {
        e.preventDefault(); 
        deleteTask(task.id);
    });

    taskElement.appendChild(priorityFlag)
    taskElement.appendChild(taskCheckbox)
    taskElement.appendChild(taskName);
    taskElement.appendChild(taskDetails);
    taskElement.appendChild(taskDate);
    taskElement.appendChild(taskEdit);
    taskElement.appendChild(taskDelete);

    document.getElementById('task-container').appendChild(taskElement);
}



function deleteTask(taskId) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch(`/delete_task/${taskId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        }
    })
    .then(response => {
        if (response.ok) {
            document.getElementById(`task-${taskId}`).remove();
            console.log('Task deleted successfully');
        } else {
            console.error('Failed to delete task');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    })
}


function toggleNewTaskPopup() {
    document.getElementById("popup-new").classList.toggle("active");
}


function homeCount() {
    const homeCount = document.querySelectorAll('.task');
    const count = homeCount.length;

    const projectCount = document.getElementById('project-count');
    projectCount.textContent = count
    return count.textContent;
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const suffix = (day === 1 || day === 21 || day === 31) ? 'st' :
                   (day === 2 || day === 22) ? 'nd' :
                   (day === 3 || day === 23) ? 'rd' : 'th';
    return `${month} ${day}${suffix}`;
}



const priorityBtns = document.querySelectorAll('.create-priority-btn');
priorityBtns.forEach(btn =>
    btn.addEventListener('click', e => 
        activePriority(e)))


function activePriority(e) {
    removeActivePriority();
    const priority = e.target.textContent.toLowerCase();
    e.target.classList.add(`create-priority-btn--${priority}-active`);
}


function removeActivePriority() {
    const Btns = document.querySelectorAll('.create-priority-btn')
        Btns.forEach(btn => {
            btn.classList.remove(`create-priority-btn--${btn.textContent.toLowerCase()}-active`)
        })
}

