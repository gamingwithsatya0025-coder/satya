import userModel from '../models/userModel.js';

const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId).select('-password');
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user: {
            id: user._id,
            _id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
            verificationStatus: user.verificationStatus,
            aadhaarNumber: user.aadhaarNumber,
            aadhaarImage: user.aadhaarImage,
            panNumber: user.panNumber,
            panImage: user.panImage,
            drivingLicenceNumber: user.drivingLicenceNumber,
            drivingLicenceImage: user.drivingLicenceImage,
            profilePicture: user.profilePicture
        }});
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

export { getProfile };
