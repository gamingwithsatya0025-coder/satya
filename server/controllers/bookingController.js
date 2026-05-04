import bookingModel from '../models/bookingModel.js';
import carModel from '../models/carModel.js';
import userModel from '../models/userModel.js';


// Place Booking
const placeBooking = async (req, res) => {
    try {
        const { userId, carId, pickupDate, returnDate, totalPrice, pickupLocation } = req.body;

        // Check verification status (Allow pending for owner review)
        const user = await userModel.findById(userId);
        if (!user || (user.verificationStatus !== 'approved' && user.verificationStatus !== 'pending')) {
            return res.json({ success: false, message: "Please submit your verification documents to book a car." });
        }


        const bookingData = {
            user: userId,
            car: carId,
            pickupDate,
            returnDate,
            totalPrice,
            pickupLocation,
            status: 'Pending', // Now pending owner approval
            paymentStatus: 'Paid' // Mock payment successful
        };

        const newBooking = new bookingModel(bookingData);
        await newBooking.save();

        // Update car availability (optional logic, can just mark as booked)
        // await carModel.findByIdAndUpdate(carId, { availability: false });

        res.json({ success: true, message: "Booking request sent! Awaiting owner approval." });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// User Bookings
const userBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await bookingModel.find({ user: userId }).populate('car');
        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// All Bookings (Admin/Owner)
const allBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find({})
            .populate('user', 'name email aadhaarNumber aadhaarImage drivingLicenceNumber drivingLicenceImage panNumber panImage verificationStatus')
            .populate('car', 'brand model owner location');
        res.json({ success: true, bookings });
    } catch (error) {
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

// Update Booking Status (Approve/Reject)
const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId, status } = req.body;
        
        // Validation
        if (!['Confirmed', 'Cancelled'].includes(status)) {
            return res.json({ success: false, message: "Invalid status update" });
        }

        const booking = await bookingModel.findByIdAndUpdate(bookingId, { status });
        
        if (status === 'Confirmed') {
            // Logic if needed when confirmed
        }

        res.json({ success: true, message: `Booking ${status === 'Confirmed' ? 'Approved' : 'Rejected'}` });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export { placeBooking, userBookings, allBookings, cancelBooking, updateBookingStatus };
