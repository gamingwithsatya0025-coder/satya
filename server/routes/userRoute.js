import express from 'express';
import { loginUser, registerUser, requestVerification, approveVerification, googleLogin, updateProfilePicture } from '../controllers/userController.js';
import { getProfile } from '../controllers/profileController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/google', googleLogin);
userRouter.post('/verify-request', requestVerification);
userRouter.post('/get-profile', getProfile);
userRouter.post('/approve-verification', approveVerification); 
userRouter.post('/update-dp', updateProfilePicture);

export default userRouter;

