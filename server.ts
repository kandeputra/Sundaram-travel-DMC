import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Health
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      name: "SUNDARAM.TRAVEL API",
      company: "PT. Bali Sundaram Travel",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  });

  // AI-Assisted Custom Bali Itinerary Generator ("Plan My Trip")
  app.post("/api/itinerary/generate", async (req, res) => {
    try {
      const {
        destination,
        dates,
        days,
        adults,
        children,
        hotelCategory,
        activities,
        transportation,
        guideLanguage,
        mealPreferences,
        budget,
        specialRequests,
        currency = "USD",
      } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are the chief master travel planner for PT. Bali Sundaram Travel (SUNDARAM.TRAVEL), a premier destination management company in Bali, Indonesia.
Create a personalized, luxury-crafted, daily itinerary based on:
- Destination: ${destination || "Bali, Indonesia"}
- Duration: ${days || 4} Days
- Party: ${adults || 2} Adults, ${children || 0} Children
- Hotel Tier: ${hotelCategory || "4-Star Deluxe Resort / Villa"}
- Preferred Activities: ${(activities || []).join(", ") || "Culture, Adventure, Beaches, Culinary"}
- Transport: ${transportation || "Private AC Vehicle with Dedicated Driver-Guide"}
- Guide Language: ${guideLanguage || "English"}
- Meal Preferences: ${mealPreferences || "Authentic Balinese & International"}
- Budget: ${budget || "Moderate to Luxury"} (${currency})
- Special Requests: ${specialRequests || "None"}

Respond strictly in valid JSON format with the following schema:
{
  "title": "Short poetic title for the itinerary",
  "summary": "2-3 sentences overview highlighting bespoke experiences",
  "estimatedCost": "Formatted cost estimate string in ${currency}",
  "inclusions": ["List of 4-6 key inclusions"],
  "days": [
    {
      "day": 1,
      "theme": "Day title e.g. Arrival & Jimbaran Sunset Welcome",
      "morning": "Morning activity description with Bali landmark",
      "afternoon": "Afternoon activity description",
      "evening": "Evening dining / cultural experience",
      "highlight": "The signature moment of this day",
      "recommendedAttire": "Suggested dress code or essentials"
    }
  ],
  "expertTips": ["3 practical local tips from Sundaram Travel's local Balinese concierge"]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({ success: true, data: parsed });
        }
      }

      // High-grade fallback if API key not present or call fails
      const fallbackDays = [];
      const numDays = Math.min(Math.max(Number(days) || 3, 1), 7);
      const themes = [
        {
          theme: "Warm Arrival & Sunset Serenade in Uluwatu",
          m: "Airport VIP greeting with fragrant frangipani leis & private transfer to resort check-in.",
          a: "Relaxation poolside or visit to Padang Padang Beach cliffside cove.",
          e: "Sunset Kecak Fire Dance atop the Uluwatu cliff temple followed by a beachfront candlelit seafood dinner at Jimbaran Bay.",
          h: "Sunset Kecak Dance with panoramic Indian Ocean views.",
          tip: "Modest attire with temple sash provided at Uluwatu.",
        },
        {
          theme: "Heart of Bali: Ubud Art, Waterfalls & Ancient Temples",
          m: "Early visit to the Sacred Monkey Forest Sanctuary and Ubud Royal Palace & traditional market stroll.",
          a: "Bespoke Bali Cooking Class or thrilling ATV quad adventure through jungle caves and rice paddies.",
          e: "Fine dining overlooking Campuhan Ridge with organic Balinese spiced duck (Bebek Betutu).",
          h: "Hidden bamboo tunnel ride and private waterfall blessing.",
          tip: "Comfortable walking shoes and mosquito repellent.",
        },
        {
          theme: "Sunrise Volcano or Rice Terrace Spiritual Journey",
          m: "Scenic drive to Jatiluwih UNESCO Rice Terraces or Mount Batur Caldera viewpoint with fresh Kintamani coffee.",
          a: "Ulun Danu Beratan iconic water temple on Lake Beratan and Handara Iconic Gate photo session.",
          e: "Holistic Balinese herbal spa massage (90 mins) using essential frangipani and lemongrass oils.",
          h: "Mist-covered Lake Beratan Temple reflection.",
          tip: "Light jacket for the cooler northern highlands.",
        },
        {
          theme: "Nusa Penida Island Paradise Expedition",
          m: "Fast boat voyage from Sanur Harbour to Nusa Penida West coast.",
          a: "Breathtaking views of Kelingking 'T-Rex' Cliff, Broken Beach natural arch, and Angel's Billabong infinity lagoon.",
          e: "Return fast boat to Bali mainland and sunset cocktail at Seminyak beach club.",
          h: "Spectacular turquoise waters of Kelingking Cliff.",
          tip: "Hat, sunglasses, sunscreen, and beach footwear.",
        },
        {
          theme: "East Bali Royal Heritage & Snorkeling Oasis",
          m: "Tirta Gangga Royal Water Palace stepping stones and feeding koi fish.",
          a: "Blue Lagoon Padangbai tropical reef snorkeling with clownfish and sea turtles.",
          e: "Relaxing farewell Balinese Rijsttafel feast under the stars.",
          h: "Crystal clear snorkeling and royal water garden fountains.",
          tip: "Swimwear and dry bag.",
        },
      ];

      for (let i = 0; i < numDays; i++) {
        const t = themes[i % themes.length];
        fallbackDays.push({
          day: i + 1,
          theme: `Day ${i + 1}: ${t.theme}`,
          morning: t.m,
          afternoon: t.a,
          evening: t.e,
          highlight: t.h,
          recommendedAttire: t.tip,
        });
      }

      return res.json({
        success: true,
        data: {
          title: `Custom ${numDays}-Day Bali Discovery Itinerary`,
          summary: `Carefully tailored by PT. Bali Sundaram Travel for ${adults || 2} travelers, featuring authentic cultural landmarks, private chauffeured transfers, and curated experiences across ${destination || "Bali"}.`,
          estimatedCost: `${currency} ${(Number(adults || 2) * (numDays * 115)).toLocaleString()}`,
          inclusions: [
            "Private air-conditioned vehicle with licensed English/Indonesian speaking driver-guide",
            "All entrance fees, donation tickets, and parking permits",
            "Mineral water and cold wet towels daily during transit",
            "Comprehensive 24/7 dedicated WhatsApp on-ground concierge assistance",
            "Sundaram Travel official electronic travel voucher & welcome kit",
          ],
          days: fallbackDays,
          expertTips: [
            "Always respect temple etiquette by wearing the provided sarong and sash.",
            "Exchange currency at authorized money changers or use digital QRIS / Card options supported across Bali.",
            "Sundaram Travel on-ground support is available 24/7 via WhatsApp at +62 812-3456-7890.",
          ],
        },
      });
    } catch (err) {
      console.error("Itinerary generation error:", err);
      res.status(500).json({ error: "Failed to generate itinerary" });
    }
  });

  // Simulated Test Payment Webhook / Callback Endpoint
  app.post("/api/payments/webhook", (req, res) => {
    const { bookingId, transactionStatus, paymentProvider } = req.body;
    console.log(`[PAYMENT WEBHOOK] Received webhook for ${bookingId} with status ${transactionStatus} via ${paymentProvider}`);
    res.json({
      received: true,
      bookingId,
      status: transactionStatus || "settlement",
      timestamp: new Date().toISOString(),
    });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SUNDARAM.TRAVEL server listening on port ${PORT}`);
  });
}

startServer();
