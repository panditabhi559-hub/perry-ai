const express = require('express');
const axios = require('axios');
const router = express.Router();

const { getApiKey } = require('../services/keys');

router.post('/speak', async (req, res) => {
    const { text, voiceId = '21m00Tcm4lPqW29OL023' } = req.body; // Default voice ID
    const apiKey = await getApiKey('ELEVENLABS_API_KEY');

    if (!apiKey) {
        return res.status(401).json({ error: 'ElevenLabs API Key not configured' });
    }

    try {
        const response = await axios.post(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            text: text,
            model_id: 'eleven_monolingual_v1'
        }, {
            headers: {
                'xi-api-key': apiKey,
                'Content-Type': 'application/json',
                'accept': 'audio/mpeg'
            },
            responseType: 'arraybuffer'
        });

        res.set('Content-Type', 'audio/mpeg');
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
