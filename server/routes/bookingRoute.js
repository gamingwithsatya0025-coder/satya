import express from 'express';
import { placeBooking, userBookings, allBookings, cancelBooking, updateBookingStatus, sendMessage, getMessages } from '../controllers/bookingController.js';
import authUser from '../middleware/authUser.js';

const bookingRouter = express.Router();

bookingRouter.post('/place', authUser, placeBooking);
bookingRouter.get('/my-bookings', authUser, userBookings);
bookingRouter.get('/list', allBookings);
bookingRouter.post('/cancel', authUser, cancelBooking);
bookingRouter.post('/status', authUser, updateBookingStatus);
bookingRouter.post('/send-message', authUser, sendMessage);
bookingRouter.get('/get-messages', authUser, getMessages);

export default bookingRouter;
