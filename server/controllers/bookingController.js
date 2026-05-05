import bookingModel from '../models/bookingModel.js';
import carModel from '../models/carModel.js';
import userModel from '../models/userModel.js';
import messageModel from '../models/messageModel.js';
import mongoose from 'mongoose';

// Place Booking
const placeBooking = async (req, res) => {
    try {
        const { carId, pickupDate, returnDate, totalPrice, pickupLocation } = req.body;
        const userId = req.userId;

        const user = await userModel.findById(userId);
        if (!user || (user.verificationStatus !== 'approved' && user.verificationStatus !== 'pending')) {
            return res.json({ success: false, message: "Please submit your verification documents to book a car." });
        }

        const car = await carModel.findById(carId);
        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }

        const bookingData = {
            user: new mongoose.Types.ObjectId(userId),
            car: carId,
            owner: car.owner,
            pickupDate,
            returnDate,
            totalPrice,
            pickupLocation,
            status: 'Pending', 
            paymentStatus: 'Paid'
        };

        const newBooking = new bookingModel(bookingData);
        await newBooking.save();

        res.json({ success: true, message: "Booking request sent! Awaiting owner approval." });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// User Bookings
const userBookings = async (req, res) => {
    try {
        const userId = req.userId;
        const bookings = await bookingModel.find({ user: userId }).populate('car');
        res.json({ success: true, bookings });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// All Bookings
const allBookings = async (req, res) => {
    try {
        // Only fetch bookings that have a valid car reference to avoid cast errors
        const bookings = await bookingModel.find({ car: { $ne: null, $exists: true } })
            .populate('user', 'name email verificationStatus aadhaarNumber aadhaarImage panNumber panImage drivingLicenceNumber drivingLicenceImage profilePicture')
            .populate('car', 'brand model owner location');
        res.json({ success: true, bookings });
    } catch (error) {
        console.error("All Bookings Error:", error);
        res.json({ success: false, message: error.message });
    }
}

// Cancel Booking
const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;
        await bookingModel.findByIdAndUpdate(bookingId, { status: 'Cancelled' });
        res.json({ success: true, message: "Booking cancelled" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update Booking Status
const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId, status } = req.body;
        await bookingModel.findByIdAndUpdate(bookingId, { status });
        res.json({ success: true, message: `Booking ${status === 'Confirmed' ? 'Approved' : 'Rejected'}` });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Send Message
const sendMessage = async (req, res) => {
    try {
        const { bookingId, text } = req.body;
        const senderId = req.userId;
        
        console.log("Attempting to send message:", { bookingId, senderId, text });

        if (!bookingId || !text || !senderId) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        const newMessage = new messageModel({ bookingId, senderId, text });
        await newMessage.save();
        
        console.log("Message saved successfully");
        res.json({ success: true, message: "Message sent" });
    } catch (error) {
        console.error("Chat Error:", error);
        res.json({ success: false, message: error.message });
    }
}

// Get Messages
const getMessages = async (req, res) => {
    try {
        const { bookingId } = req.query;
        const messages = await messageModel.find({ bookingId }).sort({ createdAt: 1 });
        res.json({ success: true, messages });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export { placeBooking, userBookings, allBookings, cancelBooking, updateBookingStatus, sendMessage, getMessages };
