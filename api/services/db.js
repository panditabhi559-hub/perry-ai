const admin = require('firebase-admin');

const db = admin.firestore();

const saveChat = async (userId, chatId, messages) => {
    try {
        const chatRef = db.collection('users').doc(userId).collection('chats').doc(chatId);
        await chatRef.set({
            messages,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        return true;
    } catch (e) {
        console.error('Error saving chat:', e);
        return false;
    }
};

const getChats = async (userId) => {
    try {
        const snapshot = await db.collection('users').doc(userId).collection('chats').orderBy('updatedAt', 'desc').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error('Error getting chats:', e);
        return [];
    }
};

module.exports = { saveChat, getChats };
