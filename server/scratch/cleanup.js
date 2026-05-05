import mongoose from 'mongoose';

const uri = "mongodb+srv://kovirisampath_db_user:idlewheels12345@idlewheel01.hb1jbul.mongodb.net/idlewheels?retryWrites=true&w=majority&appName=idlewheel01";

const cleanup = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB Atlas...");

        const db = mongoose.connection.db;
        
        const carCount = await db.collection('cars').deleteMany({});
        console.log(`Deleted ${carCount.deletedCount} cars.`);

        const bookingCount = await db.collection('bookings').deleteMany({});
        console.log(`Deleted ${bookingCount.deletedCount} bookings.`);

        console.log("Database cleanup successful!");
        process.exit(0);
    } catch (error) {
        console.error("Cleanup failed:", error.message);
        process.exit(1);
    }
}

cleanup();
