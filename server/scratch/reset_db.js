import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models (adjust paths if necessary)
import carModel from '../models/carModel.js';
import bookingModel from '../models/bookingModel.js';
import messageModel from '../models/messageModel.js';

dotenv.config({ path: path.join(__dirname, '../.env') });

const resetDB = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected Successfully.");

        console.log("Wiping Bookings...");
        await bookingModel.deleteMany({});
        
        console.log("Wiping Cars...");
        await carModel.deleteMany({});

        console.log("Wiping Chat Messages...");
        await messageModel.deleteMany({});

        console.log("-----------------------------------------");
        console.log("DATABASE RESET COMPLETE.");
        console.log("All Bookings, Cars, and Messages removed.");
        console.log("-----------------------------------------");
        
        process.exit(0);
    } catch (error) {
        console.error("RESET FAILED:", error);
        process.exit(1);
    }
};

resetDB();
