import { User } from './user.js';

// sessionStorage sama localStorage itu penyimpanan di browser. jadi kalau di close browsernya hilang semua juga datanya lagi. karena tidak bisa menggunakan database atau server jadi datanya disimpan di sini.


function getUsersFromStorage() {
    const usersData = localStorage.getItem('users');
    return usersData ? JSON.parse(usersData) : [];
}

// Fungsi untuk menyimpan data users ke localStorage
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

// Login form submission
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let users = getUsersFromStorage();

    const foundUser = users.find(user => validateLogin(username, password, user));

    if (foundUser) {
        // Simpan user ke sessionStorage
        sessionStorage.setItem('user', JSON.stringify(foundUser));
        window.location.href = 'index.html';
    } else {
        showErrorMessage("Invalid username or password!");
    }
});

// Register form submission
document.getElementById('registerForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;

    let users = getUsersFromStorage();

    const userExists = users.find(user => user.username === username);
    if (userExists) {
        showErrorMessage("Username already exists!");
    } else {
        // Tambahkan user baru ke array
        const newUser = new User(username, password);
        users.push(newUser);

        // Simpan user baru ke localStorage
        saveUsersToStorage(users);

        alert("Registration successful! Please log in.");
        window.location.href = 'login.html';
    }
});

// Logout function
document.getElementById('logoutButton')?.addEventListener('click', function() {
    sessionStorage.removeItem('user');  // Hapus user dari session
    location.reload();
});

const userData = JSON.parse(sessionStorage.getItem('user'));
if (userData) {
    document.getElementById('username').textContent = userData.username;
}