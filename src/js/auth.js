import { showToast, ls_get, ls_set } from './utils.js';

export function initAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const regBtn = document.getElementById('regBtn');
    const showRegLink = document.getElementById('showRegLink');
    const showLoginLink = document.getElementById('showLoginLink');
    const logoutBtn = document.getElementById('logoutBtn');

    // Toggle between Login and Register forms
    if (showRegLink) {
        showRegLink.onclick = () => {
            document.getElementById('ulForm').style.display = 'none';
            document.getElementById('ulReg').style.display = 'block';
            document.getElementById('ul-title').textContent = 'Create Account';
        };
    }

    if (showLoginLink) {
        showLoginLink.onclick = () => {
            document.getElementById('ulReg').style.display = 'none';
            document.getElementById('ulForm').style.display = 'block';
            document.getElementById('ul-title').textContent = 'Welcome back';
        };
    }

    // Login logic
    if (loginBtn) {
        loginBtn.onclick = () => {
            const user = document.getElementById('ul-user').value.trim();
            const pass = document.getElementById('ul-pass').value.trim();

            if (!user || !pass) {
                return showToast('Username aur password daalo!');
            }

            // Simple demo check for now - to be replaced with Firebase Auth
            const users = ls_get('perry_users', {});
            if (users[user] && users[user].pass === pass) {
                setCurrentUser(users[user]);
                showScreen('userApp');
                showToast('Welcome back, ' + user);
            } else {
                showToast('Galat username ya password!');
            }
        };
    }

    // Registration logic
    if (regBtn) {
        regBtn.onclick = () => {
            const name = document.getElementById('ur-name').value.trim();
            const user = document.getElementById('ur-user').value.trim();
            const pass = document.getElementById('ur-pass').value.trim();

            if (!name || !user || pass.length < 4) {
                return showToast('Sahi details daalo (Password 4+ chars)!');
            }

            const users = ls_get('perry_users', {});
            if (users[user]) {
                return showToast('Username pehle se liya hua hai!');
            }

            const newUser = { name, username: user, pass, createdAt: Date.now() };
            users[user] = newUser;
            ls_set('perry_users', users);
            
            setCurrentUser(newUser);
            showScreen('userApp');
            showToast('Account ban gaya! Welcome ' + name);
        };
    }

    if (logoutBtn) {
        logoutBtn.onclick = () => {
            ls_set('perry_session', null);
            showScreen('userLogin');
            showToast('Logged out!');
        };
    }

    // Auto-login check
    const session = ls_get('perry_session');
    if (session) {
        setCurrentUser(session);
        showScreen('userApp');
    }
}

function setCurrentUser(user) {
    ls_set('perry_session', user);
    const uav = document.getElementById('userAvatar');
    const uname = document.getElementById('topName');
    if (uav) uav.textContent = (user.name || user.username)[0].toUpperCase();
    if (uname) uname.textContent = user.name || user.username;
}
