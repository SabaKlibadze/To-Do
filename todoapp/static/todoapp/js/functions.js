

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



function addTaskToList(task) {
    const taskContainer = document.getElementById('task-container');
    
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.setAttribute('id', `task-${task.id}`);
    taskElement.setAttribute('due-date', task.due_date);

    const priorityFlag = document.createElement('div');
    priorityFlag.classList.add('flag')
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
    TodayTasksClass(taskElement, `${task.due_date}`);
    WeekTasksClass(taskElement, `${task.due_date}`);
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

    taskEdit.addEventListener('click', (e) => {
        e.preventDefault();
        editTask(`${task.id}`)
        toggleTaskEditPopup();
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
    toggleNewTaskPopup()});

// Close popup if clicked outside of box
const createNewTaskOverlay = document.getElementById('overlay');
createNewTaskOverlay.addEventListener('click', (e) => {
    if (e.target === createNewTaskOverlay) {
        toggleNewTaskPopup();
    }
})


// Create new task
document.getElementById('create-new').addEventListener('submit', (e) => {
    e.preventDefault(); createTask(); toggleNewTaskPopup()});


function toggleNewTaskPopup() {
    document.getElementById("overlay").classList.toggle("hidden");
    document.getElementById("create-new").classList.toggle("active");
}


function homeCount() {
    const tasks = document.querySelectorAll('.task');
    const taskscount = tasks.length;
    const homeCount = document.getElementById('home-count');
    if (taskscount == 0) {
        homeCount.textContent = 0;
    } else {
        homeCount.textContent = taskscount;
    }

    const todayCount = document.getElementById('today-count');
    const weekCount = document.getElementById('week-count');
    let today = 0;
    let week = 0;
    tasks.forEach(task => {
        if (task.classList.contains('today')) {
            today += 1;
        }
        else if (task.classList.contains('week')) {
            week += 1;
        }
    })
    todayCount.textContent = today;
    weekCount.textContent = today + week;
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
    const radioBtns = document.querySelectorAll('input[type="radio"]');
        radioBtns.forEach(btn => {
            btn.checked = false
        })
}



function createTask() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
     
    const newTaskName = document.getElementById('create-new__name');
    const newTaskDetails = document.getElementById('create-new__details');
    const priorityFlag = document.querySelector('input[name="create-priority"]:checked').value;
    const dueDate = document.getElementById('create-new-date__duedate');
    
    const taskData = {
        title: newTaskName.value,
        details: newTaskDetails.value,
        priority: priorityFlag,
        due_date: dueDate.value,
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
            dueDate.value = '';
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
        detailsModel.querySelector('.details-popup__details').textContent = data.details;
        detailsModel.querySelector('.details-popup__priority-value').textContent = data.priority;
        detailsModel.querySelector('.details-popup__priority-value').classList.add(`DPPV-${data.priority}`);
        detailsModel.querySelector('.details-popup__duedate-value').textContent = formatDate(data.due_date);
    })
    .catch((error) => {
        console.error('Error:', error)
    })
}

const taskDetilsCloseBtn = document.getElementById('details-popup__close-btn');
taskDetilsCloseBtn.addEventListener('click', () => {
    removeDetailsPriorityClasslist();
    toggleTaskDetailsPopup();
});

const detailsOverlay = document.getElementById('details-popup__overlay');
detailsOverlay.addEventListener('click', (e) => {
    if (e.target === detailsOverlay) {
        removeDetailsPriorityClasslist();
        toggleTaskDetailsPopup();
    }
})

function removeDetailsPriorityClasslist() {
    const priorityClass = document.querySelector('.details-popup__priority-value');
    const secondClass = priorityClass.classList[1];
    priorityClass.classList.remove(secondClass);
}

function toggleTaskDetailsPopup() {
    document.querySelector(".details-popup__container").classList.toggle("active");
    document.getElementById("details-popup__overlay").classList.toggle("hidden");
}



function editTask(taskId) {
    fetch(`get_task_details/${taskId}/`)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Task not found!');
            return
        }

        removeActivePriority();

        const editModal = document.getElementById('edit-popup__content');
        editModal.querySelector('#edit-popup__name').value = data.title;
        editModal.querySelector('#edit-popup__details').value = data.details;
        editModal.querySelector('#edit-popup__date-duedate').value = data.due_date;
        const priorityBtns = editModal.querySelectorAll('input[type="radio"]');
        priorityBtns.forEach(btn => {
            const btnValue = btn.value; 
            const BtnLabel = editModal.querySelector(`.create-priority-btn--${btnValue}`)
            if (btnValue === data.priority) {
                btn.checked = true;
                BtnLabel.classList.add(`create-priority-btn--${btnValue}-active`);
            }

        const confirmEditBtn = editModal.querySelector('#edit-popup__submit');

        // Remove existing event listener to avoid multiple bindings
        confirmEditBtn.replaceWith(confirmEditBtn.cloneNode(true));

        editModal.querySelector('.edit-popup__submit').addEventListener('click', (e) => {
            e.preventDefault();
            updateTask(`${taskId}`);
        })
        })
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


