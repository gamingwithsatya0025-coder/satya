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
    return `Hello! How can I help you? <br><br> <a href='/cars' style='color:#f59e0b; font-weight:bold; text-decoration:underline;'>Browse our full fleet here</a>`;
  }

  return `I'm here to assist with car discovery and booking. <br><br> <a href='/cars' style='color:#f59e0b; font-weight:bold; text-decoration:underline;'>View All Cars</a>`;
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
          content: `You are AI for Idle Wheels. 

FORMATTING RULES (CRITICAL):
1. NO MARKDOWN: NEVER use hashtags (#), asterisks (*), or markdown symbols.
2. USE HTML ONLY: Use <b> for bolding, <br><br> for paragraph spacing, and <ul>/<li> for lists.
3. CONCISE RESPONSE: Just answer the query directly. DO NOT give extra details or unnecessary information.
4. POINT-TO-POINT: Answer in a systematic, point-to-point manner.
5. NEATNESS: Ensure clean sentence structure and generous spacing using <br><br>.

Current Fleet: ${fleetSummary}.

INSTRUCTIONS:
- SUGGEST cars ONLY when explicitly asked.
- Format car suggestions like this:
<br><br><b>Elite Recommendation:</b><br>BRAND MODEL<br><img src="IMAGE_URL_HERE" style="width:100%; border-radius:15px; margin:15px 0;" alt="Car"><br><a href="LINK_URL_HERE" style="color:#f59e0b; font-weight:bold; text-decoration:underline;">View Elite Specs</a><br><br>`,
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
