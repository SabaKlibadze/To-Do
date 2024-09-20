import { domManager, taskManager } from "./mainFunctions.js"


const signInBtn = document.getElementById('sign-in__home-btn');

const displayUsername = document.getElementById('username-box');

const createNewTaskCloseBtn = document.querySelector('.create-new__close-btn')

const createNewTaskOverlay = document.getElementById('overlay');

const createNew = document.getElementById('create-new');

const priorityBtns = document.querySelectorAll('.create-priority-btn');

const taskDetilsCloseBtn = document.getElementById('details-popup__close-btn');

const detailsOverlay = document.getElementById('details-popup__overlay');

const taskEditCloseBtn = document.getElementById('edit-popup__close-btn');

const editOverlay = document.getElementById('edit-popup__overlay');

const deletePopupOverlay = document.getElementById('delete-popup__overlay');

const deleteCancel = document.getElementById('delete-popup__cancel');

const homeTodayWeek = document.querySelectorAll('.home-today-week');

const projectHome = document.getElementById('project-home');

const projectToday = document.getElementById('project-today');

const projectWeek = document.getElementById('project-week');

const sidebar = document.getElementById('side_bar');

const menuCheckbox = document.getElementById('menu_checkbox');

const signInPopupOverlay = document.getElementById('create-user__overlay');

const container = document.getElementById('create-user__container');

const registerBtn = document.getElementById('register');

const loginBtn = document.getElementById('login');

const registerForm = document.getElementById('register-form');

const loginForm = document.getElementById('login-form');

const logoutBtn = document.getElementById('logout-btn');

const eyeicon = document.getElementById('password-eye');



document.addEventListener('DOMContentLoaded', () => {
    fetch('/check_user_status/')
    .then(response => response.json())
    .then(data => {
        if (data.is_authenticated) {
            loggedUserListeners();
            taskManager.getTasks(data.username);

        } else {
            guessListeners();
            taskManager.getTasks();
            domManager.homeCount();
        }
    })
})



function createUser(username, email, password1, password2) {
    const csrfToken = domManager.getCSRFToken();

    const userData = {
        username: username,
        email: email,
        password1: password1,
        password2: password2,
    }

    fetch('/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            userLogin(email, password1)
            domManager.clearTasks();
            console.log('Registration successful');
        } else {
            console.error('Registration failed:', data.errors);
        }
    })
    .catch(error => console.error('Error:', error));
}



function userLogin(email, pass) {
    const csrfToken = domManager.getCSRFToken();

    let emailElement = document.getElementById('login-email');
    let passwordElement = document.getElementById('login-password');
    let errorElement = document.getElementById('sign-in-error');
    errorElement.textContent = '';

    if (email !== undefined && pass !== undefined) {
        emailElement.value = email;
        passwordElement.value = pass;
    }
    fetch('/user_login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({
            email: emailElement.value.toLowerCase(),
            password: passwordElement.value,
        })
    }) 
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loggedUserListeners();
            domManager.clearTasks();
            domManager.updateCSRFToken();
            domManager.toggleSignInPopup();
            taskManager.getTasks(data.username);
            emailElement.value = '';
            passwordElement.value = '';
            console.log('Login successful');
        } else {
            errorElement.textContent = 'Wrong email or password';
            console.error('Login failed:', data.error);
        }
    })
}



function userLogout() {
    const csrfToken = domManager.getCSRFToken();

    fetch('/user_logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            guessListeners();
            domManager.clearTasks();
            taskManager.getTasks();
            domManager.homeCount();
            domManager.updateCSRFToken();
            displayUsername.classList.toggle('hidden');
            signInBtn.classList.toggle('hidden');
            console.log('logout successful');
        } else {
            console.error('Error logging out:', data.error);
        }
    })
}



function setError(element, message) {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
}


function setSuccess(element) {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error')
}


function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


