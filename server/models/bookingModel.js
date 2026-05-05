import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'car', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
    pickupLocation: { type: String, required: true },
}, { timestamps: true });

const bookingModel = mongoose.models.booking || mongoose.model('booking', bookingSchema);
export default bookingModel;
