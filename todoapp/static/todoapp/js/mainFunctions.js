
export const domManager = (function () {

    let csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    function updateCSRFToken() {
        fetch('/get_new_csrf_token/') 
        .then(response => response.json())
        .then(data => {
            if (data.csrfToken) {
                csrfToken = data.csrfToken;
            }
            return csrfToken;
        })
        .catch(error => {
            console.error('Error updating CSRF token:', error);
        });
    }


    function getCSRFToken() {
        return csrfToken;
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

        const categoryN1Count = document.getElementById('project-n1-count');
        const categoryN2Count = document.getElementById('project-n2-count');
        const categoryN3Count = document.getElementById('project-n3-count');
        let n1Count = 0;
        let n2Count = 0;
        let n3Count = 0;
        tasks.forEach(task => {
            if (task.classList.contains('project-n1')) {
                n1Count += 1;
            } else if (task.classList.contains('project-n2')) {
                n2Count += 1;
            } else if (task.classList.contains('project-n3')) {
                n3Count += 1;
            }
        })
        categoryN1Count.textContent = n1Count;
        categoryN2Count.textContent = n2Count;
        categoryN3Count.textContent = n3Count;
    }


    function showHomeTasks() {
        const tasks = document.querySelectorAll('.task')

        tasks.forEach(task => {
            task.style.display = 'flex';
        });
    }


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


    function getProjectNames(projectN1, projectN2, projectN3) {
        document.getElementById('project-n1').textContent = projectN1;
        document.getElementById('add-project-n1').textContent = projectN1;
        document.getElementById('project-n2').textContent = projectN2;
        document.getElementById('add-project-n2').textContent = projectN2;
        document.getElementById('project-n3').textContent = projectN3;
        document.getElementById('add-project-n3').textContent = projectN3;
    }


    function showProjectN1() {
        const tasks = document.querySelectorAll('.task');

        tasks.forEach(task => {
            if (task.classList.contains('project-n1')) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        })
    }

    function showProjectN2() {
        const tasks = document.querySelectorAll('.task');

        tasks.forEach(task => {
            if (task.classList.contains('project-n2')) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        })
    }

    function showProjectN3() {
        const tasks = document.querySelectorAll('.task');

        tasks.forEach(task => {
            if (task.classList.contains('project-n3')) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        })
    }


    function clearTasks() {
        const taskContainer = document.getElementById('task-container');
        taskContainer.innerHTML = '';
    }


    function hideNotes(taskContainer, notesContainer) {
        taskContainer.style.display = 'block';
        notesContainer.style.display = 'none';
    }


    const duedateAtribute = document.querySelector('.create-new-date');
    const priorityAtribute = document.querySelector('.create-new-priority');
    const addBtnContainer = document.querySelector('.create-new-priority-and-submit');
    const addTaskBtn = document.getElementById('new-task-submit');
    const addNoteBtn = document.getElementById('new-note-submit');

    function hideAddTaskAtributes() {
        duedateAtribute.style.display = 'none';
        priorityAtribute.style.display = 'none';
        addBtnContainer.style.justifyContent = 'flex-end';
        addTaskBtn.style.display = 'none';
        addNoteBtn.style.display = 'block';
    }

    function showAddTaskAtributes() {
        duedateAtribute.style.display = 'flex';
        priorityAtribute.style.display = 'flex';
        addBtnContainer.style.justifyContent = 'space-between';
        addTaskBtn.style.display = 'block';
        addNoteBtn.style.display = 'none';
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



    function toggleNewTaskPopup() {
        document.getElementById("create-new").classList.toggle("active");
        document.getElementById("overlay").classList.toggle("hidden");
    }


    function toggleTaskDetailsPopup() {
        document.querySelector(".details-popup__container").classList.toggle("active");
        document.getElementById("details-popup__overlay").classList.toggle("hidden");
    }


    function toggleTaskEditPopup() {
        document.getElementById("edit-popup__container").classList.toggle("active");
        document.getElementById("edit-popup__overlay").classList.toggle("hidden");
    }


    function toggleDeletePopup() {
        document.getElementById("delete-popup__container").classList.toggle("active");
        document.getElementById("delete-popup__overlay").classList.toggle("hidden");
    }

    function toggleRenamePopup() {
        document.getElementById('rename-popup__container').classList.toggle('active');
        document.getElementById('rename-popup__overlay').classList.toggle('hidden');
    }


    function toggleSignInPopup() {
        document.getElementById('create-user__container').classList.toggle('open');
        document.getElementById('create-user__overlay').classList.toggle('hidden');
    }

    return {
        updateCSRFToken,
        getCSRFToken,
        homeCount,
        showHomeTasks,
        TodayTasksClass,
        showTodayTasks,
        WeekTasksClass,
        showWeekTasks,
        getProjectNames,
        showProjectN1,
        showProjectN2,
        showProjectN3,
        clearTasks,
        hideNotes,
        hideAddTaskAtributes,
        showAddTaskAtributes,
        formatDate,
        toggleNewTaskPopup,
        toggleTaskDetailsPopup,
        toggleTaskEditPopup,
        toggleDeletePopup,
        toggleRenamePopup,
        toggleSignInPopup,
    }

})();



export const taskManager = (function () {

    function getTasks(username) {
        // console.log(username);
        fetch('/get_tasks/')
            .then(response => response.json())
            .then(data => {
                    data.forEach(task => {
                        addTaskToList(task, username);
                    })
                    if (username !== undefined) {
                        const signInBtn = document.getElementById('sign-in__home-btn');
                        const displayUsername = document.getElementById('username-box');
                        displayUsername.classList.toggle('hidden');
                        signInBtn.classList.toggle('hidden');
                        document.getElementById('show-username').textContent = username;
                        domManager.homeCount();
                        }
            })    
        .catch(error => console.error('Error:', error));
    };



    function addTaskToList(task, user) {
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
        domManager.TodayTasksClass(taskElement, `${task.due_date}`);
        domManager.WeekTasksClass(taskElement, `${task.due_date}`);
        taskDate.textContent = domManager.formatDate(task.due_date);

        const taskEdit = document.createElement('button');
        taskEdit.classList.add('task-edit');

        const taskDelete = document.createElement('button');
        taskDelete.classList.add('task-delete');

        taskCheckbox.addEventListener('click', () => {
            taskChecker(taskElement, taskCheckbox, taskName, taskDetailsBtn, taskDate);
            if (user !== undefined) {
                toggleTaskCompletion(`${task.id}`);
            }
        })

        taskDetailsBtn.addEventListener('click', () => {
            showTaskDetails(`${task.id}`);
            domManager.toggleTaskDetailsPopup();
        })

        taskEdit.addEventListener('click', (e) => {
            e.preventDefault();
            editTask(`${task.id}`, user)
            domManager.toggleTaskEditPopup();
        })

        taskDelete.addEventListener('click', (e) => {
            e.preventDefault(); 
            deleteConfirmation(`${task.id}`, user);
        })

        if (task.project != null) {
            taskElement.classList.add(`${task.project}`);
        }

        if (task.completed) {
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

        domManager.homeCount();
    }



    function createTask() {
        const newTaskName = document.getElementById('create-new__name');
        const newTaskDetails = document.getElementById('create-new__details');
        const priorityFlag = document.querySelector('input[name="create-priority"]:checked').value;
        const dueDate = document.getElementById('create-new-date__duedate');
        const projects = document.querySelectorAll('.add-project');
        let projectTemplate = '';
        projects.forEach(e => {
            if (e.classList.contains('selected')) {
                projectTemplate = e.classList[1];
            } 
        });
        
        const taskData = {
            title: newTaskName.value,
            details: newTaskDetails.value,
            priority: priorityFlag,
            due_date: dueDate.value,
            project_template: projectTemplate,
            completed: false,
        };

        fetch('/add_task/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': domManager.getCSRFToken()
            },
            body: JSON.stringify(taskData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                addTaskToList(data.task, data.user);
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
            detailsModel.querySelector('.details-popup__duedate-value').textContent = domManager.formatDate(data.due_date);
            const completedMark = document.getElementById('completed-mark');
            if (data.completed) {
                completedMark.classList.add('completed');
            } else {
                completedMark.classList.remove('completed');
            }
        })
        .catch((error) => {
            console.error('Error:', error)
        })
    }



    function editTask(taskId, user) {
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
            })

            const confirmEditBtn = editModal.querySelector('#edit-popup__submit');

            // Remove existing event listener to avoid multiple bindings
            confirmEditBtn.replaceWith(confirmEditBtn.cloneNode(true));


            editModal.querySelector('.edit-popup__submit').addEventListener('click', (e) => {
                e.preventDefault();
                if (user === undefined) {
                    domManager.toggleSignInPopup();
                    domManager.toggleTaskEditPopup();
                } else {
                    updateTask(`${taskId}`);
                }
            })
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }



    function updateTask(taskId) {
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
                'X-CSRFToken': domManager.getCSRFToken()
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if(response.ok) {
                updateTaskUI(taskId, updatedTitle, updatedDuedate, updatedPriority);
                domManager.toggleTaskEditPopup();
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
        editedTask.querySelector('.task-date').textContent = domManager.formatDate(updatedDuedate);
        const priorityFlag = editedTask.querySelector('.flag');

        // Remove old priority
        priorityFlag.classList.remove(priorityFlag.classList[1]);

        //Add new priority
        priorityFlag.classList.add(`priority-flag-${updatedPriority}`);
    }



    function deleteConfirmation(taskId, user) {
        fetch(`get_task_details/${taskId}/`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Task not found!');
                return
            }

            const deleteModal = document.getElementById('delete-popup__container');
            deleteModal.querySelector('.delete-popup__task-title').textContent = data.title;

            domManager.toggleDeletePopup();

            const deleteButton = deleteModal.querySelector('.delete-popup__yes');

            // Remove existing event listener to avoid multiple bindings
            deleteButton.replaceWith(deleteButton.cloneNode(true));

            deleteModal.querySelector('.delete-popup__yes').addEventListener('click', (e) => {
                e.preventDefault();

                if (user === undefined) {
                    domManager.toggleSignInPopup();
                    domManager.toggleDeletePopup();
                } else {
                    deleteTask(`${taskId}`);
                    domManager.toggleDeletePopup();

                    // Task count delay
                    const delay = (milliseconds) => {
                        return new Promise(resolve => setTimeout(resolve, milliseconds))
                    }
                    delay(100).then(() => domManager.homeCount());
                }
            })
        })
        .catch((error) => {
            console.error('Error:', error)
        })
    }



    function deleteTask(taskId) {
        fetch(`/delete_task/${taskId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': domManager.getCSRFToken()
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



    function toggleTaskCompletion(taskId) {
        const checkboxElement = document.getElementById(`task${taskId}-checkbox`)

        fetch(`/toggle_task_completion/${taskId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': domManager.getCSRFToken()
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



    function removeDetailsPriorityClasslist() {
        const priorityClass = document.querySelector('.details-popup__priority-value');
        const secondClass = priorityClass.classList[1];
        priorityClass.classList.remove(secondClass);
    }

    return {
        getTasks,
        addTaskToList,
        createTask,
        showTaskDetails,
        editTask,
        updateTask,
        updateTaskUI,
        deleteConfirmation,
        deleteTask,
        toggleTaskCompletion,
        taskChecker,
        activePriority,
        removeActivePriority,
        removeDetailsPriorityClasslist,
    }

})();



export const notesManager = (function () {

    let notesData = '';

    function createNote(screenWidth) {
        const noteTitle = document.getElementById('create-new__name');
        const noteDetails = document.getElementById('create-new__details');

        const noteData = {
            title: noteTitle.value,
            details: noteDetails.value,
        }

        fetch('/add_note/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': domManager.getCSRFToken()
            },
            body: JSON.stringify(noteData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                getNotes(screenWidth);
                domManager.toggleNewTaskPopup();
                noteTitle.value = '';
                noteDetails.value = '';
            } else {
                console.error('Failed to add note:', data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }


    function getNotes(screenWidth) {
        fetch('/get_notes/')
        .then(response => response.json())
        .then(data => {
            notesData = data;
            distributeNotes(screenWidth);
        })
        .catch(error => console.error('Error:', error));
    }


    function distributeNotes(screenWidth) {
        const column1 = document.getElementById('column-1');
        const column2 = document.getElementById('column-2');
        const column3 = document.getElementById('column-3');
        column1.innerHTML = '';
        column2.innerHTML = '';
        column3.innerHTML = '';

        notesData.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.setAttribute('id', `note-${note.id}`);

            const noteDelete = document.createElement('div');
            noteDelete.classList.add('delete-note');
            noteDelete.innerHTML = '&times;';

            const noteTitle = document.createElement('h4');
            noteTitle.classList.add('note-title');
            noteTitle.textContent = note.title;
    
            const noteDetails = document.createElement('p');
            noteDetails.classList.add('note-details');
            noteDetails.textContent = note.details;

            noteDelete.addEventListener('click', () => {
                if (note.user === undefined) {
                    domManager.toggleSignInPopup();
                } else {
                deleteNote(screenWidth, note.id);
                }
            });

            noteElement.appendChild(noteDelete);
            noteElement.appendChild(noteTitle);
            noteElement.appendChild(noteDetails);

            if (screenWidth > 768) {
                if (index % 3 === 0) {
                    column1.appendChild (noteElement);
                } else if (index % 3 === 1) {
                    column2.appendChild (noteElement);
                } else {
                    column3.appendChild (noteElement);
                }
            } else {
                if (index % 2 === 0) {
                    column1.appendChild(noteElement);
                } else {
                    column2.appendChild(noteElement);
                }
            }
        })
    }


    function deleteNote(screenWidth, noteId) {
        fetch(`/delete_note/${noteId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': domManager.getCSRFToken()
            }
        })
        .then(response => {
            if (response.ok) {
                getNotes(screenWidth);
                console.log('Note deleted successfully');
            } else {
                console.error('Failed to delete note');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        })
    }

    return {
        createNote,
        getNotes,
        distributeNotes,
        deleteNote,
    }

})();