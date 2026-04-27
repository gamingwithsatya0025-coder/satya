import express from 'express';
import { addCar, listCars, getCarDetails, removeCar } from '../controllers/carController.js';

const carRouter = express.Router();

carRouter.post('/add', addCar);
carRouter.get('/list', listCars);
carRouter.get('/single/:carId', getCarDetails);
carRouter.post('/remove', removeCar);

export default carRouter;