function updateTask(taskId) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const updatedTask = document.getElementById('edit-popup__content');
    const updatedTitle = updatedTask.querySelector('#edit-popup__name').value;
    const updatedDetails = updatedTask.querySelector('#edit-popup__details').value
    const updatedDuedate = updatedTask.querySelector('#edit-popup__date-duedate').value;
    const updatedPriority = updatedTask.querySelector('input[name="create-priority"]:checked').value

    const updatedData = {
        title: updatedTitle,
        details: updatedDetails,
        due_date: updatedDuedate,
        priority: updatedPriority,
    }

    fetch(`/update_task/${taskId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        if(response.ok) {
            updateTaskUI(taskId, updatedTitle, updatedDuedate, updatedPriority);
            toggleTaskEditPopup();
        } else {
            console.error('Failed to delete task');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    })
}

function  updateTaskUI(taskId, updatedTitle, updatedDuedate, updatedPriority) {
    const editedTask = document.getElementById(`task-${taskId}`);
    editedTask.querySelector('.task-name').textContent = updatedTitle;
    editedTask.querySelector('.task-date').textContent = formatDate(updatedDuedate);
    priorityFlag = editedTask.querySelector('.flag');

    // Remove old priority
    priorityFlag.classList.remove(priorityFlag.classList[1]);

    //Add new priority
    priorityFlag.classList.add(`priority-flag-${updatedPriority}`);
}



const taskEditCloseBtn = document.getElementById('edit-popup__close-btn');
taskEditCloseBtn.addEventListener('click', () => {
    toggleTaskEditPopup();
});

const editOverlay = document.getElementById('edit-popup__overlay');
editOverlay.addEventListener('click', (e) => {
    if (e.target === editOverlay) {
        toggleTaskEditPopup();
    }
})

function toggleTaskEditPopup() {
    document.getElementById("edit-popup__container").classList.toggle("active");
    document.getElementById("edit-popup__overlay").classList.toggle("hidden");
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

            // Task count delay
            const delay = (milliseconds) => {
                return new Promise(resolve => setTimeout(resolve, milliseconds))
            }
            delay(50).then(() => homeCount());
        })
    })
    .catch((error) => {
        console.error('Error:', error)
    })
}


const deletePopupOverlay = document.getElementById('delete-popup__overlay');
deletePopupOverlay.addEventListener('click', (e) => {
    if (e.target === deletePopupOverlay) {
        toggleDeletePopup();
    }
})

document.getElementById('delete-popup__cancel').addEventListener('click', (e) => {
    e.preventDefault();
    toggleDeletePopup();
})

function toggleDeletePopup() {
    document.getElementById("delete-popup__container").classList.toggle("active");
    document.getElementById("delete-popup__overlay").classList.toggle("hidden");
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



    //Home. Today, Week selecter
const homeTodayWeek = document.querySelectorAll('.home-today-week');
homeTodayWeek.forEach(option => {
    option.addEventListener('click', () => {
        homeTodayWeek.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    })
})


    //Home tasks
function showHomeTasks() {
    const tasks = document.querySelectorAll('.task')

    tasks.forEach(task => {
        task.style.display = 'flex';
    });
}

document.getElementById('project-home').addEventListener('click', () =>
    showHomeTasks());


    //today tasks
function TodayTasksClass(taskElement, taskDueDate) {
    const today = new Date().toISOString().split('T')[0];
    if (taskDueDate === today) {
        taskElement.classList.add('today');
    }
}

function showTodayTasks() {
    const tasks = document.querySelectorAll('.task');

    tasks.forEach(task => {
        if (task.classList.contains('today')) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    })
}

document.getElementById('project-today').addEventListener('click', () =>
    showTodayTasks());


    //Week tasks
function WeekTasksClass(taskElement, taskDueDate) {
    const today = new Date();
    const dayOfWeek = today.getDay(); 

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const DueDate = new Date(taskDueDate);
 
    if (DueDate >= startOfWeek && DueDate <= endOfWeek) {
        taskElement.classList.add('week'); 
    }
}

function showWeekTasks() {
    const tasks = document.querySelectorAll('.task');

    tasks.forEach(task => {
        if (task.classList.contains('week')) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    })
}

document.getElementById('project-week').addEventListener('click', () =>
    showWeekTasks());