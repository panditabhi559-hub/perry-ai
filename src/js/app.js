import { initAuth } from './auth.js';
import { initChat } from './chat.js';
import { initAdmin } from './admin.js';
import { showToast } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('PerryAI Initializing...');

    // Navigation / Screen Management
    window.showScreen = (id) => {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById(id);
        if (screen) screen.classList.add('active');
    };

    // DOM Elements
    const themeBtn = document.getElementById('themeToggleBtn');
    const openSbBtn = document.getElementById('openSbBtn');
    const closeSbBtn = document.getElementById('closeSbBtn');
    const sb = document.getElementById('sb');
    const sbOv = document.getElementById('sbOv');

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

    // Stealth Admin Access: Triple-click the logo to open admin prompt
    const logo = document.querySelector('.ul-logo img');
    let logoClicks = 0;
    if (logo) {
        logo.onclick = () => {
            logoClicks++;
            setTimeout(() => { logoClicks = 0; }, 2000); // Reset clicks after 2 seconds
            if (logoClicks >= 3) {
                logoClicks = 0;
                const pin = prompt('Enter Admin Master PIN:');
                if (pin === '1234') showScreen('adminApp');
            }
        };
    }

    // Initialize Modules
    initAuth();
    initChat();
    initAdmin();
});
