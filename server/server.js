import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import carRouter from './routes/carRoute.js';
import bookingRouter from './routes/bookingRoute.js';
import chatRouter from './routes/chatRoute.js';
import paymentRouter from './routes/paymentRoute.js';
import upload from './middleware/multer.js';
import connectCloudinary from './config/cloudinary.js';
import { v2 as cloudinary } from 'cloudinary';

const app = express();
const port = process.env.PORT || 4000;

// Enhanced Middleware for Production
app.use(express.json());
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://satya-fqcs.vercel.app",
    "https://idlewheels.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
].filter(Boolean);

app.use(cors({
    origin: '*',
    credentials: true
}));

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/car', carRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/chat', chatRouter);
app.use('/api/payment', paymentRouter);

// File Upload Endpoint (Supports local and Cloudinary)
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "No file uploaded" });
        }

        // If Cloudinary credentials exist, upload to Cloudinary
        if (process.env.CLOUDINARY_API_KEY) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "auto",
                folder: "idlewheels"
            });
            
            // Delete local file after upload
            fs.unlinkSync(req.file.path);
            
            return res.json({ success: true, fileUrl: uploadResult.secure_url });
        }

        // Fallback to local storage
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.json({ success: true, fileUrl });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check for Vercel
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'active', database: 'connected', timestamp: new Date() });
});

const distPath = path.join(process.cwd(), 'client', 'dist');
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
        await connectCloudinary();
        console.log("SUCCESS: MongoDB & Cloudinary connected successfully.");
        
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    } catch (error) {
        console.error("FATAL ERROR: Could not connect to MongoDB:", error.message);
    }
};

startServer();

export default app;
