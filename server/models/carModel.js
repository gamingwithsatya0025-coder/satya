import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    fuelType: { type: String, required: true },
    transmission: { type: String, required: true },
    seatingCapacity: { type: Number, required: true },
    location: { type: String, required: true },
    
    // Media requirements: 4-5 photos and 1 video
    images: { type: [String], required: true }, // Expecting array of URLs
    video: { type: String, required: true },
    
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    
    availability: { type: Boolean, default: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    
    // Status for moderation
    isApproved: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5 }
}, { timestamps: true });

const carModel = mongoose.models.car || mongoose.model('car', carSchema);
export default carModel;
