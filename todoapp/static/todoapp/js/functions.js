

document.addEventListener('DOMContentLoaded', function() {
    fetch('/get_tasks/')
        .then(response => response.json())
        .then(data => {
            data.forEach(task => {
                addTaskToList(task);
            })
        homeCount()
        })    
        .catch(error => console.error('Error:', error));
});



const homeTodayWeek = document.querySelectorAll('.home-today-week');
homeTodayWeek.forEach(option => {
    option.addEventListener('click', () => {
        homeTodayWeek.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    })
})



function addTaskToList(task) {
    const taskContainer = document.getElementById('task-container');
    
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.setAttribute('id', `task-${task.id}`)

    const priorityFlag = document.createElement('div');
    priorityFlag.classList.add(`priority-flag-${task.priority}`);

    const taskCheckbox = document.createElement('span');
    taskCheckbox.classList.add('task-checkbox');
    taskCheckbox.setAttribute('id', `task${task.id}-checkbox`);

    const taskName = document.createElement('span');
    taskName.classList.add('task-name');
    taskName.textContent = task.title;

    const taskDetailsBtn = document.createElement('div');
    taskDetailsBtn.setAttribute('type', 'button');
    taskDetailsBtn.classList.add('task-details-btn');
    taskDetailsBtn.setAttribute('id', 'task-details-btn');
    taskDetailsBtn.textContent = 'DETAILS';

    const taskDate = document.createElement('span');
    taskDate.classList.add('task-date');
    taskDate.textContent = formatDate(task.due_date);

    const taskEdit = document.createElement('button');
    taskEdit.classList.add('task-edit');

    const taskDelete = document.createElement('button');
    taskDelete.classList.add('task-delete');

    taskCheckbox.addEventListener('click', () => {;
        taskChecker(taskElement, taskCheckbox, taskName, taskDetailsBtn, taskDate);
        toggleTaskCompletion(`${task.id}`);
    })

    taskDetailsBtn.addEventListener('click', () => {
        toggleTaskDetailsPopup();
        showTaskDetails(`${task.id}`);
    })

    taskDelete.addEventListener('click', (e) => {
        e.preventDefault(); 
        deleteConfirmation(`${task.id}`);
    })

    if (`${task.completed}` === 'true') {
        taskElement.classList.add('task-checked');
        taskCheckbox.classList.add('task-checkbox-checked');
        taskName.classList.add('task-name-checked');
        taskDetailsBtn.classList.add('task-details-checked');
        taskDate.classList.add('task-date-checked');
    }

    taskElement.appendChild(priorityFlag)
    taskElement.appendChild(taskCheckbox)
    taskElement.appendChild(taskName);
    taskElement.appendChild(taskDetailsBtn);
    taskElement.appendChild(taskDate);
    taskElement.appendChild(taskEdit);
    taskElement.appendChild(taskDelete);

    taskContainer.appendChild(taskElement);

    homeCount();
}



// New task popup
const  createNewTaskBTN= document.getElementById('create-new-task-btn')
createNewTaskBTN.addEventListener('click', () => {
    toggleNewTaskPopup(); removeActivePriority()});

// Close new task popup
const createNewTaskCloseBtn = document.querySelector('.create-new__close-btn')
createNewTaskCloseBtn.addEventListener('click', () => {
    toggleNewTaskPopup(); removeActivePriority()});

// Create new task
document.getElementById('create-new').addEventListener('submit', (e) => {
    e.preventDefault(); createTask(); toggleNewTaskPopup()});


function createTask() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
     
    const newTaskName = document.getElementById('create-new__name');
    const newTaskDetails = document.getElementById('create-new__details');
    const priorityFlag = document.querySelector('input[name="create-priority"]:checked').value;
    const dueDate = document.getElementById('create-new-date__duedate').value;
    
    const taskData = {
        title: newTaskName.value,
        details: newTaskDetails.value,
        priority: priorityFlag,
        due_date: dueDate,
        completed: false,
    };

    fetch('/add_task/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            addTaskToList(data.task);
            newTaskName.value = '';
            newTaskDetails.value = '';
        } else {
            console.error('Failed to add task:', data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}   



function showTaskDetails(taskId) {
    fetch(`get_task_details/${taskId}/`)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Task not found!');
            return
        }
        const detailsModel = document.getElementById('details-popup__content');
        detailsModel.querySelector('.details-popup__title').textContent = data.title;
        detailsModel.querySelector('.details-popup__details-value').textContent = data.details;
        detailsModel.querySelector('.details-popup__priority-value').textContent = data.priority;
        detailsModel.querySelector('.details-popup__priority-value').classList.add(`DPPV-${data.priority}`);
        detailsModel.querySelector('.details-popup__duedate-value').textContent = formatDate(data.due_date);
    })
    .catch((error) => {
        console.error('Error:', error)
    })
}

const taskDetilsCloseBtn = document.querySelector('.details-popup__close-btn');
taskDetilsCloseBtn.addEventListener('click', () => {
    removeDetailsPriorityClasslist();
    toggleTaskDetailsPopup();
});

function removeDetailsPriorityClasslist() {
    const priorityClass = document.querySelector('.details-popup__priority-value');
    const secondClass = priorityClass.classList[1];
    priorityClass.classList.remove(secondClass);
}

function toggleTaskDetailsPopup() {
    document.getElementById("details-popup").classList.toggle("active");
}


function toggleTaskCompletion(taskId) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const checkboxElement = document.getElementById(`task${taskId}-checkbox`)

    fetch(`/toggle_task_completion/${taskId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({
            completed: checkboxElement.classList.contains('task-checkbox-checked') 
        })
    })
    .then(response => response.json())
}


function taskChecker(task, taskCheckbox, taskName, taskDetails, taskDate) {
    task.classList.toggle('task-checked');
    taskCheckbox.classList.toggle('task-checkbox-checked');
    taskName.classList.toggle('task-name-checked');
    taskDetails.classList.toggle('task-details-checked');
    taskDate.classList.toggle('task-date-checked');
}


function deleteConfirmation(taskId) {
    fetch(`get_task_details/${taskId}/`)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Task not found!');
            return
        }

        const deleteModal = document.getElementById('delete-popup__container');
        deleteModal.querySelector('.delete-popup__task-title').textContent = data.title;

        toggleDeletePopup();

        const deleteButton = deleteModal.querySelector('.delete-popup__yes');

        // Remove existing event listener to avoid multiple bindings
        deleteButton.replaceWith(deleteButton.cloneNode(true));

        deleteModal.querySelector('.delete-popup__yes').addEventListener('click', (e) => {
            e.preventDefault();
            toggleDeletePopup();
            deleteTask(`${taskId}`);
        })
    })
    .catch((error) => {
        console.error('Error:', error)
    })
}

function toggleDeletePopup() {
    document.getElementById("delete-popup").classList.toggle("active");
}

document.querySelector('.delete-popup__no').addEventListener('click', (e) => {
    e.preventDefault();
    toggleDeletePopup();
})



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

