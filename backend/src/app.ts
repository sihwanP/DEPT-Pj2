import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import uploadRoutes from './routes/uploadRoutes';
import userRoutes from './routes/userRoutes';
import bookingRoutes from './routes/bookingRoutes';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serving uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);

// Translation Endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Backend Server is Running', status: 'OK' });
});

app.post('/api/translate', async (req, res) => {
    try {
        const { text, targetLang } = req.body;

        if (!text || !targetLang) {
            return res.status(400).json({ error: 'Missing text or targetLang' });
        }

        const { translateText } = await import('./services/translationService');
        const translatedText = await translateText({ text, targetLang });
        res.json({ translatedText });
    } catch (error) {
        console.error('Translation API Error:', error);
        res.status(500).json({ error: 'Translation failed' });
    }
});

// Handle Chrome DevTools discovery request to suppress 404 error
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.status(200).json({});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Translation Service Ready`);
});

export default app;
