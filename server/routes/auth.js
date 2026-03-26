const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Verify Firebase ID Token
router.post('/verify', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        res.json({ status: 'success', user: decodedToken });
    } catch (error) {
        console.error('Auth verification error:', error);
        res.status(403).json({ error: 'Unauthorized' });
    }
});

module.exports = router;
