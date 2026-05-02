import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  
  // Verification details
  isVerified: { type: Boolean, default: false },
  aadhaarNumber: { type: String },
  aadhaarImage: { type: String },
  panNumber: { type: String },
  panImage: { type: String },
  drivingLicenceNumber: { type: String },
  drivingLicenceImage: { type: String },
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'none'], default: 'none' },

  // For car owners
  isOwner: { type: Boolean, default: false },
  profilePicture: { type: String, default: "" },

  cartData: { type: Object, default: {} },
  
  // Stripe integration
  stripeCustomerId: { type: String, default: "" }
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;
