import carModel from '../models/carModel.js';
import userModel from '../models/userModel.js';
import { sampleCars } from '../utils/sampleData.js';

// Add Car
const addCar = async (req, res) => {
    try {
        const { 
            brand, model, year, pricePerDay, fuelType, transmission, 
            seatingCapacity, location, description, features, images, video, ownerId 
        } = req.body;

        // Check user existence
        const user = await userModel.findById(ownerId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Validate media: at least 4-5 photos and 1 video
        if (!images || images.length < 4) {
            return res.json({ success: false, message: "Please upload at least 4 photos of the car." });
        }
        if (!video) {
            return res.json({ success: false, message: "A video demonstration of the car is required." });
        }

        const carData = {
            brand, model, year, pricePerDay, fuelType, transmission,
            seatingCapacity, location, description, features: JSON.parse(features || '[]'),
            images, video, owner: ownerId,
            isApproved: true // Auto-approving for demo purposes, can be set to false for manual admin check
        };

        const newCar = new carModel(carData);
        await newCar.save();

        // Mark user as owner if not already
        if (!user.isOwner) {
            await userModel.findByIdAndUpdate(ownerId, { isOwner: true });
        }

        res.json({ success: true, message: "Car listed successfully!" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Get All Cars
const listCars = async (req, res) => {
    try {
        let cars = await carModel.find({ isApproved: true });
        if (cars.length === 0) {
            return res.json({ success: true, cars: sampleCars });
        }
        res.json({ success: true, cars });
    } catch (error) {
        console.error("Database unavailable, serving fallback data:", error.message);
        res.json({ success: true, cars: sampleCars });
    }
}

// Get Single Car Details
const getCarDetails = async (req, res) => {
    try {
        const { carId } = req.params;
        
        if (carId.startsWith('fallback_')) {
            const car = sampleCars.find(c => c._id === carId) || sampleCars[0];
            return res.json({ success: true, car });
        }

        const car = await carModel.findById(carId).populate('owner', 'name email');
        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }
        res.json({ success: true, car });
    } catch (error) {
        console.error("Database error, searching in fallback data:", error.message);
        const { carId } = req.params;
        const car = sampleCars.find(c => c._id === carId);
        if (car) {
            return res.json({ success: true, car });
        }
        res.json({ success: false, message: "Car not found in database or fallback data." });
    }
}

// Delete Car
const removeCar = async (req, res) => {
    try {
        const { carId } = req.body;
        await carModel.findByIdAndDelete(carId);
        res.json({ success: true, message: "Car removed" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export { addCar, listCars, getCarDetails, removeCar };
