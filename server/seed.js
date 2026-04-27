import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from './models/carModel.js';

dotenv.config();

const sampleCars = [
  {
    brand: "Mercedes-Benz",
    model: "S-Class Maybach",
    year: 2024,
    pricePerDay: 25000,
    category: "Luxury",
    transmission: "Automatic",
    fuelType: "Petrol",
    seatingCapacity: 4,
    location: "VISAKHAPATNAM",
    description: "The pinnacle of automotive luxury and technology. Experience ultimate comfort in this flagship executive sedan.",
    images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=2070"],
    video: "https://www.youtube.com/embed/dip_8cGOSI4",
    owner: "6616a9cf87144d11b880b643",
    availability: true,
    isApproved: true,
    features: ["Massaging Seats", "OLED Screens", "Air Suspension", "Champagne Cooler"]
  },
  {
    brand: "Porsche",
    model: "911 GT3 RS",
    year: 2023,
    pricePerDay: 35000,
    category: "Sports",
    transmission: "Automatic",
    fuelType: "Petrol",
    seatingCapacity: 2,
    location: "GAJUWAKA",
    description: "A street-legal track monster. Razor-sharp handling and a screaming naturally aspirated flat-six engine.",
    images: ["/cars/porsche.png"],
    video: "https://www.youtube.com/embed/zbwQ1NqY6k8",
    owner: "6616a9cf87144d11b880b643",
    availability: true,
    isApproved: true,
    features: ["Carbon Fiber Aero", "Roll Cage", "PDK Transmission"]
  },
  {
    brand: "Tesla",
    model: "Model S Plaid",
    year: 2024,
    pricePerDay: 18000,
    category: "Electric",
    transmission: "Automatic",
    fuelType: "Electric",
    seatingCapacity: 5,
    location: "NAD",
    description: "Insane acceleration and sustainable luxury. The fastest accelerating production car on earth.",
    images: ["/cars/tesla.png"],
    video: "https://www.youtube.com/embed/5Y2iJitJ4XQ",
    owner: "6616a9cf87144d11b880b643",
    availability: true,
    isApproved: true,
    features: ["Autopilot", "Yoke Steering", "0-60 in 1.99s"]
  },
  {
    brand: "Range Rover",
    model: "Autobiography",
    year: 2024,
    pricePerDay: 20000,
    category: "SUV",
    transmission: "Automatic",
    fuelType: "Diesel",
    seatingCapacity: 7,
    location: "PENDURTHI",
    description: "The most capable and luxurious SUV in the world. Perfect for commanding any terrain in absolute comfort.",
    images: ["/cars/rangerover.png"],
    video: "https://www.youtube.com/embed/NnLspHEx3q0",
    owner: "6616a9cf87144d11b880b643",
    availability: true,
    isApproved: true,
    features: ["Terrain Response 2", "Meridian Sound", "Panoramic Roof"]
  },
  {
    brand: "Lamborghini",
    model: "Huracán EVO",
    year: 2023,
    pricePerDay: 45000,
    category: "Supercar",
    transmission: "Automatic",
    fuelType: "Petrol",
    seatingCapacity: 2,
    location: "VISAKHAPATNAM",
    description: "Raw Italian passion. A naturally aspirated V10 engine delivering an unforgettable driving soundtrack.",
    images: ["/cars/lamborghini.png"],
    video: "https://www.youtube.com/embed/p1o1H52eEqc",
    owner: "6616a9cf87144d11b880b643",
    availability: true,
    isApproved: true,
    features: ["V10 Engine", "All-Wheel Steering", "Carbon Ceramic Brakes"]
  },
  {
    brand: "Rolls-Royce",
    model: "Ghost",
    year: 2024,
    pricePerDay: 55000,
    category: "Ultra-Luxury",
    transmission: "Automatic",
    fuelType: "Petrol",
    seatingCapacity: 4,
    location: "MADHURAWADA",
    description: "The ultimate expression of success. Experience the magic carpet ride and absolute silence in the cabin.",
    images: ["/cars/rollsroyce.png"],
    video: "https://www.youtube.com/embed/H37rP-6M9P4",
    owner: "6616a9cf87144d11b880b643",
    availability: true,
    isApproved: true,
    features: ["Starlight Headliner", "Magic Carpet Ride", "Bespoke Audio"]
  },
  {
    brand: "Ferrari",
    model: "F8 Tributo",
    year: 2023,
    pricePerDay: 48000,
    category: "Supercar",
    transmission: "Automatic",
    fuelType: "Petrol",
    seatingCapacity: 2,
    location: "VISAKHAPATNAM",
    description: "A celebration of excellence. The most powerful V8 engine Ferrari has ever created for a non-special series car.",
    images: ["/cars/ferrari.png"],
    video: "https://www.youtube.com/embed/8v_5rYkQeEE",
    owner: "6616a9cf87144d11b880b643",
    availability: true,
    isApproved: true,
    features: ["Twin-Turbo V8", "Side Slip Control", "F1 Transmission"]
  },
  {
    brand: "Audi",
    model: "RS e-tron GT",
    year: 2024,
    pricePerDay: 22000,
    category: "Electric",
    transmission: "Automatic",
    fuelType: "Electric",
    seatingCapacity: 4,
    location: "GAJUWAKA",
    description: "Electric mobility meets sports car performance in a stunning four-door grand tourer design.",
    images: ["/cars/audi.png"],
    video: "https://www.youtube.com/embed/2_Y4A12B2eY",
    owner: "6616a9cf87144d11b880b643",
    availability: true,
    isApproved: true,
    features: ["Quattro 100% Electric", "Carbon Roof", "Laser Lights"]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");
    
    await Car.deleteMany({});
    console.log("Existing cars cleared.");
    
    await Car.insertMany(sampleCars);
    console.log("Sample cars seeded successfully!");
    
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
