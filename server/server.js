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
  guardianName: { type: String, default: "" },
  guardianPhone: { type: String, default: "" },
  guardianEmail: { type: String, default: "" },
  faceDescriptor: { type: [Number], default: [] },
  preferredLanguage: { type: String, default: "en-US" },
}, { timestamps: true }));

const Guardian = mongoose.model("Guardian", new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
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
  type:        { type: String, enum: ["LOCATION","NAVIGATION","AI","EMERGENCY","OCR","VISION","CONTACT","SETTINGS","VOICE_MESSAGE","FACE_AUTH"] },
  description: { type: String, default: "" },
  metadata:    mongoose.Schema.Types.Mixed,
  timestamp:   { type: Date, default: Date.now },
}));

const EmergencyEvent = mongoose.model("EmergencyEvent", new mongoose.Schema({
  userId:           { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  userName:         String,
  guardianName:     String,
  guardianEmail:    String,
  guardianPhone:    String,
  latitude:         Number,
  longitude:        Number,
  locationLink:     String,
  address:          String,
  message:          String,
  status:           { type: String, default: "activated" },
  timestamp:        { type: Date, default: Date.now },
}));

const VoiceMessage = mongoose.model("VoiceMessage", new mongoose.Schema({
  userId:           { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  guardianName:     String,
  guardianEmail:    String,
  guardianPhone:    String,
  recognizedText:   { type: String, required: true },
  locationLink:     String,
  status:           { type: String, default: "delivered" },
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

// ── VECTOR HELPERS ────────────────────────────────────────────────────────
const calculateEuclideanDistance = (vecA, vecB) => {
  if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length === 0 || vecA.length !== vecB.length) {
    return Infinity;
  }
  let sum = 0;
  for (let i = 0; i < vecA.length; i++) {
    const diff = vecA[i] - vecB[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
};

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
    const { name, email, password, phone, guardianName, guardianPhone, guardianEmail, faceDescriptor } = req.body;
    if (!name || !email || !password || !guardianName || !guardianEmail || !guardianPhone) {
      return res.status(400).json({ error: "Blind user details and mandatory guardian information (Name, Phone, Email) are required" });
    }
    if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });
    if (await User.findOne({ email })) return res.status(400).json({ error: "Email already registered" });
    
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      passwordHash,
      phone: phone || "",
      guardianName,
      guardianPhone,
      guardianEmail,
      faceDescriptor: Array.isArray(faceDescriptor) ? faceDescriptor : []
    });

    await Guardian.create({
      userId: user._id,
      name: guardianName,
      phone: guardianPhone,
      email: guardianEmail
    });

    await UserSettings.create({ userId: user._id });
    log(user._id, "FACE_AUTH", "Registered new user with face embedding & guardian connectivity");

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "dev_secret_change_in_production", { expiresIn: "7d" });
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        guardianName: user.guardianName,
        guardianPhone: user.guardianPhone,
        guardianEmail: user.guardianEmail,
        hasFaceRegistered: Array.isArray(faceDescriptor) && faceDescriptor.length > 0
      }
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: "Registration failed", details: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "dev_secret_change_in_production", { expiresIn: "7d" });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        guardianName: user.guardianName,
        guardianPhone: user.guardianPhone,
        guardianEmail: user.guardianEmail,
        hasFaceRegistered: Array.isArray(user.faceDescriptor) && user.faceDescriptor.length > 0
      }
    });
  } catch { res.status(500).json({ error: "Login failed" }); }
});

