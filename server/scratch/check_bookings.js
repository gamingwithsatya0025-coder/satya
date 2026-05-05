import mongoose from 'mongoose';
import bookingModel from '../models/bookingModel.js';
import carModel from '../models/carModel.js';
import userModel from '../models/userModel.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const bookings = await bookingModel.find({}).populate('user').populate('car').populate('owner');
        console.log(`Total Bookings: ${bookings.length}`);

        bookings.forEach(b => {
            console.log("--- Booking ---");
            console.log(`ID: ${b._id}`);
            console.log(`User: ${b.user?.name} (${b.user?._id})`);
            console.log(`Car: ${b.car?.brand} ${b.car?.model} (${b.car?._id})`);
            console.log(`Owner in Booking: ${b.owner?.name} (${b.owner?._id})`);
            console.log(`Owner in Car: ${b.car?.owner}`);
            console.log(`Status: ${b.status}`);
        });

        const users = await userModel.find({});
        console.log("\n--- Registered Users ---");
        users.forEach(u => {
            console.log(`${u.name} (${u._id}) - Role: ${u.role}, isOwner: ${u.isOwner}`);
        });

        const cars = await carModel.find({});
        console.log("\n--- Listed Cars ---");
        cars.forEach(c => {
            console.log(`${c.brand} ${c.model} (${c._id}) - Owner ID: ${c.owner}`);
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

check();
