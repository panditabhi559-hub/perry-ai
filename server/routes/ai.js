const express = require('express');
const axios = require('axios');
const router = express.Router();

// AI Provider endpoints
const PROVIDERS = {
    openrouter: "https://openrouter.ai/api/v1/chat/completions",
    gemini: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    groq: "https://api.groq.com/openai/v1/chat/completions",
    deepseek: "https://api.deepseek.com/chat/completions"
};

// Generic Handle for common OpenAI-style APIs (OpenRouter, Groq, DeepSeek)
const openaiProxy = async (req, res, provider) => {
    const { messages, model, stream } = req.body;
    const apiKey = process.env[`${provider.toUpperCase()}_API_KEY`];

    if (!apiKey) {
        return res.status(401).json({ error: `${provider} API Key not configured on server.` });
    }

    try {
        const response = await axios.post(PROVIDERS[provider], {
            model: model || (provider === 'groq' ? 'llama3-8b-8192' : 'meta-llama/llama-3-8b-instruct:free'),
            messages: messages,
            stream: !!stream
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://perryai.in', // Required by OpenRouter
                'X-Title': 'PerryAI'
            },
            responseType: stream ? 'stream' : 'json'
        });

        if (stream) {
            response.data.pipe(res);
        } else {
            res.json(response.data);
        }
    } catch (error) {
        console.error(`${provider} proxy error:`, error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
};

// Route for all OpenAI-style providers
router.post('/chat', async (req, res) => {
    const { provider } = req.body;
    if (provider === 'gemini') {
        return handleGemini(req, res);
    }
    await openaiProxy(req, res, provider || 'openrouter');
});

// Special handler for Gemini
const handleGemini = async (req, res) => {
    const { messages, stream } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(401).json({ error: "Gemini API Key not configured on server." });
    }

    // Convert OpenAI style messages to Gemini style
    const geminiMessages = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
    }));

    const url = `${PROVIDERS.gemini}?key=${apiKey}`;

    try {
        // Simple non-streaming for now to ensure compatibility
        const response = await axios.post(url, {
            contents: geminiMessages
        });

        res.json({
            choices: [{
                message: {
                    content: response.data.candidates[0].content.parts[0].text
                }
            }]
        });
    } catch (error) {
        console.error("Gemini proxy error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
};

module.exports = router;
