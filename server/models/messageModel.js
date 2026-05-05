import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'booking', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const messageModel = mongoose.models.message || mongoose.model('message', messageSchema);
export default messageModel;
