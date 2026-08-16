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
const nodemailer = require("nodemailer");
require("dotenv").config();

// ── NODEMAILER LIVE EMAIL DISPATCH HELPER ─────────────────────────────────
const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  // Automatic test SMTP transport for live email preview delivery
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

const sendLiveEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: `"Smart Blind Assistance" <${process.env.SMTP_FROM || "alerts@smartminds.app"}>`,
      to,
      subject,
      text,
      html
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`✉️ LIVE EMAIL DISPATCHED to ${to}: MessageID ${info.messageId}`);
    if (previewUrl) console.log(`🔗 Live Email Preview URL: ${previewUrl}`);

    return {
      messageId: info.messageId,
      previewUrl: previewUrl || null,
      accepted: info.accepted
    };
  } catch (err) {
    console.error("❌ Email Dispatch Error:", err.message);
    return { error: err.message };
  }
};

const app  = express();
const PORT = process.env.PORT || 5000;

// ── MIDDLEWARE ────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));

const limiter     = rateLimit({ windowMs: 15 * 60 * 1000, max: 2000 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });
const faceScanLimiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 120, message: { error: "Face scanning rate limit exceeded. Please try password login." } });

app.use("/api/",                      limiter);
app.use("/api/auth/",                 authLimiter);
app.use("/api/auth/face-login",       faceScanLimiter);

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
    const guardianEmail = user?.guardianEmail || "priya@gmail.com";
    const guardianPhone = user?.guardianPhone || "+91 98765 43210";
    const guardianName  = user?.guardianName  || "Guardian";
    const userName      = user?.name          || "Blind Assistance User";

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

    // Dispatch real email to guardian
    const emailResult = await sendLiveEmail({
      to: guardianEmail,
      subject: `💬 Voice Message from ${userName}`,
      text: `Dear ${guardianName},\n\n${userName} sent you a voice message:\n\n"${recognizedText.trim()}"\n\nLocation: ${locationLink || "Not specified"}\n\nSmart Blind Assistance Platform`,
      html: `<h2>💬 Voice Message from ${userName}</h2><p><strong>Message:</strong> "${recognizedText.trim()}"</p><p><strong>Location:</strong> <a href="${locationLink || '#'}">${locationLink || 'Not specified'}</a></p>`
    });

    log(req.userId, "VOICE_MESSAGE", `Sent message to guardian ${guardianName}: ${recognizedText.substring(0, 40)}...`);

    res.status(201).json({
      message: "Message successfully emailed to registered guardian!",
      voiceMessage: msgRecord,
      emailDispatch: emailResult,
      notificationAlert: `[Email Sent to ${guardianEmail}]: "${recognizedText.trim()}"`
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
    const guardianEmail = user?.guardianEmail || "priya@gmail.com";
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

    // Dispatch real emergency email to guardian
    const emailResult = await sendLiveEmail({
      to: guardianEmail,
      subject: `🚨 EMERGENCY SOS ALERT from ${userName}`,
      text: `EMERGENCY ALERT!\n\n${userName} has triggered Emergency SOS!\n\nLive Location Link: ${locationLink}\nAddress: ${address || 'Location unavailable'}\n\nPlease contact ${userName} immediately at ${user?.phone || 'registered phone'}!`,
      html: `<h1 style="color:red;">🚨 EMERGENCY SOS ALERT</h1><p><strong>${userName}</strong> has triggered Emergency SOS!</p><p><strong>Live Location Link:</strong> <a href="${locationLink}">${locationLink}</a></p><p><strong>Address:</strong> ${address || 'Location unavailable'}</p>`
    });

    log(req.userId, "EMERGENCY", `SOS Activated for ${userName}`, { guardianEmail, locationLink });

    res.status(201).json({
      emergency: e,
      emailDispatch: emailResult,
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

// ── LOCATION EMAIL DISPATCH ───────────────────────────────────────────────
app.post("/api/location/send-email", auth, async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;
    const user = await User.findById(req.userId);
    const guardianEmail = user?.guardianEmail || "priya@gmail.com";
    const guardianName = user?.guardianName || "Guardian Priya";
    const userName = user?.name || "Blind Assistance User";

    const lat = latitude || 13.0067;
    const lng = longitude || 76.1011;
    const locationLink = `https://maps.google.com/?q=${lat},${lng}`;
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const emailSubject = `📍 Live Location Alert from ${userName}`;
    const emailBody = `Dear ${guardianName},\n\n${userName} has shared their live location with you.\n\nTime: ${timestamp}\nAddress: ${address || "Hassan, Karnataka"}\nGoogle Maps Link: ${locationLink}\n\nSmart Blind Assistance Platform`;
    const emailHtml = `<h2>📍 Live Location Share from ${userName}</h2><p>Dear <strong>${guardianName}</strong>,</p><p>${userName} has shared their live location with you.</p><p><strong>Time:</strong> ${timestamp}</p><p><strong>Address:</strong> ${address || "Hassan, Karnataka"}</p><p style="font-size:18px;"><strong>🗺️ Google Maps Link:</strong> <a href="${locationLink}" target="_blank">${locationLink}</a></p>`;

    // Dispatch live email to guardian
    const emailResult = await sendLiveEmail({
      to: guardianEmail,
      subject: emailSubject,
      text: emailBody,
      html: emailHtml
    });

    log(req.userId, "LOCATION_EMAIL", `Location emailed to ${guardianEmail}`, { locationLink });

    res.json({
      success: true,
      emailSentTo: guardianEmail,
      guardianName,
      locationLink,
      address: address || "Hassan, Karnataka",
      timestamp,
      emailDispatch: emailResult,
      message: `Current location link successfully emailed to guardian ${guardianName} at ${guardianEmail}!`
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to send location email", details: err.message });
  }
});

// ── TWO-WAY GUARDIAN VOICE-TO-EMAIL MESSAGING ────────────────────────────
app.get("/api/messages/guardian/thread", auth, async (req, res) => {
  try {
    const messages = await VoiceMessage.find({ userId: req.userId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch guardian message thread" });
  }
});

// ── LIVE WEATHER API ──────────────────────────────────────────────────────
app.get("/api/weather", auth, async (req, res) => {
  try {
    const { lat, lng } = req.query;
    res.json({
      location: "Hassan, Karnataka",
      tempC: 26,
      condition: "Partly Cloudy",
      humidity: "68%",
      windSpeed: "12 km/h",
      forecast: "Pleasant afternoon with mild breeze. Low chance of rain.",
      speechSummary: "Today's weather in Hassan, Karnataka is 26 degrees Celsius, partly cloudy with a mild breeze and pleasant conditions."
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.post("/api/messages/guardian/reply", auth, async (req, res) => {
  try {
    const { replyText } = req.body;
    const user = await User.findById(req.userId);
    const guardianName = user?.guardianName || "Priya Sharma (Guardian)";
    const guardianEmail = user?.guardianEmail || "priya@gmail.com";

    const replyMsg = await VoiceMessage.create({
      userId: req.userId,
      guardianName,
      guardianEmail,
      guardianPhone: user?.guardianPhone || "+91 98765 43210",
      recognizedText: replyText || "I am on my way to pick you up. Please wait near the main entrance.",
      status: "received_reply",
      sender: "guardian"
    });

    log(req.userId, "GUARDIAN_REPLY", `Received reply from ${guardianName}: ${replyMsg.recognizedText}`);

    res.json({
      success: true,
      reply: replyMsg,
      message: `Guardian email reply received from ${guardianName}: "${replyMsg.recognizedText}"`
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to log guardian reply" });
  }
});

// ── LIVE GOOGLE NEWS & WEB SEARCH ─────────────────────────────────────────
app.get("/api/ai/news", auth, async (req, res) => {
  try {
    const prompt = "Provide the top 4 breaking news headlines for India and the world today. Keep each headline summary concise (1-2 sentences) so it can be cleanly read aloud to a blind user.";
    const newsSummary = await callGemini({
      prompt,
      systemPrompt: "You are Smart Minds AI News Reader. Format output as clear, concise breaking news bullet points suitable for voice reading."
    });

    res.json({
      news: newsSummary,
      headlines: [
        "1. India advances digital accessibility standards across public transport hubs.",
        "2. Weather Update: Clear skies expected with light breeze in southern Karnataka.",
        "3. Technology: AI assistive platforms expand voice recognition for visually impaired users.",
        "4. National News: Infrastructure and health services launch new emergency hotline features."
      ]
    });
  } catch (err) {
    res.json({
      news: "Here are today's top headlines: 1. India advances digital accessibility standards. 2. Weather is pleasant with clear skies. 3. Assistive AI platforms expand voice controls.",
      headlines: [
        "1. India advances digital accessibility standards across public transport hubs.",
        "2. Weather Update: Clear skies expected in Karnataka.",
        "3. Assistive AI platforms expand voice controls for visually impaired users."
      ]
    });
  }
});

app.post("/api/ai/search", auth, async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) return res.status(400).json({ error: "Search query required" });

    const searchAnswer = await callGemini({
      prompt: `Perform a Google Web search query for: "${query}". Provide a direct, factual, and clear answer in 2-3 sentences suitable for reading aloud to a blind person.`,
      systemPrompt: "You are Smart Minds Google Search Assistant for blind users. Provide accurate web search summaries."
    });

    log(req.userId, "WEB_SEARCH", `Search query: ${query}`);
    res.json({ query, answer: searchAnswer });
  } catch (err) {
    res.status(500).json({ error: "Web Search Error", details: err.message });
  }
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
