const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/generate', async (req, res) => {
    const { prompt, model = 'stability-ai/sdxl' } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        return res.status(401).json({ error: 'OpenRouter API Key not configured' });
    }

    try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'meta-llama/llama-3-8b-instruct:free', // Use a free model to "refine" prompt or just call directly if using a specialized model
            messages: [{ role: 'user', content: `Generate an image for: ${prompt}` }]
            // OpenRouter doesn't have a direct "image generation" API like OpenAI DALL-E, 
            // but many models can describe/generate prompt or use specific providers.
            // For now, I'll stick to text-to-image providers if available or return a placeholder.
        }, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        res.json({ status: 'sent', result: response.data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
