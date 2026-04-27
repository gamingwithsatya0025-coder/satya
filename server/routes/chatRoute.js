import express from "express";
import { HfInference } from "@huggingface/inference";
import carModel from "../models/carModel.js";
import { sampleCars } from "../utils/sampleData.js";

const chatRouter = express.Router();

// Local response engine for absolute reliability
const handleLocalFallback = async (message) => {
    const query = message.toLowerCase();
    let cars = [];
    try {
        cars = await carModel.find({ isApproved: true });
        if (cars.length === 0) cars = sampleCars;
    } catch (e) {
        cars = sampleCars;
    }
    
    const getCarExamples = (carList, count = 2) => {
        if (!carList || carList.length === 0) carList = sampleCars;
        return carList.slice(0, count).map(c => `${c.brand} ${c.model}`).join(" and ");
    };

    if (query.match(/^(hello|hi|hey|greetings)/)) {
        return "Hello! I'm your Idle Wheels Concierge. I can help you find luxury vehicles like our " + getCarExamples(cars) + ". How can I assist you today?";
    }
    
    // ... Simplified local logic for brevity in fallback ...
    return `I'm your Idle Wheels Assistant. We have elite machines like the ${getCarExamples(cars)} ready for your journey. What are you looking for?`;
};

// Hugging Face Intelligence
chatRouter.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
    
    // If no token or placeholder, use local fallback immediately
    if (!HF_TOKEN || HF_TOKEN === "hf_your_token_here") {
        const reply = await handleLocalFallback(message);
        return res.json({ success: true, reply });
    }

    const hf = new HfInference(HF_TOKEN);
    
    // Fetch live data to ground the AI
    let cars = [];
    try {
        cars = await carModel.find({ isApproved: true });
        if (cars.length === 0) cars = sampleCars;
    } catch (e) {
        cars = sampleCars;
    }

    const fleetSummary = cars.map(c => `${c.brand} ${c.model} in ${c.location} (₹${c.pricePerDay}/day)`).join(", ");

    const systemPrompt = `You are the "Super Concierge" for Idle Wheels, a premium luxury car rental platform. 
    Tone: Professional, elite, helpful, and sophisticated.
    Context:
    - Current Fleet: ${fleetSummary}.
    - Verification: Requires Aadhaar card and Driving License. Approved instantly by AI.
    - Cities: We serve multiple major Indian cities.
    - Categories: Luxury sedans, Majestic SUVs, and Performance sports cars.
    
    Task: Answer the user's question about cars, booking, or the platform using the context above. If they ask for a car we don't have, suggest the closest luxury alternative from our fleet.
    
    User says: "${message}"`;

    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      inputs: systemPrompt,
      parameters: {
        max_new_tokens: 150,
        return_full_text: false,
        temperature: 0.7,
      },
    });

    const replyText = response.generated_text?.trim();
    
    if (replyText) {
        return res.json({ success: true, reply: replyText });
    }

    throw new Error("No response from HF");

  } catch (err) {
    console.error("AI Error:", err.message);
    const fallbackReply = await handleLocalFallback(message);
    res.json({ success: true, reply: fallbackReply });
  }
});

export default chatRouter;
