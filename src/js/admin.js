import { showToast } from './utils.js';

export function initAdmin() {
    const adminLink = document.getElementById('adminLoginLink');
    const saveKeysBtn = document.getElementById('saveKeysBtn');

    if (adminLink) {
        adminLink.onclick = () => {
            const pin = prompt('Enter Admin PIN:');
            if (pin === '1234') { // Simplified for demo - use real auth in production
                showScreen('adminApp');
                loadCurrentKeys();
            } else {
                showToast('Invalid PIN!');
            }
        };
    }

    if (saveKeysBtn) {
        saveKeysBtn.onclick = async () => {
            const keys = {
                OPENROUTER_API_KEY: document.getElementById('adm-orkey').value,
                GEMINI_API_KEY: document.getElementById('adm-gemkey').value,
                ELEVENLABS_API_KEY: document.getElementById('adm-evlkey').value
            };

            try {
                const response = await fetch('/api/admin/keys/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ keys, pin: '1234' })
                });

                if (response.ok) {
                    showToast('Keys updated successfully! 🚀');
                } else {
                    showToast('Failed to save keys');
                }
            } catch (e) {
                showToast('Error saving keys');
            }
        };
    }
}

async function loadCurrentKeys() {
    try {
        const res = await fetch('/api/admin/keys');
        const data = await res.json();
        if (data.keys) {
            if (data.keys.OPENROUTER_API_KEY) document.getElementById('adm-orkey').placeholder = data.keys.OPENROUTER_API_KEY;
            if (data.keys.GEMINI_API_KEY) document.getElementById('adm-gemkey').placeholder = data.keys.GEMINI_API_KEY;
            if (data.keys.ELEVENLABS_API_KEY) document.getElementById('adm-evlkey').placeholder = data.keys.ELEVENLABS_API_KEY;
        }
    } catch (e) {
        console.error('Failed to load keys');
    }
}
