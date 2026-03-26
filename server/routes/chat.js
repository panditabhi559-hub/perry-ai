const express = require('express');
const { saveChat, getChats } = require('../services/db');
const router = express.Router();

// Middleware to verify userId (simplified - usually from decoded token)
router.use((req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'Missing userId header' });
    }
    req.userId = userId;
    next();
});

// Save chat
router.post('/save', async (req, res) => {
    const { chatId, messages } = req.body;
    if (!chatId || !messages) return res.status(400).json({ error: 'Missing chatId or messages' });
    
    const success = await saveChat(req.userId, chatId, messages);
    if (success) {
        res.json({ status: 'saved' });
    } else {
        res.status(500).json({ status: 'error' });
    }
});

// Get all chats
router.get('/list', async (req, res) => {
    const chats = await getChats(req.userId);
    res.json({ chats });
});

module.exports = router;
