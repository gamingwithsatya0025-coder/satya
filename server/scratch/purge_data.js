import mongoose from 'mongoose';
import bookingModel from '../models/bookingModel.js';
import carModel from '../models/carModel.js';
import messageModel from '../models/messageModel.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const purgeData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB for Purge");

        const bookingCount = await bookingModel.countDocuments();
        const carCount = await carModel.countDocuments();
        const messageCount = await messageModel.countDocuments();

        console.log(`Found: ${bookingCount} bookings, ${carCount} cars, ${messageCount} messages.`);

        await bookingModel.deleteMany({});
        await carModel.deleteMany({});
        await messageModel.deleteMany({});

        console.log("SUCCESS: Database purged of all bookings, cars, and messages. You have a clean slate!");
        process.exit();
    } catch (error) {
        console.error("Purge Error:", error);
        process.exit(1);
    }
};

purgeData();
