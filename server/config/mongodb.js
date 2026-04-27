import mongoose from 'mongoose';

mongoose.set('bufferCommands', false);

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("Database Connected");
        });

        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/idlewheels';
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        });
    } catch (error) {
        console.error("Database connection error:", error.message);
        console.log("Starting server in fallback mode (Local Data)...");
    }
}

export default connectDB;
