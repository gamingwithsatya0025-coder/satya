import express from "express";
import { HfInference } from "@huggingface/inference";
import carModel from "../models/carModel.js";
import { sampleCars } from "../utils/sampleData.js";

const chatRouter = express.Router();

// 🔹 Local Fallback Engine for Reliability
const handleLocalFallback = async (message) => {
  const query = message?.toLowerCase() || "";
  let cars = [];
  try {
    cars = await carModel.find({ isApproved: true });
    if (cars.length === 0) cars = sampleCars;
  } catch (e) {
    cars = sampleCars;
  }

  const getCarExamples = (carList, count = 2) => {
    if (!carList || carList.length === 0) carList = sampleCars;
    return carList
      .slice(0, count)
      .map((c) => `<b>${c.brand} ${c.model}</b>`)
      .join(" and ");
  };

  if (query.match(/^(hello|hi|hey|greetings)/)) {
    return `Hello! I'm your Idle Wheels Concierge. I can help you find luxury vehicles like our ${getCarExamples(cars)}. <br><br> <a href='/cars' style='color:#f59e0b; font-weight:bold; text-decoration:underline;'>Browse our full fleet here</a>`;
  }

  return `I'm your Idle Wheels Assistant. We have elite machines like the ${getCarExamples(cars)} ready for your journey. <br><br> <a href='/cars' style='color:#f59e0b; font-weight:bold; text-decoration:underline;'>View All Cars</a>`;
};

// 🔹 Chat endpoint
chatRouter.post("/chat", async (req, res) => {
  const userMsg = req.body.message;

  try {
    const hf = new HfInference(
      process.env.HF_API_KEY || process.env.HUGGINGFACE_TOKEN,
    );

    // Fetch live data to ground the AI
    let cars = [];
    try {
      cars = await carModel.find({ isApproved: true });
      if (cars.length === 0) cars = sampleCars;
    } catch (e) {
      cars = sampleCars;
    }

    const fleetSummary = cars
      .map(
        (c) =>
          `${c.brand} ${c.model} (₹${c.pricePerDay}/day). Link: /car-details/${c._id}. Image: ${c.images[0]}`,
      )
      .join(" | ");

    const response = await hf.chatCompletion({
      // Mistral-7B was deprecated on the free tier, automatically routing to Qwen 32B for guaranteed uptime
      model: "Qwen/Qwen2.5-Coder-32B-Instruct",
      messages: [
        {
          role: "system",
          content: `You are the AI Concierge for Idle Wheels, a premium car rental service. 
Current Fleet: ${fleetSummary}. 
Task: Answer the user concisely and professionally based ONLY on their specific query.
- If they just say "hi" or ask a general question, greet them normally WITHOUT showing any cars, images, or links.
- Only suggest cars and show images if they EXPLICITLY ask for car recommendations, prices, or want to rent.
- When you DO suggest a car, you MUST include its image and link using this HTML format:
<br><img src="IMAGE_URL_HERE" style="width:100%; border-radius:8px; margin-top:8px; margin-bottom:8px;" alt="Car"><br><a href="LINK_URL_HERE" style="color:#f59e0b; font-weight:bold; text-decoration:underline;">View Details</a><br>`,
        },
        { role: "user", content: userMsg },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error("Empty reply");
    }

    res.json({ success: true, reply });
  } catch (err) {
    console.error("HF Inference API Error:", err.message);
    // If HF fails (e.g. token expired, provider down), gracefully fall back
    const reply = await handleLocalFallback(userMsg);
    res.json({ success: true, reply });
  }
});

export default chatRouter;
