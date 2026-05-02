import express from 'express';
import { createSetupIntent, getSavedPaymentMethods } from '../controllers/paymentController.js';
import authUser from '../middleware/authUser.js';

const paymentRouter = express.Router();

// Both routes require the user to be authenticated
paymentRouter.post('/create-setup-intent', authUser, createSetupIntent);
paymentRouter.get('/payment-methods', authUser, getSavedPaymentMethods);

export default paymentRouter;
