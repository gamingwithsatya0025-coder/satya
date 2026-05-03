import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import carRouter from './routes/carRoute.js';
import bookingRouter from './routes/bookingRoute.js';
import chatRouter from './routes/chatRoute.js';
import paymentRouter from './routes/paymentRoute.js';

const app = express();
const port = process.env.PORT || 4000;

// Enhanced Middleware for Production
app.use(express.json());
app.use(cors({
    origin: ["https://idlewheels.vercel.app", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true
}));

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/car', carRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/chat', chatRouter);
app.use('/api/payment', paymentRouter);

// Health Check for Vercel
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'active', database: 'connected', timestamp: new Date() });
});

const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

app.get(/.*$/, (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(200).send("IdleWheels API is running. Client build (dist) not found.");
    }
});

// Database Connection with Logging
const startServer = async () => {
    try {
        await connectDB();
        console.log("SUCCESS: MongoDB connected successfully.");
        
        if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
            app.listen(port, () => {
                console.log(`Server started on http://localhost:${port}`);
            });
        }
    } catch (error) {
        console.error("FATAL ERROR: Could not connect to MongoDB:", error.message);
    }
};

startServer();

export default app;
