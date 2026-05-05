import mongoose from 'mongoose';
import messageModel from '../models/messageModel.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const testChat = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const bookingId = "69f9f523cfdba810dab5f706"; // ID from user screenshot
        const senderId = "661f7a26f04f85642a86561e"; // A valid user ID (I will find one)

        const newMessage = new messageModel({
            bookingId,
            senderId,
            text: "SYSTEM TEST: Real-time communication established."
        });

        await newMessage.save();
        console.log("Message injected successfully!");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

testChat();
