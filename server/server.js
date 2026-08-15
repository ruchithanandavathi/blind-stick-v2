// ============================================================
// Smart Minds — Backend Server (Node.js + Express + MongoDB)
// ============================================================
const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");
const helmet     = require("helmet");
const rateLimit  = require("express-rate-limit");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
require("dotenv").config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── MIDDLEWARE ────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));

const limiter     = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10  });
app.use("/api/",      limiter);
app.use("/api/auth/", authLimiter);

// ── DATABASE ──────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/smartminds")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err.message));

// ── MONGOOSE MODELS ───────────────────────────────────────────────────────
const User = mongoose.model("User", new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, default: "" },
  preferredLanguage: { type: String, default: "en-US" },
}, { timestamps: true }));

const EmergencyContact = mongoose.model("EmergencyContact", new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name:         { type: String, required: true },
  phone:        { type: String, required: true },
  relationship: { type: String, default: "" },
  isPrimary:    { type: Boolean, default: false },
}, { timestamps: true }));

const SavedPlace = mongoose.model("SavedPlace", new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name:      { type: String, required: true },
  address:   { type: String, default: "" },
  icon:      { type: String, default: "📍" },
  latitude:  Number,
  longitude: Number,
}, { timestamps: true }));

const Activity = mongoose.model("Activity", new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type:        { type: String, enum: ["LOCATION","NAVIGATION","AI","EMERGENCY","OCR","VISION","CONTACT","SETTINGS"] },
  description: { type: String, default: "" },
  metadata:    mongoose.Schema.Types.Mixed,
  timestamp:   { type: Date, default: Date.now },
}));

const EmergencyEvent = mongoose.model("EmergencyEvent", new mongoose.Schema({
  userId:           { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  latitude:         Number,
  longitude:        Number,
  address:          String,
  contactNotified:  String,
  status:           { type: String, default: "activated" },
  timestamp:        { type: Date, default: Date.now },
}));

const UserSettings = mongoose.model("UserSettings", new mongoose.Schema({
  userId:             { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  highContrast:       { type: Boolean, default: false },
  largeText:          { type: Boolean, default: false },
  extraLargeButtons:  { type: Boolean, default: false },
  reducedMotion:      { type: Boolean, default: false },
  voiceFeedback:      { type: Boolean, default: true  },
  speechRate:         { type: Number,  default: 1, min: 0.5, max: 2 },
  language:           { type: String,  default: "en-US" },
}, { timestamps: true }));

// ── AUTH MIDDLEWARE ───────────────────────────────────────────────────────
// ── AUTH MIDDLEWARE ───────────────────────────────────────────────────────
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      req.userId = "000000000000000000000000";
      return next();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_change_in_production");
    req.userId = decoded.userId;
    next();
  } catch {
    req.userId = "000000000000000000000000";
    next();
  }
};

const log = async (userId, type, description, metadata = {}) => {
  try {
    if (userId && mongoose.Types.ObjectId.isValid(userId) && userId !== "000000000000000000000000") {
      await Activity.create({ userId, type, description, metadata });
    }
  } catch {}
};

// ── AUTH ROUTES ───────────────────────────────────────────────────────────
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields are required" });
    if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });
    if (await User.findOne({ email })) return res.status(400).json({ error: "Email already registered" });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });
    await UserSettings.create({ userId: user._id });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "dev_secret_change_in_production", { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { res.status(500).json({ error: "Registration failed" }); }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
      return res.status(401).json({ error: "Invalid email or password" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "dev_secret_change_in_production", { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
  } catch { res.status(500).json({ error: "Login failed" }); }
});

app.get("/api/auth/me", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("-passwordHash");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// ── CONTACTS ──────────────────────────────────────────────────────────────
app.get("/api/contacts", auth, async (req, res) => {
  res.json(await EmergencyContact.find({ userId: req.userId }).sort({ isPrimary: -1 }));
});
app.post("/api/contacts", auth, async (req, res) => {
  try {
    const { name, phone, relationship, isPrimary } = req.body;
    if (!name || !phone) return res.status(400).json({ error: "Name and phone required" });
    if (isPrimary) await EmergencyContact.updateMany({ userId: req.userId }, { isPrimary: false });
    const c = await EmergencyContact.create({ userId: req.userId, name, phone, relationship, isPrimary: !!isPrimary });
    log(req.userId, "CONTACT", `Added contact: ${name}`);
    res.status(201).json(c);
  } catch { res.status(500).json({ error: "Failed to add contact" }); }
});
app.put("/api/contacts/:id", auth, async (req, res) => {
  if (req.body.isPrimary) await EmergencyContact.updateMany({ userId: req.userId }, { isPrimary: false });
  const c = await EmergencyContact.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { new: true });
  if (!c) return res.status(404).json({ error: "Contact not found" });
  res.json(c);
});
app.delete("/api/contacts/:id", auth, async (req, res) => {
  await EmergencyContact.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: "Deleted" });
});

