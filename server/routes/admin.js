const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const db = admin.firestore();

// Save Dynamic Keys
router.post('/keys/save', async (req, res) => {
    const { keys, pin } = req.body;

    // Very basic security - in real app, use proper Admin role check
    if (pin !== process.env.ADMIN_PIN && pin !== '1234') {
        return res.status(403).json({ error: 'Invalid Admin PIN' });
    }

    try {
        await db.collection('settings').doc('api_keys').set({
            ...keys,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        res.json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Current Keys (Masked)
router.get('/keys', async (req, res) => {
    try {
        const doc = await db.collection('settings').doc('api_keys').get();
        const data = doc.data() || {};
        // Mask keys for safety
        const masked = {};
        for (let k in data) {
            if (typeof data[k] === 'string') masked[k] = data[k].substring(0, 4) + '****';
        }
        res.json({ keys: masked });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
