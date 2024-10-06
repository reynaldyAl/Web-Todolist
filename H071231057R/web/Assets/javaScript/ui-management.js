import { User } from './user.js';

// sessionStorage sama localStorage itu penyimpanan di browser. jadi kalau di close browsernya hilang semua juga datanya lagi. karena tidak bisa menggunakan database atau server jadi datanya disimpan di sini.

function getUsersFromStorage() {
    const usersData = localStorage.getItem('users');
    return usersData ? JSON.parse(usersData) : [];
}

function saveUsersToStorage(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Fungsi untuk menampilkan error message
function showErrorMessage(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'block';
    errorMessage.textContent = message;
}

function validateLogin(inputUsername, inputPassword, user) {
    return user.username === inputUsername && user.password === inputPassword;
}

document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let users = getUsersFromStorage();
    const foundUser = users.find(user => validateLogin(username, password, user));

    if (foundUser) {
        sessionStorage.setItem('user', JSON.stringify(foundUser));
        window.location.href = 'index.html';
    } else {
        showErrorMessage("Invalid username or password!");
    }
});

document.getElementById('registerForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;

    let users = getUsersFromStorage();
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        showErrorMessage("Username already exists!");
    } else {
        const newUser = new User(username, password);
        users.push(newUser);
        saveUsersToStorage(users);
        alert("Registration successful! Please log in.");
        window.location.href = 'login.html';
    }
});

// Handle logout
document.getElementById('logoutButton')?.addEventListener('click', function() {
    sessionStorage.removeItem('user');  
    location.reload();  
    document.getElementById('sidebar-username').textContent = 'Guest';
    document.getElementById('sidebar-email').textContent = '';
});

// Update sidebar with the logged-in user's info
const userData = JSON.parse(sessionStorage.getItem('user'));
if (userData) {
    document.getElementById('username').textContent = userData.username;
    document.getElementById('sidebar-username').textContent = userData.username;
    document.getElementById('sidebar-email').textContent = userData.email || ''; 
}

// Task management
const taskList = [];
let importantTasks = [];

document.getElementById('submit-task-btn').addEventListener('click', function() {
    const taskInput = document.getElementById('task-input').value;
    const dueDate = document.getElementById('due-date-input').value;
    const isImportant = document.getElementById('priority-btn').classList.contains('important');

    const task = {
        text: taskInput,
        dueDate: dueDate,
        isImportant: isImportant,
        isCompleted: false
    };

    taskList.push(task);
    renderTasks();
});

function renderTasks() {
    const taskContainer = document.getElementById('my-day-task-list');
    taskContainer.innerHTML = ''; 

    const suggestionsContainer = document.getElementById('suggestions-list');
    suggestionsContainer.innerHTML = '';

    taskList.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `
            <input type="checkbox" class="me-2 task-checkbox" data-index="${index}">
            ${task.text} <small class="text-muted">${task.dueDate}</small>
        `;

        taskContainer.appendChild(li);
        suggestionsContainer.appendChild(li.cloneNode(true)); // Clone to suggestions panel

        if (task.isImportant) {
            importantTasks.push(task);
            const importantLink = document.getElementById('important-tasks-link');
            importantLink.innerHTML = `<i class="bi bi-star"></i> Important (${importantTasks.length})`;
        }
    });

    attachCheckboxListeners();
}

function attachCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskIndex = this.dataset.index;
            taskList[taskIndex].isCompleted = this.checked;
            renderCompletedTasks();
        });
    });
}

function renderCompletedTasks() {
    const completedTasksContainer = document.getElementById('completed-tasks-list');
    completedTasksContainer.innerHTML = ''; 

    taskList.forEach(task => {
        if (task.isCompleted) {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = task.text;
            completedTasksContainer.appendChild(li);
        }
    });
}

document.getElementById('priority-btn').addEventListener('click', function() {
    this.classList.toggle('important');
});