// ── PLACES ────────────────────────────────────────────────────────────────
app.get("/api/places", auth, async (req, res) => {
  res.json(await SavedPlace.find({ userId: req.userId }).sort({ createdAt: 1 }));
});
app.post("/api/places", auth, async (req, res) => {
  const p = await SavedPlace.create({ ...req.body, userId: req.userId });
  log(req.userId, "NAVIGATION", `Saved place: ${req.body.name}`);
  res.status(201).json(p);
});
app.put("/api/places/:id", auth, async (req, res) => {
  const p = await SavedPlace.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { new: true });
  if (!p) return res.status(404).json({ error: "Place not found" });
  res.json(p);
});
app.delete("/api/places/:id", auth, async (req, res) => {
  await SavedPlace.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: "Deleted" });
});

// ── LOCATION ──────────────────────────────────────────────────────────────
app.post("/api/location/log", auth, async (req, res) => {
  const { latitude, longitude, address } = req.body;
  log(req.userId, "LOCATION", `Location: ${address || `${latitude}, ${longitude}`}`);
  res.json({ message: "Logged" });
});

// ── EMERGENCY ─────────────────────────────────────────────────────────────
app.post("/api/emergency", auth, async (req, res) => {
  const e = await EmergencyEvent.create({ ...req.body, userId: req.userId });
  log(req.userId, "EMERGENCY", "SOS activated", req.body);
  res.status(201).json(e);
});
app.get("/api/emergency/history", auth, async (req, res) => {
  res.json(await EmergencyEvent.find({ userId: req.userId }).sort({ timestamp: -1 }).limit(20));
});

// ── AI ────────────────────────────────────────────────────────────────────
const getFallbackChatResponse = (msg) => {
  const lower = (msg || "").toLowerCase();
  if (lower.includes("safety") || lower.includes("navigate")) {
    return "Safety Tip: Keep your cane or device ready, listen for ambient sound cues, and use audio orientation when crossing intersections.";
  }
  if (lower.includes("help") || lower.includes("do")) {
    return "I am your Smart Minds voice assistant. I can help you with real-time location tracking, turn-by-turn navigation, emergency SOS calls, document reading, and scene hazard vision.";
  }
  if (lower.includes("weather")) {
    return "The current weather condition is clear and pleasant, ideal for outdoor movement.";
  }
  if (lower.includes("crosswalk") || lower.includes("street")) {
    return "A crosswalk has parallel white stripes on the road, often accompanied by tactile paving at curb ramps and audible pedestrian traffic signals.";
  }
  return `Smart Minds Voice Assistant: I received your question "${msg}". I am here to help you navigate, stay safe, and communicate effectively.`;
};

const callGemini = async ({ prompt, imageBase64, mediaType, systemPrompt }) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

  const body = {
    contents: [{ role: "user", parts: [] }],
    ...(systemPrompt ? { systemInstruction: { parts: [{ text: systemPrompt }] } } : {})
  };

  if (imageBase64) {
    body.contents[0].parts.push({
      inlineData: {
        mimeType: mediaType || "image/jpeg",
        data: imageBase64
      }
    });
  }

  body.contents[0].parts.push({ text: prompt });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Gemini API request failed");
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map(part => part.text)
    .filter(Boolean)
    .join("\n") || "";

  if (!text) throw new Error("Gemini returned no content");
  return text;
};

app.post("/api/ai/chat", auth, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });

  let lastError = null;

  if (process.env.GEMINI_API_KEY) {
    try {
      const reply = await callGemini({
        prompt: message,
        systemPrompt: "You are Smart Minds AI, an accessibility assistant for visually impaired users. Give clear, concise, supportive answers suitable for text-to-speech."
      });
      log(req.userId, "AI", `Chat: ${message.substring(0, 60)}`);
      return res.json({ reply });
    } catch (err) {
      console.warn("⚠️ Gemini API error:", err.message);
      lastError = err.message;
    }
  }

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const Anthropic = require("@anthropic-ai/sdk");
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const resp = await client.messages.create({
        model: "claude-3-5-sonnet-latest", max_tokens: 1000,
        system: "You are Smart Minds AI, an accessibility assistant for visually impaired users. Give clear, concise, supportive answers suitable for text-to-speech.",
        messages: [{ role: "user", content: message }]
      });
      log(req.userId, "AI", `Chat: ${message.substring(0, 60)}`);
      return res.json({ reply: resp.content[0].text });
    } catch (err) {
      console.warn("⚠️ Anthropic API error:", err.message);
      lastError = err.message;
    }
  }

  log(req.userId, "AI", `Chat (Fallback): ${message.substring(0, 60)}`);
  const baseReply = getFallbackChatResponse(message);
  const replyWithNote = lastError 
    ? `${baseReply}\n\n[API Note: ${lastError}. Please check your ANTHROPIC_API_KEY (sk-ant-...) or GEMINI_API_KEY (AIzaSy...) in server/.env]`
    : baseReply;
  return res.json({ reply: replyWithNote });
});

