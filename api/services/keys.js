const admin = require('firebase-admin');

async function getApiKey(keyName) {
    try {
        const doc = await admin.firestore().collection('settings').doc('api_keys').get();
        if (doc.exists && doc.data()[keyName]) {
            return doc.data()[keyName];
        }
    } catch (e) {
        console.warn('Error fetching dynamic key:', e.message);
    }
    return process.env[keyName];
}

module.exports = { getApiKey };