function validateInputs() {
    const username = document.getElementById('create-username');
    const email = document.getElementById('create-email');
    const password1 = document.getElementById('create-password1');
    const password2 = document.getElementById('create-password2');

    const usernameValue = username.value.trim();
    const emailValue = email.value.toLowerCase().trim();
    const password1Value = password1.value.trim();
    const password2Value = password2.value.trim();

    let successInputs = 0;

    fetch('/validate_user/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': domManager.getCSRFToken()
        },
        body: JSON.stringify({
            username: usernameValue,
            email: emailValue,
            password: password1Value,
        })
    })
    .then(response => response.json())
    .then(data => {
        if (usernameValue.length < 3) {
            setError(username, 'Username must be at least 3 character.');
        } else if (data.username == true) {
            setError(username, 'Username already exists.');
        } else {
            setSuccess(username);
            successInputs += 1;
        }

        if (emailValue === '') {
            setError(email, 'Email is required.');
        } else if (!isValidEmail(emailValue)) {
            setError(email, 'Provide a valid email address.');
        } else if (data.email == true) {
            setError(email, 'Email already exists.');
        } else {
            setSuccess(email);
            successInputs += 1;
        }

        if (password1Value.length < 8) {
            setError(password1, 'Password must be at least 8 character.');
        } else if (data.password == true) {
            setError(password1, ("Error: ", data.error[0]));
        } else {
            setSuccess(password1);
            successInputs += 1;
        }
    }) 

    if (password2Value === '') {
        setError(password2, 'Please confirm your password.');
    } else if (password2Value !== password1Value) {
        setError(password2, "Passwords doesn't match.");
    } else {
        setSuccess(password2);
        successInputs += 1;
    }

    const delay = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    delay(300).then(() => {
        if (successInputs == 4) {    
            createUser(usernameValue, emailValue, password1Value, password2Value);
            username.value = '';
            email.value = '';
            password1.value = '';
            password2.value = '';
        }
    })
}


function showPassword() {
    let password = document.getElementById('login-password');

    if(password.type == 'password') {
        password.type = 'text';
        eyeicon.src = '../static/todoapp/images/eye.png';
    } else {
        password.type = 'password';
        eyeicon.src = '../static/todoapp/images/eye-slash.png';
    }
}



function guessListeners() {
    const createNewTaskBTN = document.getElementById('create-new-task-btn');
    createNewTaskBTN.replaceWith(createNewTaskBTN.cloneNode(true));

    document.getElementById('create-new-task-btn').addEventListener('click', () => {
        domManager.toggleSignInPopup();
    });
}


function loggedUserListeners() {
    const createNewTaskBTN = document.getElementById('create-new-task-btn');
    createNewTaskBTN.replaceWith(createNewTaskBTN.cloneNode(true));

    document.getElementById('create-new-task-btn').addEventListener('click', () => {
        domManager.toggleNewTaskPopup();
        taskManager.removeActivePriority();
    });
}


createNewTaskCloseBtn.addEventListener('click', () => {
    domManager.toggleNewTaskPopup();
});

createNewTaskOverlay.addEventListener('click', (e) => {
    if (e.target === createNewTaskOverlay) {
        domManager.toggleNewTaskPopup();
    }
});

createNew.addEventListener('submit', (e) => {
    e.preventDefault();
    taskManager.createTask();
    domManager.toggleNewTaskPopup();
});

priorityBtns.forEach(btn =>
    btn.addEventListener('click', e => 
        taskManager.activePriority(e))
);

taskDetilsCloseBtn.addEventListener('click', () => {
    taskManager.removeDetailsPriorityClasslist();
    domManager.toggleTaskDetailsPopup();
});

detailsOverlay.addEventListener('click', (e) => {
    if (e.target === detailsOverlay) {
        taskManager.removeDetailsPriorityClasslist();
        domManager.toggleTaskDetailsPopup();
    }
});

taskEditCloseBtn.addEventListener('click', () => {
    domManager.toggleTaskEditPopup();
});

editOverlay.addEventListener('click', (e) => {
    if (e.target === editOverlay) {
        domManager.toggleTaskEditPopup();
    }
});

deletePopupOverlay.addEventListener('click', (e) => {
    if (e.target === deletePopupOverlay) {
        domManager.toggleDeletePopup();
    }
});

deleteCancel.addEventListener('click', (e) => {
    e.preventDefault();
    domManager.toggleDeletePopup();
});

homeTodayWeek.forEach(option => {
    option.addEventListener('click', () => {
        homeTodayWeek.forEach(opt => 
            opt.classList.remove('selected'));
        option.classList.add('selected');
    })
});

projectHome.addEventListener('click', () => {
    domManager.showHomeTasks();
});

projectToday.addEventListener('click', () => {
    domManager.showTodayTasks();
});

projectWeek.addEventListener('click', () => {
    domManager.showWeekTasks();
});

menuCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
        sidebar.classList.add('active');
    } else {
        sidebar.classList.remove('active')
    }
});

signInBtn.addEventListener('click', () => {
    domManager.toggleSignInPopup();
});

signInPopupOverlay.addEventListener('click', (e) => {
    if (e.target === signInPopupOverlay) {
        domManager.toggleSignInPopup();
    }
});

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

eyeicon.addEventListener('click', () => {
    showPassword();
})

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    validateInputs();
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userLogin();
});

logoutBtn.addEventListener('click', () => {
    userLogout();
});