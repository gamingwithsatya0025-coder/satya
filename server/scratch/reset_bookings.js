import mongoose from 'mongoose';
import bookingModel from '../models/bookingModel.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const reset = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const result = await bookingModel.updateMany(
            { status: 'Cancelled' },
            { $set: { status: 'Pending' } }
        );

        console.log(`Successfully reset ${result.modifiedCount} bookings to Pending.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

reset();