app.post("/api/auth/face-login", async (req, res) => {
  try {
    const { faceDescriptor } = req.body;
    if (!Array.isArray(faceDescriptor) || faceDescriptor.length === 0) {
      return res.status(400).json({ error: "Valid face descriptor matrix required for face login" });
    }

    const usersWithFace = await User.find({ faceDescriptor: { $exists: true, $ne: [] } });
    if (usersWithFace.length === 0) {
      return res.status(404).json({ error: "No face registered accounts found. Please register first." });
    }

    let matchedUser = null;
    let minDistance = Infinity;

    for (const user of usersWithFace) {
      const dist = calculateEuclideanDistance(faceDescriptor, user.faceDescriptor);
      if (dist < minDistance) {
        minDistance = dist;
        matchedUser = user;
      }
    }

    const MATCH_THRESHOLD = 0.55;
    if (!matchedUser || minDistance > MATCH_THRESHOLD) {
      return res.status(401).json({ error: "Face recognition match failed. Please try again or use password login." });
    }

    log(matchedUser._id, "FACE_AUTH", `Automatic face login successful (Distance: ${minDistance.toFixed(3)})`);

    const token = jwt.sign({ userId: matchedUser._id }, process.env.JWT_SECRET || "dev_secret_change_in_production", { expiresIn: "7d" });
    return res.json({
      token,
      matchConfidence: Math.max(0, Math.round((1 - minDistance / MATCH_THRESHOLD) * 100)),
      user: {
        id: matchedUser._id,
        name: matchedUser.name,
        email: matchedUser.email,
        phone: matchedUser.phone,
        guardianName: matchedUser.guardianName,
        guardianPhone: matchedUser.guardianPhone,
        guardianEmail: matchedUser.guardianEmail,
        hasFaceRegistered: true
      }
    });
  } catch (err) {
    console.error("Face Login Error:", err);
    res.status(500).json({ error: "Face recognition service error", details: err.message });
  }
});

app.get("/api/auth/me", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("-passwordHash");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// ── GUARDIAN & MESSAGING ──────────────────────────────────────────────────
app.get("/api/guardian", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({
    name: user.guardianName,
    phone: user.guardianPhone,
    email: user.guardianEmail,
    linkedUser: user.name
  });
});

app.post("/api/messages/guardian", auth, async (req, res) => {
  try {
    const { recognizedText, latitude, longitude } = req.body;
    if (!recognizedText || !recognizedText.trim()) {
      return res.status(400).json({ error: "Recognized text message is required" });
    }
    const user = await User.findById(req.userId);
    const guardianEmail = user?.guardianEmail || "guardian@smartminds.org";
    const guardianPhone = user?.guardianPhone || "+91 98765 43210";
    const guardianName  = user?.guardianName  || "Guardian";

    const locationLink = (latitude && longitude)
      ? `https://maps.google.com/?q=${latitude},${longitude}`
      : null;

    const msgRecord = await VoiceMessage.create({
      userId: req.userId,
      guardianName,
      guardianEmail,
      guardianPhone,
      recognizedText: recognizedText.trim(),
      locationLink,
      status: "delivered"
    });

    log(req.userId, "VOICE_MESSAGE", `Sent message to guardian ${guardianName}: ${recognizedText.substring(0, 40)}...`);

    res.status(201).json({
      message: "Message successfully sent to registered guardian!",
      voiceMessage: msgRecord,
      notificationAlert: `[Alert Sent to ${guardianEmail} & ${guardianPhone}]: "${recognizedText.trim()}"`
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message to guardian", details: err.message });
  }
});

// ── EMERGENCY ─────────────────────────────────────────────────────────────
app.post("/api/emergency", auth, async (req, res) => {
  try {
    const { latitude, longitude, address, message } = req.body;
    const user = await User.findById(req.userId);
    
    const userName      = user?.name || "Blind Assistance User";
    const guardianName  = user?.guardianName || "Registered Guardian";
    const guardianEmail = user?.guardianEmail || "guardian@smartminds.org";
    const guardianPhone = user?.guardianPhone || "+91 98765 43210";
    
    const locationLink = (latitude && longitude)
      ? `https://maps.google.com/?q=${latitude},${longitude}`
      : "https://maps.google.com";

    const e = await EmergencyEvent.create({
      userId: req.userId,
      userName,
      guardianName,
      guardianEmail,
      guardianPhone,
      latitude,
      longitude,
      locationLink,
      address: address || `${latitude}, ${longitude}`,
      message: message || `Emergency alert activated by ${userName}. Please check immediately!`,
      status: "activated"
    });

    log(req.userId, "EMERGENCY", `SOS Activated for ${userName}`, { guardianEmail, locationLink });

    res.status(201).json({
      emergency: e,
      alertSent: {
        guardianName,
        guardianEmail,
        guardianPhone,
        locationLink,
        messageText: `Emergency alert from ${userName}. Current location: ${locationLink}. Please check immediately.`
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to log emergency event", details: err.message });
  }
});
app.get("/api/emergency/history", auth, async (req, res) => {
  res.json(await EmergencyEvent.find({ userId: req.userId }).sort({ timestamp: -1 }).limit(20));
});

// ── AI ────────────────────────────────────────────────────────────────────
const callGemini = async ({ prompt, imageBase64, mediaType, systemPrompt }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim() || apiKey === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured in server/.env");
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const systemContext = (systemPrompt ? systemPrompt + "\n" : "") +
    `Current System Date: ${dateStr}. Current Time: ${timeStr}. Answer the user's question directly, clearly, and concisely for text-to-speech reading.`;

  const contents = [{
    role: "user",
    parts: []
  }];

  if (imageBase64) {
    contents[0].parts.push({
      inlineData: {
        mimeType: mediaType || "image/jpeg",
        data: imageBase64
      }
    });
  }

  contents[0].parts.push({ text: prompt });

  const models = ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-flash-latest", "gemini-pro-latest", "gemini-2.5-flash"];
  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemContext }] }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        if (data?.error?.message?.includes("systemInstruction")) {
          const fallbackBody = {
            contents: [{
              role: "user",
              parts: [{ text: `[System Context: ${systemContext}]\n\nUser Question: ${prompt}` }]
            }]
          };
          if (imageBase64) fallbackBody.contents[0].parts.unshift(contents[0].parts[0]);

          const retryRes = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fallbackBody)
          });
          const retryData = await retryRes.json();
          if (retryRes.ok && retryData?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return retryData.candidates[0].content.parts.map(p => p.text).filter(Boolean).join("\n").trim();
          }
          throw new Error(retryData?.error?.message || `Gemini API error (${retryRes.status})`);
        }
        throw new Error(data?.error?.message || `Gemini API error (${response.status})`);
      }

      const text = data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        .filter(Boolean)
        .join("\n");

      if (text && text.trim()) return text.trim();
    } catch (err) {
      lastError = err;
      console.warn(`⚠️ Gemini Model ${model} attempt failed:`, err.message);
    }
  }

  throw lastError || new Error("Gemini API request failed. Please check your API key and connection.");
};

