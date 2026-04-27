import express from 'express';
import { placeBooking, userBookings, allBookings, cancelBooking } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/place', placeBooking);
bookingRouter.get('/user/:userId', userBookings);
bookingRouter.get('/list', allBookings);
bookingRouter.post('/cancel', cancelBooking);

export default bookingRouter;
