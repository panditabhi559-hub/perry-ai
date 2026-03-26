import { initAuth } from './auth.js';
import { initChat } from './chat.js';
import { showToast } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('PerryAI Initializing...');

    // DOM Elements
    const themeBtn = document.getElementById('themeToggleBtn');
    const openSbBtn = document.getElementById('openSbBtn');
    const closeSbBtn = document.getElementById('closeSbBtn');
    const sb = document.getElementById('sb');
    const sbOv = document.getElementById('sbOv');

    // Navigation / Screen Management
    window.showScreen = (id) => {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById(id);
        if (screen) screen.classList.add('active');
    };

    // Sidebar Logic
    const openSb = () => {
        sb.classList.add('open');
        sbOv.classList.add('open');
    };
    const closeSb = () => {
        sb.classList.remove('open');
        sbOv.classList.remove('open');
    };

    if (openSbBtn) openSbBtn.onclick = openSb;
    if (closeSbBtn) closeSbBtn.onclick = closeSb;
    if (sbOv) sbOv.onclick = closeSb;

    // Theme Toggle
    if (themeBtn) {
        themeBtn.onclick = () => {
            document.body.classList.toggle('light');
            themeBtn.textContent = document.body.classList.contains('light') ? '🌙' : '☀️';
        };
    }

    // Initialize Modules
    initAuth();
    initChat();
});