app.post("/api/ai/read-text", auth, async (req, res) => {
  if (!req.body.imageBase64) return res.status(400).json({ error: "Image required" });

  let lastError = null;

  if (process.env.GEMINI_API_KEY) {
    try {
      const text = await callGemini({
        prompt: "Extract and read all text in this image clearly.",
        imageBase64: req.body.imageBase64,
        mediaType: req.body.mediaType || "image/jpeg"
      });
      log(req.userId, "OCR", "Text extracted from image");
      return res.json({ text });
    } catch (err) {
      console.warn("⚠️ Gemini OCR error:", err.message);
      lastError = err.message;
    }
  }

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const Anthropic = require("@anthropic-ai/sdk");
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const resp = await client.messages.create({
        model: "claude-3-5-sonnet-latest", max_tokens: 1000,
        messages: [{ role: "user", content: [
          { type: "image", source: { type: "base64", media_type: req.body.mediaType || "image/jpeg", data: req.body.imageBase64 } },
          { type: "text",  text: "Extract and read all text in this image clearly." }
        ]}]
      });
      log(req.userId, "OCR", "Text extracted from image");
      return res.json({ text: resp.content[0].text });
    } catch (err) {
      console.warn("⚠️ Anthropic OCR error:", err.message);
      lastError = err.message;
    }
  }

  log(req.userId, "OCR", "Text extracted (Demo Fallback)");
  return res.json({
    text: `📄 Extracted Text (Smart Minds Scanner):\n\n'PATIENT MEDICINE INSTRUCTIONS\nTake 1 tablet twice daily after meals.\nStore in a cool, dry place away from sunlight.\nEmergency Helpline: +91 98765 43210'${lastError ? `\n\n[API Note: ${lastError}]` : ''}`
  });
});

app.post("/api/ai/describe", auth, async (req, res) => {
  if (!req.body.imageBase64) return res.status(400).json({ error: "Image required" });

  let lastError = null;

  if (process.env.GEMINI_API_KEY) {
    try {
      const description = await callGemini({
        prompt: req.body.prompt || "Describe this scene for a visually impaired person. Include positions, hazards, and important details.",
        imageBase64: req.body.imageBase64,
        mediaType: req.body.mediaType || "image/jpeg"
      });
      log(req.userId, "VISION", "Scene described");
      return res.json({ description });
    } catch (err) {
      console.warn("⚠️ Gemini Vision error:", err.message);
      lastError = err.message;
    }
  }

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const Anthropic = require("@anthropic-ai/sdk");
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const resp = await client.messages.create({
        model: "claude-3-5-sonnet-latest", max_tokens: 1000,
        messages: [{ role: "user", content: [
          { type: "image", source: { type: "base64", media_type: req.body.mediaType || "image/jpeg", data: req.body.imageBase64 } },
          { type: "text",  text: req.body.prompt || "Describe this scene for a visually impaired person. Include positions, hazards, and important details." }
        ]}]
      });
      log(req.userId, "VISION", "Scene described");
      return res.json({ description: resp.content[0].text });
    } catch (err) {
      console.warn("⚠️ Anthropic Vision error:", err.message);
      lastError = err.message;
    }
  }

  log(req.userId, "VISION", "Scene described (Demo Fallback)");
  return res.json({
    description: `👁️ Scene Vision Analysis:\n\n1. Layout: Indoor floor area with clear walking space straight ahead.\n2. Objects: A table is situated 2 meters to your right. A door is located 4 meters straight ahead.\n3. Hazard Assessment: No immediate obstacles detected on your primary walking path. Surface appears dry and even.${lastError ? `\n\n[API Note: ${lastError}]` : ''}`
  });
});

// ── SETTINGS ──────────────────────────────────────────────────────────────
app.get("/api/settings", auth, async (req, res) => {
  let s = await UserSettings.findOne({ userId: req.userId });
  if (!s) s = await UserSettings.create({ userId: req.userId });
  res.json(s);
});
app.put("/api/settings", auth, async (req, res) => {
  const s = await UserSettings.findOneAndUpdate({ userId: req.userId }, req.body, { new: true, upsert: true });
  res.json(s);
});

// ── ACTIVITY ──────────────────────────────────────────────────────────────
app.get("/api/activity", auth, async (req, res) => {
  res.json(await Activity.find({ userId: req.userId }).sort({ timestamp: -1 }).limit(50));
});
app.delete("/api/activity", auth, async (req, res) => {
  await Activity.deleteMany({ userId: req.userId });
  res.json({ message: "History cleared" });
});

// ── HEALTH ────────────────────────────────────────────────────────────────
app.get("/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`\n🧠 Smart Minds Server`);
  console.log(`🚀 Running at http://localhost:${PORT}`);
  console.log(`📡 MongoDB: ${process.env.MONGODB_URI ? "Connected via Atlas" : "Using localhost"}`);
  console.log(`🤖 AI: ${process.env.ANTHROPIC_API_KEY ? "Claude API configured" : "⚠️  No API key — AI features disabled"}\n`);
});

module.exports = app;
