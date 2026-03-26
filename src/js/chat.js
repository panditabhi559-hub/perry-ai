import { showToast, autoResize, ls_get, ls_set } from './utils.js';
import { callAI } from './api.js';

let chatMsgs = [];

export function initChat() {
    const chatInp = document.getElementById('chatInp');
    const sendBtn = document.getElementById('sendBtn');
    const msgsArea = document.getElementById('msgs');
    const welcome = document.getElementById('welcome');

    if (chatInp) {
        chatInp.oninput = () => {
            autoResize(chatInp);
            sendBtn.disabled = !chatInp.value.trim();
        };

        chatInp.onkeydown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        };
    }

    if (sendBtn) {
        sendBtn.onclick = sendMessage;
    }

    async function sendMessage() {
        const text = chatInp.value.trim();
        if (!text) return;

        chatInp.value = '';
        autoResize(chatInp);
        sendBtn.disabled = true;
        welcome.style.display = 'none';

        // Add user message
        const userMsg = { role: 'user', content: text };
        chatMsgs.push(userMsg);
        renderMessage('user', text);

        try {
            // Show typing indicator
            const typingId = showTypingIndicator();

            // Call backend API
            const response = await callAI(chatMsgs);
            
            removeTypingIndicator(typingId);

            const aiText = response.choices[0].message.content;
            const aiMsg = { role: 'assistant', content: aiText };
            chatMsgs.push(aiMsg);
            renderMessage('ai', aiText);

        } catch (error) {
            console.error('Chat Error:', error);
            showToast('Something went wrong!');
            renderMessage('ai', 'Error: ' + error.message);
        }
    }

    function renderMessage(role, text) {
        const div = document.createElement('div');
        div.className = `mrow ${role === 'user' ? 'user' : 'ai'}`;
        
        const avatar = role === 'user' ? 'U' : 'P';
        div.innerHTML = `
            <div class="av ${role === 'user' ? 'uav' : 'aav'}">${avatar}</div>
            <div class="mc">
                <div class="mb">${formatText(text)}</div>
            </div>
        `;
        msgsArea.appendChild(div);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const div = document.createElement('div');
        div.className = 'mrow ai typing-row';
        div.id = 'typing-indicator-' + Date.now();
        div.innerHTML = `
            <div class="av aav">P</div>
            <div class="mc">
                <div class="tdots">
                    <div class="td"></div><div class="td"></div><div class="td"></div>
                </div>
            </div>
        `;
        msgsArea.appendChild(div);
        scrollToBottom();
        return div.id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function formatText(text) {
        // Basic markdown-like replacement
        return text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    function scrollToBottom() {
        const chatArea = document.getElementById('chatArea');
        chatArea.scrollTop = chatArea.scrollHeight;
    }
}
