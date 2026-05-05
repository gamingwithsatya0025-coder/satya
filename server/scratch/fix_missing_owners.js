import mongoose from 'mongoose';
import bookingModel from '../models/bookingModel.js';
import carModel from '../models/carModel.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const fix = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const bookings = await bookingModel.find({ owner: { $exists: false } }).populate('car');
        const bookingsWithNull = await bookingModel.find({ owner: null }).populate('car');
        
        const allToFix = [...bookings, ...bookingsWithNull];
        console.log(`Found ${allToFix.length} bookings to fix.`);

        for (const b of allToFix) {
            if (b.car && b.car.owner) {
                b.owner = b.car.owner;
                await b.save();
                console.log(`Fixed booking ${b._id} -> Owner: ${b.owner}`);
            }
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

fix();