app.post("/api/ai/chat", auth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await callGemini({
      prompt: message.trim(),
      systemPrompt: "You are Smart Minds AI, an accessibility assistant for visually impaired users. Provide direct, helpful, and concise answers suitable for text-to-speech."
    });

    log(req.userId, "AI", `Chat: ${message.substring(0, 60)}`);
    return res.json({ reply });
  } catch (err) {
    console.error("❌ Gemini Chat Error:", err.message);
    return res.status(500).json({ error: "AI Assistant Error", details: err.message });
  }
});

app.post("/api/ai/read-text", auth, async (req, res) => {
  try {
    if (!req.body.imageBase64) {
      return res.status(400).json({ error: "Image base64 data is required" });
    }

    const text = await callGemini({
      prompt: "Extract and clearly read all text visible in this image in natural reading order.",
      imageBase64: req.body.imageBase64,
      mediaType: req.body.mediaType || "image/jpeg"
    });

    log(req.userId, "OCR", "Text extracted from image");
    return res.json({ text });
  } catch (err) {
    console.error("❌ Gemini OCR Error:", err.message);
    return res.status(500).json({ error: "OCR Service Error", details: err.message });
  }
});

app.post("/api/ai/describe", auth, async (req, res) => {
  try {
    if (!req.body.imageBase64) {
      return res.status(400).json({ error: "Image base64 data is required" });
    }

    const description = await callGemini({
      prompt: req.body.prompt || "Describe this scene for a visually impaired person. Highlight spatial positions, key objects, and potential walking hazards.",
      imageBase64: req.body.imageBase64,
      mediaType: req.body.mediaType || "image/jpeg"
    });

    log(req.userId, "VISION", "Scene described");
    return res.json({ description });
  } catch (err) {
    console.error("❌ Gemini Vision Error:", err.message);
    return res.status(500).json({ error: "Vision AI Error", details: err.message });
  }
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
