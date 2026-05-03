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

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/car', carRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/chat', chatRouter);
app.use('/api/payment', paymentRouter);

const distPath = path.join(__dirname, '../client/dist');

app.use(express.static(distPath));

app.get(/.*$/, (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
      // Fallback for development if dist is missing
      return res.status(200).send(`
        <html>
          <body style="background: #030712; color: #f59e0b; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center;">
            <h1>IdleWheels Server is Running</h1>
            <p>The backend is active on port ${port}.</p>
            <p style="color: #94a3b8;">To view the frontend, please run <b>npm run dev</b> in the client directory<br>and open the Vite URL (usually http://localhost:5173).</p>
          </body>
        </html>
      `);
  }
  res.sendFile(indexPath);
});

// Start Server only if not in Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
}

export default app;
