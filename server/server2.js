import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import carRouter from './routes/carRoute.js';
import bookingRouter from './routes/bookingRoute.js';

const app = express();
const port = 4001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/car', carRouter);
app.use('/api/booking', bookingRouter);

app.get('/', (req, res) => {
  res.send('Idle Wheels API Working');
});

// Start Server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
