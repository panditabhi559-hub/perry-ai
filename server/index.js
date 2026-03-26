const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
const { initializeApp } = require('firebase-admin/app');
const admin = require('firebase-admin');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

// Initialize Firebase Admin (requires serviceAccountKey.json or environment variables)
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
        console.warn("Firebase Service Account Key not found. Firebase features may not work.");
    }
} catch (error) {
    console.error("Error initializing Firebase Admin:", error);
}

// Routes
// TODO: Integrate routes for AI proxy, auth, and database

app.get('/', (req, res) => {
    res.send('PerryAI Backend API is running...');
});

// AI Proxy Route
const aiRoutes = require('./routes/ai');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const imageRoutes = require('./routes/image');
const voiceRoutes = require('./routes/voice');
const adminRoutes = require('./routes/admin');
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/admin', adminRoutes);

// start server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
