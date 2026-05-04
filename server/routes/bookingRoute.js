import express from 'express';
import { placeBooking, userBookings, allBookings, cancelBooking, updateBookingStatus } from '../controllers/bookingController.js';
import authUser from '../middleware/authUser.js';

const bookingRouter = express.Router();

bookingRouter.post('/place', authUser, placeBooking);
bookingRouter.get('/user/:userId', authUser, userBookings);
bookingRouter.get('/list', allBookings);
bookingRouter.post('/cancel', authUser, cancelBooking);
bookingRouter.post('/status', authUser, updateBookingStatus);

export default bookingRouter;
