const BACKEND_URL = 'http://localhost:3000/api';

export async function callAI(messages, model = 'google/gemini-2.0-flash-exp:free', provider = 'openrouter') {
    try {
        const response = await fetch(`${BACKEND_URL}/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages,
                model,
                provider,
                settings: {
                    temp: 0.7,
                    maxTokens: 2000
                }
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.details || err.error || 'Backend request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

export async function checkStatus() {
    try {
        const response = await fetch(`${BACKEND_URL}/status`);
        return await response.json();
    } catch (e) {
        return { status: 'offline' };
    }
}
