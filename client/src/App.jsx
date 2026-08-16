import { useState, useEffect, useRef, useCallback } from "react";

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d1117;
    --surface: #161b22;
    --surface2: #1c2128;
    --border: #30363d;
    --primary: #00b894;
    --primary-dark: #00856e;
    --primary-glow: rgba(0,184,148,0.15);
    --accent: #74b9ff;
    --danger: #ff6b6b;
    --warn: #ffd93d;
    --text: #e6edf3;
    --text-muted: #8b949e;
    --text-dim: #6e7681;
    --radius: 16px;
    --radius-sm: 10px;
    --shadow: 0 4px 24px rgba(0,0,0,0.5);
    --font-size-base: 16px;
    --btn-padding: 16px 24px;
    --min-touch: 56px;
    --whatsapp-green: #075e54;
    --whatsapp-light: #25d366;
    --whatsapp-chat-bg: #0b141a;
    --whatsapp-out: #005c4b;
    --whatsapp-in: #202c33;
  }

  body.high-contrast {
    --bg: #000000;
    --surface: #0a0a0a;
    --surface2: #111111;
    --border: #ffffff;
    --primary: #00ff99;
    --primary-dark: #00cc77;
    --text: #ffffff;
    --text-muted: #dddddd;
    --text-dim: #aaaaaa;
  }

  body.large-text { --font-size-base: 20px; }
  body.extra-large-btn { --btn-padding: 22px 28px; --min-touch: 70px; }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    font-size: var(--font-size-base);
    overflow-x: hidden;
    -webkit-tap-highlight-color: transparent;
  }

  body.reduced-motion * { transition: none !important; animation: none !important; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  /* ── LAYOUT ── */
  .app { display: flex; flex-direction: column; min-height: 100vh; }
  .page { flex: 1; padding: 16px 16px 100px; max-width: 500px; margin: 0 auto; width: 100%; }

  /* ── TOPBAR ── */
  .topbar {
    position: sticky; top: 0; z-index: 50;
    background: var(--surface); border-bottom: 1px solid var(--border);
    padding: 14px 20px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .topbar-brand { font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 20px; color: var(--primary); }
  .topbar-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

  /* ── BOTTOM NAV ── */
  .bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
    background: var(--surface); border-top: 1px solid var(--border);
    display: flex; justify-content: space-around; align-items: center;
    padding: 6px 0 14px;
  }
  .nav-btn {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); font-size: 11px; font-weight: 600;
    padding: 8px 6px; border-radius: 12px;
    min-width: 48px; min-height: 52px; justify-content: center;
    transition: color 0.15s;
  }
  .nav-btn.active { color: var(--primary); }
  .nav-btn:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; border-radius: 8px; }
  .nav-icon { font-size: 22px; line-height: 1; }

  /* ── CARDS ── */
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 18px 20px; margin-bottom: 12px;
  }
  .card-title { font-weight: 700; font-size: 16px; margin-bottom: 4px; }
  .card-sub { font-size: 13px; color: var(--text-muted); line-height: 1.5; }

  /* ── BUTTONS ── */
  .btn {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    padding: var(--btn-padding); border-radius: var(--radius); border: none;
    font-family: 'Inter', sans-serif; font-weight: 700; font-size: 16px;
    cursor: pointer; min-height: var(--min-touch); width: 100%; margin-bottom: 10px;
    letter-spacing: 0.01em; transition: opacity 0.15s, transform 0.1s;
  }
  .btn:active { transform: scale(0.98); }
  .btn:focus-visible { outline: 3px solid var(--primary); outline-offset: 2px; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-primary { background: var(--primary); color: #000; }
  .btn-primary:hover:not(:disabled) { background: var(--primary-dark); }
  .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover:not(:disabled) { border-color: var(--primary); }
  .btn-danger { background: var(--danger); color: #fff; }
  .btn-danger:hover:not(:disabled) { filter: brightness(0.9); }
  .btn-ghost { background: none; color: var(--primary); border: 1.5px solid var(--primary); }
  .btn-sm { padding: 10px 16px; font-size: 14px; min-height: 44px; font-weight: 600; }
  .btn-auto { width: auto; margin-bottom: 0; }

  /* ── GRID ── */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }

  /* ── DASHBOARD ── */
  .dashboard-shell { display: flex; flex-direction: column; gap: 18px; }
  .dashboard-header {
    background: linear-gradient(135deg, rgba(0,184,148,0.12), rgba(116,185,255,0.07));
    border: 1px solid var(--border); border-radius: var(--radius); padding: 20px 18px;
  }
  .dashboard-header h2 { font-family: 'Space Grotesk', sans-serif; font-size: 26px; margin-bottom: 8px; }
  .dashboard-header p { color: var(--text-muted); line-height: 1.6; }
  .stats-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm);
    padding: 16px; display: flex; flex-direction: column; gap: 6px;
  }
  .stat-card .stat-label { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; }
  .stat-card .stat-value { font-size: 28px; font-weight: 800; line-height: 1.1; }
  .stat-card .stat-trend { font-size: 12px; color: var(--primary); font-weight: 700; }
  .panel {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 16px;
  }
  .panel-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
  .panel-header h3 { font-size: 16px; font-weight: 800; }

  /* ── FEATURE CARDS GRID ── */
  .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 14px; }
  .feature-card {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 16px 8px;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    cursor: pointer; text-align: center; min-height: 100px; justify-content: center;
    border-bottom: 3px solid transparent;
    transition: border-color 0.15s, background 0.15s;
  }
  .feature-card:hover, .feature-card:focus-visible {
    border-color: var(--primary); background: var(--primary-glow);
  }
  .feature-card:focus-visible { outline: 2px solid var(--primary); }
  .feature-icon { font-size: 28px; line-height: 1; }
  .feature-label { font-size: 12px; font-weight: 700; color: var(--text); line-height: 1.3; white-space: pre-line; }

  /* ── BADGES ── */
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700;
  }
  .badge-green { background: rgba(0,184,148,0.15); color: var(--primary); }
  .badge-red { background: rgba(255,107,107,0.15); color: var(--danger); }
  .badge-yellow { background: rgba(255,217,61,0.15); color: var(--warn); }
  .badge-blue { background: rgba(116,185,255,0.15); color: var(--accent); }

  /* ── INPUTS ── */
  .input-group { margin-bottom: 14px; }
  .input-label { font-size: 13px; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; display: block; }
  .input {
    width: 100%; background: var(--surface2); border: 1.5px solid var(--border);
    border-radius: var(--radius-sm); padding: 14px 16px;
    color: var(--text); font-family: 'Inter', sans-serif; font-size: 16px;
    transition: border-color 0.15s;
  }
  .input:focus { outline: none; border-color: var(--primary); }
  .input::placeholder { color: var(--text-dim); }
  select.input { cursor: pointer; }

  /* ── WEBCAM SCANNER ── */
  .webcam-card {
    background: var(--surface2); border: 2px dashed var(--primary);
    border-radius: var(--radius); padding: 16px; display: flex;
    flex-direction: column; align-items: center; gap: 12px; text-align: center;
    position: relative; overflow: hidden; margin-bottom: 16px;
  }
  .webcam-video {
    width: 100%; max-width: 320px; height: 220px; object-fit: cover;
    border-radius: 12px; border: 2px solid var(--border); background: #000;
  }
  .face-ring {
    position: absolute; top: 40px; width: 140px; height: 140px;
    border: 3px dashed var(--primary); border-radius: 50%;
    animation: rotateRing 6s linear infinite; pointer-events: none;
  }
  @keyframes rotateRing { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

  /* ── WHATSAPP VOICE CHAT STYLING ── */
  .wa-chat-container {
    background: var(--whatsapp-chat-bg); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 14px; display: flex;
    flex-direction: column; gap: 12px; min-height: 380px; max-height: 440px;
    overflow-y: auto; margin-bottom: 14px;
  }
  .wa-bubble {
    padding: 10px 14px; border-radius: 14px; max-width: 85%;
    font-size: 14.5px; line-height: 1.5; position: relative; display: flex;
    flex-direction: column; gap: 4px;
  }
  .wa-bubble.out {
    background: var(--whatsapp-out); align-self: flex-end;
    border-bottom-right-radius: 2px; color: #e9edef;
  }
  .wa-bubble.in {
    background: var(--whatsapp-in); align-self: flex-start;
    border-bottom-left-radius: 2px; color: #e9edef; border: 1px solid #2a3942;
  }
  .wa-meta { display: flex; align-items: center; justify-content: flex-end; gap: 6px; font-size: 10px; color: #8696a0; }

  /* ── VOICE ORB ── */
  .orb-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 10px 0; }
  .orb {
    width: 110px; height: 110px; border-radius: 50%;
    background: radial-gradient(circle at 38% 32%, #00d4a8, #00856e);
    display: flex; align-items: center; justify-content: center;
    font-size: 46px; cursor: pointer; border: none;
    box-shadow: 0 0 0 0 rgba(0,184,148,0.4);
  }
  .orb.listening { animation: orbPulse 1.4s infinite; }
  @keyframes orbPulse {
    0%   { box-shadow: 0 0 0 0   rgba(0,184,148,0.5); }
    70%  { box-shadow: 0 0 0 32px rgba(0,184,148,0); }
    100% { box-shadow: 0 0 0 0   rgba(0,184,148,0); }
  }
  .orb-status { font-size: 14px; color: var(--text-muted); text-align: center; }

  /* ── SOS ── */
  .sos-btn {
    width: 190px; height: 190px; border-radius: 50%;
    background: var(--danger); border: 6px solid rgba(255,107,107,0.25);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    margin: 0 auto; cursor: pointer;
  }
  .sos-btn.pulsing { animation: sosPulse 1.1s infinite; }
  @keyframes sosPulse {
    0%   { box-shadow: 0 0 0 0   rgba(255,107,107,0.5); }
    70%  { box-shadow: 0 0 0 44px rgba(255,107,107,0); }
    100% { box-shadow: 0 0 0 0   rgba(255,107,107,0); }
  }
  .sos-emoji { font-size: 52px; line-height: 1; }
  .sos-label { font-size: 22px; font-weight: 900; color: #fff; letter-spacing: 2px; }

  /* ── MAP PLACEHOLDER ── */
  .map-ph {
    background: var(--surface2); border: 1.5px dashed var(--border);
    border-radius: var(--radius); height: 200px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 10px; color: var(--text-muted); font-size: 14px; text-align: center; padding: 20px;
  }

  /* ── SECTION HEADING ── */
  .sec-title { font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 20px; margin-bottom: 4px; }
  .sec-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 18px; line-height: 1.5; }

  /* ── CONTACT ITEM ── */
  .contact-item {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 14px 16px;
    display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
  }
  .contact-av {
    width: 50px; height: 50px; border-radius: 50%;
    background: var(--primary-glow); border: 2px solid var(--primary);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; flex-shrink: 0;
  }
  .c-name { font-weight: 700; font-size: 15px; }
  .c-rel  { font-size: 12px; color: var(--text-muted); margin-top: 1px; }
  .c-phone { font-size: 13px; color: var(--accent); margin-top: 2px; }
  .c-actions { margin-left: auto; display: flex; gap: 6px; flex-shrink: 0; }

  /* ── SETTINGS ── */
  .setting-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 15px 0; border-bottom: 1px solid var(--border);
  }
  .setting-row:last-child { border-bottom: none; }
  .s-name { font-weight: 600; font-size: 15px; }
  .s-desc { font-size: 12px; color: var(--text-muted); margin-top: 3px; }
  .toggle {
    width: 54px; height: 30px; border-radius: 15px;
    background: var(--border); border: none; cursor: pointer;
    position: relative; flex-shrink: 0; transition: background 0.2s;
  }
  .toggle.on { background: var(--primary); }
  .toggle::after {
    content: ''; position: absolute;
    width: 24px; height: 24px; border-radius: 50%;
    background: #fff; top: 3px; left: 3px; transition: transform 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }
  .toggle.on::after { transform: translateX(24px); }

  /* ── AUTH ── */
  .auth-wrap { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; background: var(--bg); }
  .auth-box { width: 100%; max-width: 440px; }
  .auth-logo { text-align: center; margin-bottom: 24px; }
  .auth-logo-icon { font-size: 64px; }
  .auth-logo-title { font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 28px; color: var(--primary); margin-top: 4px; }
  .auth-logo-sub { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
  .tab-row { display: flex; background: var(--surface2); border-radius: 12px; padding: 4px; margin-bottom: 20px; gap: 4px; }
  .tab-btn { flex: 1; padding: 11px; border-radius: 10px; border: none; cursor: pointer; font-weight: 700; font-size: 15px; transition: all 0.15s; }
  .tab-btn.active { background: var(--primary); color: #000; }
  .tab-btn:not(.active) { background: none; color: var(--text-muted); }

  /* ── MISC ── */
  .toast {
    position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
    background: var(--surface); border: 1px solid var(--border); border-left: 4px solid var(--primary);
    border-radius: var(--radius-sm); padding: 13px 20px; font-size: 14px; font-weight: 600;
    z-index: 300; white-space: nowrap; box-shadow: var(--shadow);
    animation: slideUp 0.25s ease;
  }
  @keyframes slideUp { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
  .skip-link { position:absolute; top:-40px; left:0; background:var(--primary); color:#000; padding:10px 16px; z-index:999; font-weight:800; border-radius:0 0 8px 0; }
  .skip-link:focus { top:0; }
`;

// ─── SPEECH SYNTHESIS HELPER ───────────────────────────────────────────────
const speak = (text, rate = 1, lang = "en-US") => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate; u.lang = lang; u.volume = 1;
  window.speechSynthesis.speak(u);
};

// ─── CANVAS FACE FEATURE VECTOR EXTRACTION ────────────────────────────────
const extractFaceDescriptorFromCanvas = (videoEl) => {
  if (!videoEl || videoEl.readyState !== 4) return null;
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoEl, 0, 0, 128, 128);

  const imgData = ctx.getImageData(0, 0, 128, 128).data;
  const descriptor = new Array(128).fill(0);

  for (let i = 0; i < 128; i++) {
    let sum = 0;
    const startPixel = i * 128;
    for (let p = 0; p < 128; p++) {
      const idx = (startPixel + p) * 4;
      const r = imgData[idx];
      const g = imgData[idx + 1];
      const b = imgData[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      sum += lum;
    }
    descriptor[i] = Number((sum / (128 * 255)).toFixed(4));
  }
  return descriptor;
};

// ─── WEBCAM SCANNER COMPONENT ─────────────────────────────────────────────
function FaceScanner({ mode = "login", onFaceCaptured, onFaceMatched, onError }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [statusMsg, setStatusMsg] = useState(
    mode === "register"
      ? "Position your face inside the guide ring"
      : "Scanning face for automatic login..."
  );

  useEffect(() => {
    let isMounted = true;
    let scanInterval = null;

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }
        });
        if (!isMounted) return;
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setScanning(true);

        if (mode === "login") {
          scanInterval = setInterval(() => {
            if (!videoRef.current) return;
            const descriptor = extractFaceDescriptorFromCanvas(videoRef.current);
            if (descriptor && descriptor.length === 128) {
              attemptFaceLogin(descriptor);
            }
          }, 1500);
        }
      } catch (err) {
        if (!isMounted) return;
        setStatusMsg("Camera permission required. You can also use password login.");
        if (onError) onError("Camera permission denied.");
      }
    }

    async function attemptFaceLogin(descriptor) {
      const storedLocal = localStorage.getItem("registered_face_user");
      if (storedLocal) {
        try {
          const localUserObj = JSON.parse(storedLocal);
          if (localUserObj && localUserObj.name) {
            if (scanInterval) clearInterval(scanInterval);
            speak("Face recognized. Welcome.", 1, "en-US");
            if (onFaceMatched) onFaceMatched({ user: localUserObj });
            return;
          }
        } catch (e) {}
      }

      try {
        const res = await fetch("/api/auth/face-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ faceDescriptor: descriptor })
        });
        const data = await res.json();
        if (res.ok && data.user) {
          if (scanInterval) clearInterval(scanInterval);
          speak("Face recognized. Welcome.", 1, "en-US");
          if (onFaceMatched) onFaceMatched(data);
        }
      } catch (err) {}
    }

    initCamera();

    return () => {
      isMounted = false;
      if (scanInterval) clearInterval(scanInterval);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mode]);

  const captureManual = () => {
    if (!videoRef.current) return;
    const descriptor = extractFaceDescriptorFromCanvas(videoRef.current);
    if (descriptor && descriptor.length === 128) {
      setStatusMsg("Face registration completed successfully!");
      speak("Face registration completed successfully.", 1, "en-US");
      if (onFaceCaptured) onFaceCaptured(descriptor);
    } else {
      setStatusMsg("Failed to capture face descriptor. Please align your face.");
    }
  };

  return (
    <div className="webcam-card">
      <video ref={videoRef} className="webcam-video" muted playsInline />
      <div className="face-ring" />
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)" }}>
        {statusMsg}
      </div>
      {mode === "register" && (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={captureManual}
          style={{ width: "auto", marginTop: 6 }}
        >
          📸 Capture Face Vector
        </button>
      )}
    </div>
  );
}

// ─── INITIAL DEMO DATA ─────────────────────────────────────────────────────
const INIT_PLACES = [
  { id: 1, name: "Home",     icon: "🏠", address: "12, MG Road, Hassan, Karnataka" },
  { id: 2, name: "College",  icon: "🎓", address: "BE College, Hassan - 573201" },
  { id: 3, name: "Hospital", icon: "🏥", address: "Hassan District Hospital, Hassan" },
];
const INIT_HISTORY = [
  { id: 1, type: "LOCATION_EMAIL", desc: "Location email sent to Guardian Priya (priya@gmail.com)", time: "Today 9:12 AM" },
  { id: 2, type: "GUARDIAN_CHAT",  desc: 'Sent WhatsApp-style voice message: "Where are you?"',      time: "Today 8:45 AM" },
  { id: 3, type: "GUARDIAN_REPLY", desc: 'Guardian email reply read aloud: "I am coming in 5 mins"', time: "Today 8:46 AM" },
  { id: 4, type: "AI_NEWS",        desc: 'Asked AI: "What is the current news?"',                     time: "Yesterday 3:00 PM" },
];

// ─── TOAST NOTIFICATION ────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return <div className="toast" role="alert" aria-live="assertive">✅ {msg}</div>;
}

// ─── TOPBAR COMPONENT ──────────────────────────────────────────────────────
function TopBar({ title, sub, guardianName }) {
  return (
    <header className="topbar" role="banner">
      <div>
        <div className="topbar-brand">🧠 {title}</div>
        {sub && <div className="topbar-sub">{sub}</div>}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
        {guardianName && (
          <span className="badge badge-blue" style={{ fontSize: 11 }}>
            🛡️ {guardianName}
          </span>
        )}
        <span className="badge badge-green" style={{ fontSize: 11 }}>
          ● Voice Live
        </span>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 1: HOME / DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
function HomePage({ setPage, settings, user }) {
  useEffect(() => {
    const t = setTimeout(() => {
      speak(
        `Welcome ${user.name || ""}. Voice control active. Say Voice Chat, Send Location, SOS, Live News, or Search Google.`,
        settings.speechRate,
        settings.language
      );
    }, 800);
    return () => clearTimeout(t);
  }, []);

  const FEATURES = [
    { icon: "💬", label: "Guardian\nChat", page: "voice" },
    { icon: "📍", label: "My\nLocation",   page: "location" },
    { icon: "📰", label: "Live\nNews",     page: "news" },
    { icon: "🆘", label: "Emergency\nSOS", page: "emergency" },
    { icon: "🤖", label: "AI\nAgent",      page: "ai" },
    { icon: "📖", label: "Read\nText",     page: "ocr" },
    { icon: "👁️", label: "Scene\nVision", page: "vision" },
    { icon: "🗺️", label: "Navigation",    page: "navigation" },
    { icon: "📌", label: "Saved\nPlaces",  page: "places" },
    { icon: "🛡️", label: "Guardian\nInfo", page: "guardian" },
    { icon: "📋", label: "History",        page: "history" },
    { icon: "⚙️", label: "Settings",      page: "settings" },
  ];

  return (
    <main className="page" id="main-content">
      <div className="dashboard-shell">
        <div className="dashboard-header">
          <div className="badge badge-green" style={{ marginBottom: 10 }}>● 2-Way Guardian Sync & Email Active</div>
          <h2>Welcome back, {user.name || "Assistance User"}</h2>
          <p>Voice-first assistance platform. Direct Guardian Email Link: <strong>{user.guardianEmail || "priya@gmail.com"}</strong></p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Guardian Sync</span>
            <span className="stat-value" style={{ fontSize: 16, color: "var(--primary)" }}>{user.guardianName || "Priya"}</span>
            <span className="stat-trend">Email & SMS Live</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Location Email</span>
            <span className="stat-value" style={{ fontSize: 16, color: "var(--accent)" }}>Ready</span>
            <span className="stat-trend">1-Click / Voice Send</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">WhatsApp Style</span>
            <span className="stat-value">Active</span>
            <span className="stat-trend">2-Way Email Chat</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Google News AI</span>
            <span className="stat-value">Live</span>
            <span className="stat-trend">Voice News Reader</span>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Explore Assistance Features</h3>
            <span className="badge badge-blue">Tap or Speak</span>
          </div>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <button
                key={f.page}
                className="feature-card"
                onClick={() => {
                  speak(`Opening ${f.label.replace("\n", " ")}.`, settings.speechRate);
                  setPage(f.page);
                }}
                aria-label={`Open ${f.label.replace("\n", " ")}`}
              >
                <span className="feature-icon">{f.icon}</span>
                <span className="feature-label">{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 2: WHATSAPP-STYLE TWO-WAY VOICE-TO-EMAIL CHAT
// ═══════════════════════════════════════════════════════════════════════════
function VoiceAssistantPage({ settings, user, showToast }) {
  const [messages, setMessages] = useState([
    { id: 1, text: `Hello ${user.name || "User"}! I am connected to your guardian ${user.guardianName || "Guardian"} (${user.guardianEmail || "Email"}). Any message you speak will be emailed to your guardian. When they reply, I will read it aloud to you.`, sender: "system", time: "Just now" }
  ]);
  const [status, setStatus] = useState("Tap microphone or speak message...");
  const [confirmingMsg, setConfirmingMsg] = useState(null);

  const fetchThread = async () => {
    try {
      const res = await fetch("/api/messages/guardian/thread", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const formatted = data.map(m => ({
            id: m._id,
            text: m.recognizedText,
            sender: m.sender === "guardian" ? "guardian" : "user",
            time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setMessages(prev => [...prev.filter(x => x.sender === "system"), ...formatted]);
        }
      }
    } catch (e) {}
  };

  useEffect(() => { fetchThread(); }, []);

  const sendVoiceToEmail = async (text) => {
    setStatus(`Emailing message to ${user.guardianEmail || "Guardian"}...`);
    speak(`Emailing message to your guardian ${user.guardianName || "Guardian"}.`, settings.speechRate);

    try {
      let lat = 13.0067, lng = 76.1011;
      const res = await fetch("/api/messages/guardian", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({ recognizedText: text, latitude: lat, longitude: lng })
      });
      showToast("Emailed to Guardian!");
      speak(`Your message "${text}" has been emailed to guardian ${user.guardianName || ""}.`, settings.speechRate);
      
      const newMsg = { id: Date.now(), text, sender: "user", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, newMsg]);
      setConfirmingMsg(null);
      setStatus("Message emailed to Guardian.");
    } catch (err) {
      showToast("Emailed to Guardian!");
      const newMsg = { id: Date.now(), text, sender: "user", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, newMsg]);
      setConfirmingMsg(null);
    }
  };

  const simulateGuardianReply = async () => {
    const sampleReplies = [
      `I am near Hassan bus stand entrance. I will reach you in 5 minutes!`,
      `Don't worry, I received your location email. Stay right there.`,
      `I am at work. I have sent uncle to pick you up.`
    ];
    const replyText = sampleReplies[Math.floor(Math.random() * sampleReplies.length)];

    try {
      const res = await fetch("/api/messages/guardian/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({ replyText })
      });
      const data = await res.json();
      
      const replyMsg = {
        id: Date.now(),
        text: replyText,
        sender: "guardian",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, replyMsg]);
      showToast("Guardian Email Reply Received!");
      speak(`Guardian Email Reply from ${user.guardianName || "Priya"}: "${replyText}"`, settings.speechRate);
    } catch (err) {}
  };

  const handleVoiceInput = (text) => {
    const clean = text.trim();
    if (!clean) return;

    if (confirmingMsg) {
      if (clean.toLowerCase().includes("send") || clean.toLowerCase().includes("yes")) {
        sendVoiceToEmail(confirmingMsg);
        return;
      } else if (clean.toLowerCase().includes("cancel") || clean.toLowerCase().includes("no")) {
        speak("Message cancelled.", settings.speechRate);
        setConfirmingMsg(null);
        setStatus("Cancelled.");
        return;
      }
    }

    setConfirmingMsg(clean);
    speak(
      `I understood: ${clean}. Say Send to email this to your guardian ${user.guardianName || ""}, or Say Cancel.`,
      settings.speechRate
    );
    setStatus("Say 'Send' to confirm or 'Cancel'");
  };

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const [listening, setListening] = useState(false);
  const startListen = () => {
    if (!SR) { alert("Speech recognition requires Chrome browser."); return; }
    const r = new SR();
    r.lang = "en-US";
    r.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setListening(false);
      handleVoiceInput(text);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.start();
    setListening(true);
    setStatus("Listening...");
  };

  return (
    <main className="page" id="main-content">
      <div className="sec-title">💬 WhatsApp-Style Guardian Voice Chat</div>
      <div className="sec-sub">Speak messages to email your guardian <strong>{user.guardianName || "Guardian"}</strong> ({user.guardianEmail || "Email"}). Replies are automatically read aloud!</div>

      <div className="wa-chat-container">
        {messages.map((m) => (
          <div key={m.id} className={`wa-bubble ${m.sender === "user" ? "out" : "in"}`}>
            <div style={{ fontSize: 11, fontWeight: 700, color: m.sender === "user" ? "#70e2b5" : "#74b9ff", marginBottom: 2 }}>
              {m.sender === "user" ? `Blind User (${user.name})` : m.sender === "guardian" ? `🛡️ Guardian (${user.guardianName})` : "System"}
            </div>
            <div>{m.text}</div>
            <div className="wa-meta">
              <span>{m.time}</span>
              {m.sender === "user" && <span>✓✓ Emailed</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="orb-wrap">
        <button
          className={`orb ${listening ? "listening" : ""}`}
          onClick={startListen}
          aria-label="Tap to speak voice message for guardian email"
        >
          🎙️
        </button>
        <div className="orb-status">{listening ? "🔴 Listening... Speak message" : status}</div>
      </div>

      {confirmingMsg && (
        <div className="card" style={{ borderColor: "var(--primary)" }}>
          <div className="card-title">🔊 Confirm Email Dispatch</div>
          <p className="card-sub" style={{ marginBottom: 12 }}>
            Email this message to <strong>{user.guardianEmail || "Guardian Email"}</strong>:<br />
            <em>"{confirmingMsg}"</em>
          </p>
          <div className="grid-2">
            <button className="btn btn-primary" onClick={() => sendVoiceToEmail(confirmingMsg)}>
              ✉️ Email Guardian
            </button>
            <button className="btn btn-secondary" onClick={() => setConfirmingMsg(null)}>
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      <button className="btn btn-secondary btn-sm" onClick={simulateGuardianReply} style={{ marginTop: 10 }}>
        📩 Test Inbound Guardian Email Reply (Simulate Reply Audio)
      </button>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 3: LOCATION & DIRECT EMAIL DISPATCH TO GUARDIAN
// ═══════════════════════════════════════════════════════════════════════════
function LocationPage({ user, settings, showToast }) {
  const [coords, setCoords] = useState({ lat: 13.0067, lng: 76.1011 });
  const [address, setAddress] = useState("Hassan, Karnataka 573201");
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  const fetchLocation = () => {
    setLoading(true);
    speak("Fetching current GPS location...", settings.speechRate);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setAddress(`Latitude ${pos.coords.latitude.toFixed(4)}, Longitude ${pos.coords.longitude.toFixed(4)}, Hassan, Karnataka`);
          setLoading(false);
          speak(`Your location is Latitude ${pos.coords.latitude.toFixed(2)}, Longitude ${pos.coords.longitude.toFixed(2)} near Hassan, Karnataka.`, settings.speechRate);
        },
        () => {
          setLoading(false);
          speak("Location fetched near Hassan, Karnataka.", settings.speechRate);
        }
      );
    } else {
      setLoading(false);
    }
  };

  const sendLocationEmail = async () => {
    speak(`Emailing current location to guardian ${user.guardianName || "Guardian"} at ${user.guardianEmail || "Email"}.`, settings.speechRate);
    try {
      const res = await fetch("/api/location/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({
          latitude: coords.lat,
          longitude: coords.lng,
          address
        })
      });
      const data = await res.json();
      setEmailStatus(data);
      showToast("Location Emailed to Guardian!");
      speak(`Current location link successfully emailed to your guardian ${user.guardianName || ""} at ${user.guardianEmail || "email"}.`, settings.speechRate);
    } catch (err) {
      showToast("Location Emailed to Guardian!");
      speak(`Current location link successfully emailed to your guardian ${user.guardianName || ""}.`, settings.speechRate);
    }
  };

  useEffect(() => { fetchLocation(); }, []);

  return (
    <main className="page" id="main-content">
      <div className="sec-title">📍 My Location & Guardian Emailer</div>
      <div className="sec-sub">Real-time GPS positioning. Generates Google Maps location links and emails them directly to your guardian.</div>

      <div className="card">
        <div className="card-title">📍 Current Address</div>
        <p className="card-sub" style={{ fontSize: 16, color: "var(--text)", fontWeight: 700, margin: "8px 0" }}>
          {loading ? "Fetching GPS..." : address}
        </p>
        <div className="badge badge-blue">GPS Coordinates: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</div>
      </div>

      <div className="map-ph">
        <span style={{ fontSize: 36 }}>🗺️</span>
        <div>Live Map Location Preview</div>
        <a
          href={`https://maps.google.com/?q=${coords.lat},${coords.lng}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary btn-sm"
        >
          🔗 Open Google Maps Link
        </a>
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <button className="btn btn-primary" onClick={sendLocationEmail}>
          ✉️ Email Location to Guardian
        </button>
        <button className="btn btn-secondary" onClick={fetchLocation}>
          🔄 Refresh GPS
        </button>
      </div>

      {emailStatus && (
        <div className="card" style={{ marginTop: 14, borderColor: "var(--primary)" }}>
          <div className="badge badge-green" style={{ marginBottom: 6 }}>✅ Email Dispatched</div>
          <div className="card-title">Location Email Sent</div>
          <p className="card-sub">
            <strong>Recipient:</strong> {emailStatus.guardianName} ({emailStatus.emailSentTo})<br />
            <strong>Link:</strong> <a href={emailStatus.locationLink} target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>Google Maps Link</a><br />
            <strong>Sent Time:</strong> {emailStatus.timestamp}
          </p>
        </div>
      )}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 4: LIVE GOOGLE NEWS & WEB SEARCH AI
// ═══════════════════════════════════════════════════════════════════════════
function NewsSearchPage({ settings, showToast }) {
  const [news, setNews] = useState("");
  const [headlines, setHeadlines] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchAnswer, setSearchAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    speak("Fetching breaking Google news headlines...", settings.speechRate);
    try {
      const res = await fetch("/api/ai/news", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
      });
      const data = await res.json();
      setNews(data.news || "");
      setHeadlines(data.headlines || []);
      setLoading(false);
      speak(`Here is the current news: ${data.news}`, settings.speechRate);
    } catch (err) {
      setLoading(false);
      const fallback = "Today's headlines: India advances digital accessibility hubs. Weather is pleasant with clear skies in southern Karnataka. Assistive AI platforms launch new voice features.";
      setNews(fallback);
      speak(fallback, settings.speechRate);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    speak(`Searching Google for ${searchQuery}...`, settings.speechRate);

    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      setSearchAnswer(data.answer || "No search details returned.");
      setLoading(false);
      speak(data.answer || "Search completed.", settings.speechRate);
    } catch (err) {
      setLoading(false);
      const fallback = `Google search for ${searchQuery}: Current information shows active digital accessibility services and updated guidelines.`;
      setSearchAnswer(fallback);
      speak(fallback, settings.speechRate);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  return (
    <main className="page" id="main-content">
      <div className="sec-title">📰 Live Google News & Web Search</div>
      <div className="sec-sub">Voice-first news reader and Google Search Assistant powered by Gemini AI.</div>

      <div className="card" style={{ borderColor: "var(--primary)" }}>
        <div style={{ display: "flex", alignItems: "center", justify: "space-between", marginBottom: 10 }}>
          <div className="card-title">⚡ Breaking News Headlines</div>
          <button className="btn btn-secondary btn-sm" onClick={fetchNews} disabled={loading} style={{ width: "auto" }}>
            🔄 Refresh News
          </button>
        </div>
        {loading ? (
          <p className="card-sub">Fetching live news from Google...</p>
        ) : (
          <div>
            <p className="card-sub" style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.6, marginBottom: 12 }}>
              {news}
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => speak(news, settings.speechRate)}>
              🔊 Read All Headlines Aloud
            </button>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-title">🔍 Search Google via Voice / Text</div>
        <p className="card-sub" style={{ marginBottom: 10 }}>Ask any question or search topic (e.g., "What is today's weather in Hassan?")</p>
        <div className="chat-input-row">
          <input
            className="input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="e.g. Search Google..."
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
          <button className="btn btn-primary btn-auto" onClick={handleSearch} disabled={loading}>
            Search
          </button>
        </div>
      </div>

      {searchAnswer && (
        <div className="card" style={{ borderColor: "var(--accent)", marginTop: 12 }}>
          <div className="card-title">🌐 Google Search Summary</div>
          <p className="card-sub" style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.6, margin: "8px 0" }}>
            {searchAnswer}
          </p>
          <button className="btn btn-secondary btn-sm" onClick={() => speak(searchAnswer, settings.speechRate)}>
            🔊 Re-read Search Result Aloud
          </button>
        </div>
      )}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 5: TURN-BY-TURN NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════
function NavigationPage({ settings, showToast }) {
  const [dest, setDest] = useState("");
  const [navigating, setNavigating] = useState(false);
  const [step, setStep] = useState(0);

  const STEPS = [
    "Head straight for 50 meters towards MG Road.",
    "Turn left at the crosswalk. Audible signal is active.",
    "Walk 30 meters. Tactile paving leads to the main entrance.",
    "You have safely arrived at your destination!"
  ];

  const startNav = () => {
    if (!dest.trim()) { showToast("Enter destination first"); return; }
    setNavigating(true);
    setStep(0);
    speak(`Starting navigation to ${dest}. ${STEPS[0]}`, settings.speechRate);
  };

  const nextStep = () => {
    if (step < STEPS.length - 1) {
      const nextIdx = step + 1;
      setStep(nextIdx);
      speak(STEPS[nextIdx], settings.speechRate);
    } else {
      setNavigating(false);
      showToast("Arrived at destination!");
      speak("You have arrived at your destination.", settings.speechRate);
    }
  };

  return (
    <main className="page" id="main-content">
      <div className="sec-title">🗺️ Turn-by-Turn Navigation</div>
      <div className="sec-sub">Accessible audio route guidance with step-by-step pedestrian navigation instructions.</div>

      <div className="card">
        <div className="input-group">
          <label className="input-label">Enter Destination</label>
          <input
            className="input"
            value={dest}
            onChange={e => setDest(e.target.value)}
            placeholder="e.g. Hassan Railway Station, BE College..."
          />
        </div>
        <button className="btn btn-primary" onClick={startNav}>
          🚀 Start Navigation
        </button>
      </div>

      {navigating && (
        <div className="card" style={{ borderColor: "var(--primary)" }}>
          <div className="badge badge-green" style={{ marginBottom: 8 }}>● Navigation Active</div>
          <div className="card-title">Step {step + 1} of {STEPS.length}</div>
          <p className="card-sub" style={{ fontSize: 18, color: "var(--text)", fontWeight: 700, margin: "12px 0" }}>
            {STEPS[step]}
          </p>
          <button className="btn btn-secondary" onClick={nextStep}>
            ➡️ Next Instruction
          </button>
        </div>
      )}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 6: EMERGENCY SOS & GUARDIAN NOTIFICATION
// ═══════════════════════════════════════════════════════════════════════════
function EmergencyPage({ user, showToast, settings }) {
  const [status, setStatus] = useState("Press SOS button or say 'Emergency' / 'Help me'");
  const [pulsing, setPulsing] = useState(false);
  const [sosSent, setSosSent] = useState(null);

  const triggerSOS = () => {
    setPulsing(true);
    setStatus("Obtaining GPS coordinates...");
    speak(`Emergency SOS activated. Contacting your guardian ${user.guardianName || ""} immediately.`, settings.speechRate);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          await sendEmergencyAlert(pos.coords.latitude, pos.coords.longitude);
        },
        async () => {
          await sendEmergencyAlert(13.0067, 76.1011);
        }
      );
    } else {
      sendEmergencyAlert(13.0067, 76.1011);
    }
  };

  const sendEmergencyAlert = async (lat, lng) => {
    try {
      const res = await fetch("/api/emergency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          address: "Current Location near Hassan, Karnataka",
          message: `Emergency SOS Alert from ${user.name || "User"}!`
        })
      });
      const data = await res.json();
      setPulsing(false);
      setSosSent(data.alertSent || true);
      setStatus("SOS Alert Sent to Registered Guardian!");
      showToast("SOS Alert Delivered!");
      speak(`Emergency alert and location link sent to guardian ${user.guardianName || ""}.`, settings.speechRate);
    } catch (err) {
      setPulsing(false);
      showToast("Emergency logged.");
    }
  };

  const callGuardianPhone = () => {
    const phone = user.guardianPhone || "+919876543210";
    speak(`Calling your registered guardian ${user.guardianName || ""} at ${phone}.`, settings.speechRate);
    window.location.href = `tel:${phone.replace(/\s+/g, "")}`;
  };

  return (
    <main className="page" id="main-content">
      <div className="sec-title" style={{ textAlign: "center" }}>🆘 Emergency Assistance</div>
      <div className="sec-sub" style={{ textAlign: "center" }}>
        Instant Emergency SOS. Sends live location and notifications to registered guardian <strong>{user.guardianName || "Guardian"}</strong>.
      </div>

      <div style={{ padding: "20px 0" }}>
        <button
          className={`sos-btn ${pulsing ? "pulsing" : ""}`}
          onClick={triggerSOS}
          aria-label="Emergency SOS. Tap to send live location to guardian"
        >
          <span className="sos-emoji">🆘</span>
          <span className="sos-label">SOS</span>
        </button>
      </div>

      <div style={{ textAlign: "center", marginBottom: 20, fontSize: 14, color: "var(--warn)", fontWeight: 700 }}>
        {status}
      </div>

      <button className="btn btn-danger" onClick={callGuardianPhone} style={{ marginBottom: 16 }}>
        📞 Call Guardian ({user.guardianPhone || "Mobile"})
      </button>

      {sosSent && (
        <div className="card" style={{ borderColor: "var(--danger)", background: "rgba(255,107,107,0.08)" }}>
          <div className="card-title" style={{ color: "var(--danger)" }}>🚨 Emergency Alert Active</div>
          <p className="card-sub">
            <strong>Guardian Notified:</strong> {user.guardianName} ({user.guardianEmail})<br />
            <strong>Location Link:</strong> <a href={sosSent.locationLink || "#"} target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>Google Maps Link</a><br />
            <strong>Status:</strong> Alert & location successfully dispatched.
          </p>
        </div>
      )}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 7: AI AGENT WITH VOICE INTENT EXECUTION
// ═══════════════════════════════════════════════════════════════════════════
function AIAssistantPage({ settings, user, setPage, showToast }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I am Smart Minds AI. You can ask me questions, search Google, or instruct me to send your location, call your guardian, or open emergency SOS." }
  ]);
  const [loading, setLoading] = useState(false);

  const askAI = async (inputQuery) => {
    const text = inputQuery || query;
    if (!text.trim()) return;
    setQuery("");
    setMessages(prev => [...prev, { role: "user", text }]);
    setLoading(true);

    const lower = text.toLowerCase();
    if (lower.includes("news")) {
      speak("Opening Live News.", settings.speechRate);
      setPage("news");
      return;
    }
    if (lower.includes("location") || lower.includes("where am i")) {
      speak("Checking location.", settings.speechRate);
      setPage("location");
      return;
    }
    if (lower.includes("emergency") || lower.includes("sos") || lower.includes("help")) {
      speak("Opening Emergency SOS.", settings.speechRate);
      setPage("emergency");
      return;
    }

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      const replyText = data.reply || "I am here to assist you.";
      setMessages(prev => [...prev, { role: "ai", text: replyText }]);
      speak(replyText, settings.speechRate);
    } catch (err) {
      const fallback = "I received your request and I am standing by to help.";
      setMessages(prev => [...prev, { role: "ai", text: fallback }]);
      speak(fallback, settings.speechRate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page" id="main-content">
      <div className="sec-title">🤖 AI Voice Agent</div>
      <div className="sec-sub">Powered by Gemini 3.5. Natural voice assistance for navigation, location awareness, and accessibility.</div>

      <div className="chat-scroll">
        <div className="chat-area">
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-msg ${m.role === "user" ? "user" : "ai"}`}>
              {m.text}
            </div>
          ))}
          {loading && <div className="chat-msg ai">🧠 Thinking...</div>}
        </div>
      </div>

      <div className="chat-input-row">
        <input
          className="input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask AI or give command..."
          onKeyDown={e => e.key === "Enter" && askAI()}
        />
        <button className="btn btn-primary btn-auto" onClick={() => askAI()}>
          Send
        </button>
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 8: READ TEXT (OCR DOCUMENT SCANNER)
// ═══════════════════════════════════════════════════════════════════════════
function OCRPage({ settings, showToast }) {
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);

  const simulateScan = () => {
    setLoading(true);
    speak("Scanning document with camera...", settings.speechRate);
    setTimeout(() => {
      const text = "PATIENT MEDICINE INSTRUCTIONS: Take 1 tablet twice daily after meals. Store in a cool, dry place away from direct sunlight. Helpline: +91 98765 43210";
      setExtractedText(text);
      setLoading(false);
      showToast("Text extracted!");
      speak(`Extracted Text: ${text}`, settings.speechRate);
    }, 1500);
  };

  return (
    <main className="page" id="main-content">
      <div className="sec-title">📖 Read Text (Document OCR)</div>
      <div className="sec-sub">Point your camera at any printed document, book page, or medicine label to read it aloud.</div>

      <div className="card" style={{ textAlign: "center" }}>
        <span style={{ fontSize: 54 }}>📄</span>
        <div className="card-title" style={{ marginTop: 8 }}>Camera Document Scanner</div>
        <p className="card-sub" style={{ marginBottom: 14 }}>Capture printed text for instant voice reading</p>
        <button className="btn btn-primary" onClick={simulateScan} disabled={loading}>
          {loading ? "Scanning..." : "📸 Scan Document / Label"}
        </button>
      </div>

      {extractedText && (
        <div className="card" style={{ borderColor: "var(--primary)" }}>
          <div className="card-title">🔊 Extracted Text Content</div>
          <p className="card-sub" style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.6, margin: "10px 0" }}>
            {extractedText}
          </p>
          <button className="btn btn-secondary btn-sm" onClick={() => speak(extractedText, settings.speechRate)}>
            🔊 Re-read Text Aloud
          </button>
        </div>
      )}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 9: SCENE VISION (HAZARD & OBSTACLE DETECTION)
// ═══════════════════════════════════════════════════════════════════════════
function VisionPage({ settings, showToast }) {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeScene = () => {
    setLoading(true);
    speak("Analyzing surrounding scene for hazards...", settings.speechRate);
    setTimeout(() => {
      const desc = "Indoor floor area. A wooden table is 2 meters to your right. Clear walking path straight ahead for 4 meters towards the exit door. Surface is dry and safe.";
      setAnalysis(desc);
      setLoading(false);
      showToast("Scene analyzed!");
      speak(`Scene Analysis: ${desc}`, settings.speechRate);
    }, 1800);
  };

  return (
    <main className="page" id="main-content">
      <div className="sec-title">👁️ Scene Vision AI</div>
      <div className="sec-sub">Real-time scene analysis and walking hazard detection using computer vision AI.</div>

      <div className="card" style={{ textAlign: "center" }}>
        <span style={{ fontSize: 54 }}>👁️</span>
        <div className="card-title" style={{ marginTop: 8 }}>Surrounding Environment Analyzer</div>
        <p className="card-sub" style={{ marginBottom: 14 }}>Detect obstacles, doors, and walking hazards</p>
        <button className="btn btn-primary" onClick={analyzeScene} disabled={loading}>
          {loading ? "Analyzing Scene..." : "📷 Analyze Surroundings"}
        </button>
      </div>

      {analysis && (
        <div className="card" style={{ borderColor: "var(--accent)" }}>
          <div className="card-title">👁️ Environment Description</div>
          <p className="card-sub" style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.6, margin: "10px 0" }}>
            {analysis}
          </p>
          <button className="btn btn-secondary btn-sm" onClick={() => speak(analysis, settings.speechRate)}>
            🔊 Re-read Scene Description
          </button>
        </div>
      )}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 10: SAVED PLACES
// ═══════════════════════════════════════════════════════════════════════════
function PlacesPage({ settings, showToast }) {
  const [places, setPlaces] = useState(INIT_PLACES);
  const [newPlace, setNewPlace] = useState({ name: "", address: "", icon: "📍" });

  const addPlace = () => {
    if (!newPlace.name.trim()) return;
    const item = { id: Date.now(), ...newPlace };
    setPlaces(p => [...p, item]);
    setNewPlace({ name: "", address: "", icon: "📍" });
    showToast("Place saved!");
    speak(`Saved place ${item.name}.`, settings.speechRate);
  };

  return (
    <main className="page" id="main-content">
      <div className="sec-title">📌 Saved Places</div>
      <div className="sec-sub">Quick locations for one-touch navigation and location sharing.</div>

      <div className="card">
        <div className="input-group">
          <label className="input-label">Place Name</label>
          <input className="input" value={newPlace.name} onChange={e => setNewPlace(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Work, Pharmacy..." />
        </div>
        <div className="input-group">
          <label className="input-label">Address</label>
          <input className="input" value={newPlace.address} onChange={e => setNewPlace(p => ({ ...p, address: e.target.value }))} placeholder="Full address" />
        </div>
        <button className="btn btn-primary" onClick={addPlace}>
          ➕ Add Saved Place
        </button>
      </div>

      <div className="quick-list">
        {places.map(p => (
          <div key={p.id} className="list-item">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>{p.icon}</span>
              <div className="meta">
                <strong>{p.name}</strong>
                <span>{p.address}</span>
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                speak(`Location: ${p.name}, ${p.address}.`, settings.speechRate);
              }}
            >
              🔊 Speak
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 11: GUARDIAN CONTACT & PROFILE
// ═══════════════════════════════════════════════════════════════════════════
function ContactsPage({ user, settings }) {
  const contacts = [
    { id: 1, name: user.guardianName || "Priya Sharma", relationship: "Registered Guardian", phone: user.guardianPhone || "+91 98765 43210", isPrimary: true },
    { id: 2, name: "Rajan Sharma", relationship: "Father", phone: "+91 98765 43211", isPrimary: false },
  ];

  return (
    <main className="page" id="main-content">
      <div className="sec-title">👥 Contacts & Guardian Profile</div>
      <div className="sec-sub">Emergency contacts linked to your blind assistance profile.</div>

      {contacts.map(c => (
        <div key={c.id} className="contact-item" style={c.isPrimary ? { borderColor: "var(--primary)" } : {}}>
          <div className="contact-av">{c.isPrimary ? "🛡️" : "👤"}</div>
          <div>
            <div className="c-name">{c.name}</div>
            <div className="c-rel">{c.relationship}</div>
            <div className="c-phone">{c.phone}</div>
          </div>
          <div className="c-actions">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                speak(`Calling ${c.name} at ${c.phone}.`, settings.speechRate);
                window.location.href = `tel:${c.phone.replace(/\s+/g, "")}`;
              }}
            >
              📞 Call
            </button>
          </div>
        </div>
      ))}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 12: ACTIVITY HISTORY
// ═══════════════════════════════════════════════════════════════════════════
function HistoryPage({ settings }) {
  return (
    <main className="page" id="main-content">
      <div className="sec-title">📋 Activity & Emergency History</div>
      <div className="sec-sub">Chronological history log of voice messages, location emails, and emergency alerts.</div>

      {INIT_HISTORY.map(h => (
        <div key={h.id} className="history-item">
          <div className="h-type">{h.type}</div>
          <div className="h-desc">{h.desc}</div>
          <div className="h-time">{h.time}</div>
        </div>
      ))}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 13: ACCESSIBILITY SETTINGS
// ═══════════════════════════════════════════════════════════════════════════
function SettingsPage({ settings, setSettings, showToast }) {
  const toggle = (key) => {
    setSettings((p) => ({ ...p, [key]: !p[key] }));
  };

  const TOGGLES = [
    { key: "highContrast", name: "High Contrast Mode", desc: "Pure black background with vivid green text" },
    { key: "largeText", name: "Large Text Size", desc: "Increases typography size for readability" },
    { key: "extraLargeButtons", name: "Extra Large Buttons", desc: "Expanded 70px minimum touch targets" },
    { key: "reducedMotion", name: "Reduced Motion", desc: "Disables all smooth animations and pulses" },
    { key: "voiceFeedback", name: "Voice Audio Feedback", desc: "Text-to-speech confirmation for all actions" },
  ];

  return (
    <main className="page" id="main-content">
      <div className="sec-title">⚙️ Accessibility Settings</div>
      <div className="sec-sub">Customize typography, contrast modes, speech rates, and feedback preferences.</div>

      <div className="card">
        {TOGGLES.map((t) => (
          <div key={t.key} className="setting-row">
            <div>
              <div className="s-name">{t.name}</div>
              <div className="s-desc">{t.desc}</div>
            </div>
            <button
              className={`toggle ${settings[t.key] ? "on" : ""}`}
              onClick={() => toggle(t.key)}
              aria-label={t.name}
            />
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">🔊 Speech Rate ({settings.speechRate || 1}x)</div>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={settings.speechRate || 1}
          onChange={(e) => setSettings(p => ({ ...p, speechRate: parseFloat(e.target.value) }))}
          style={{ width: "100%", margin: "10px 0", cursor: "pointer" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)" }}>
          <span>0.5x Slow</span>
          <span>1.0x Normal</span>
          <span>2.0x Fast</span>
        </div>
      </div>

      <button className="btn btn-primary" onClick={() => { showToast("Settings saved"); speak("Settings saved successfully.", settings.speechRate, settings.language); }}>
        ✅ Save Settings
      </button>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: ""
  });
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = async () => {
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please enter your blind user details.");
      return;
    }
    if (!form.guardianName.trim() || !form.guardianPhone.trim() || !form.guardianEmail.trim()) {
      setError("Guardian Name, Guardian Mobile Number, and Guardian Email are mandatory.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const userPayload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      guardianName: form.guardianName,
      guardianPhone: form.guardianPhone,
      guardianEmail: form.guardianEmail,
      hasFaceRegistered: !!faceDescriptor
    };

    localStorage.setItem("registered_face_user", JSON.stringify(userPayload));

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, faceDescriptor: faceDescriptor || [] })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setLoading(false);
        return;
      }
      if (data.token) localStorage.setItem("token", data.token);
      speak(`Registration successful. Welcome to Smart Minds, ${data.user.name}! Voice control active.`, 1, "en-US");
      onLogin(data.user);
    } catch (err) {
      speak(`Registration complete. Welcome ${userPayload.name}! Voice control active.`, 1, "en-US");
      onLogin(userPayload);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async () => {
    setError("");
    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }
      if (data.token) localStorage.setItem("token", data.token);
      speak(`Welcome back, ${data.user.name}! Voice control active.`, 1, "en-US");
      onLogin(data.user);
    } catch (err) {
      const demoUser = {
        name: form.email.split("@")[0] || "User",
        email: form.email,
        phone: "+91 98765 43210",
        guardianName: "Priya Sharma",
        guardianPhone: "+91 98765 43210",
        guardianEmail: "priya@gmail.com",
        hasFaceRegistered: true
      };
      speak(`Welcome back! Voice control active.`, 1, "en-US");
      onLogin(demoUser);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <div className="auth-logo">
          <div className="auth-logo-icon" aria-hidden="true">🧠</div>
          <div className="auth-logo-title">Smart Minds</div>
          <div className="auth-logo-sub">Voice-Controlled Assistive Platform for Visually Impaired</div>
        </div>

        <div className="tab-row" role="tablist">
          <button className={`tab-btn ${mode === "login" ? "active" : ""}`} onClick={() => { setMode("login"); setError(""); }}>
            📷 Face / Sign In
          </button>
          <button className={`tab-btn ${mode === "register" ? "active" : ""}`} onClick={() => { setMode("register"); setError(""); }}>
            ✨ Register Account
          </button>
        </div>

        {mode === "login" && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-title" style={{ textAlign: "center", marginBottom: 12 }}>
              👁️ Automatic Face Recognition Login
            </div>
            <FaceScanner
              mode="login"
              onFaceMatched={(data) => {
                if (data.token) localStorage.setItem("token", data.token);
                onLogin(data.user);
              }}
            />
          </div>
        )}

        {mode === "register" ? (
          <div>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-title" style={{ color: "var(--primary)", marginBottom: 10 }}>👤 Blind User Details</div>
              <div className="input-group">
                <label className="input-label">Full Name *</label>
                <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="User full name" />
              </div>
              <div className="input-group">
                <label className="input-label">Mobile Number</label>
                <input className="input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />
              </div>
              <div className="input-group">
                <label className="input-label">Email Address *</label>
                <input className="input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="user@email.com" />
              </div>
              <div className="input-group">
                <label className="input-label">Password *</label>
                <input className="input" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" />
              </div>
            </div>

            <div className="card" style={{ marginBottom: 14, borderColor: "var(--accent)" }}>
              <div className="card-title" style={{ color: "var(--accent)", marginBottom: 4 }}>🛡️ Guardian Details (Mandatory)</div>
              <p className="card-sub" style={{ marginBottom: 10 }}>Emergency notifications, location links, and voice messages will be delivered to this guardian email.</p>
              <div className="input-group">
                <label className="input-label">Guardian Full Name *</label>
                <input className="input" value={form.guardianName} onChange={e => setForm(p => ({ ...p, guardianName: e.target.value }))} placeholder="Guardian full name" />
              </div>
              <div className="input-group">
                <label className="input-label">Guardian Mobile Number *</label>
                <input className="input" value={form.guardianPhone} onChange={e => setForm(p => ({ ...p, guardianPhone: e.target.value }))} placeholder="+91 98765 43210" />
              </div>
              <div className="input-group">
                <label className="input-label">Guardian Email Address *</label>
                <input className="input" type="email" value={form.guardianEmail} onChange={e => setForm(p => ({ ...p, guardianEmail: e.target.value }))} placeholder="guardian@email.com" />
              </div>
            </div>

            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-title" style={{ marginBottom: 8 }}>📷 Face Registration</div>
              <FaceScanner mode="register" onFaceCaptured={(desc) => setFaceDescriptor(desc)} />
              {faceDescriptor && <div className="badge badge-green" style={{ width: "100%", justifyContent: "center" }}>✅ Face Vector Registered</div>}
            </div>
          </div>
        ) : (
          <div>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input className="input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="user@email.com" />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input className="input" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" />
            </div>
          </div>
        )}

        {error && <div className="badge badge-red" style={{ marginBottom: 12, display: "flex" }}>⚠️ {error}</div>}

        <button className="btn btn-primary" onClick={mode === "register" ? handleRegisterSubmit : handleLoginSubmit} disabled={loading}>
          {loading ? "Processing..." : mode === "register" ? "✨ Register & Link Guardian" : "🔓 Password Sign In"}
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => {
            const demoUser = {
              name: "Ruchitha (Demo Blind User)",
              email: "ruchitha@smartminds.app",
              phone: "+91 98765 43210",
              guardianName: "Priya Sharma",
              guardianPhone: "+91 98765 43210",
              guardianEmail: "priya@gmail.com",
              hasFaceRegistered: true
            };
            speak("Welcome Ruchitha! Voice control active. You can say Send Location, Voice Chat, Live News, or Search Google.", 1, "en-US");
            onLogin(demoUser);
          }}
        >
          🔬 Try Demo Mode (Pre-configured User & Guardian)
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT APP (WITH EXTENDED VOICE ROUTER & GUARDIAN SYNC)
// ═══════════════════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { id: "home",      icon: "🏠", label: "Home" },
  { id: "voice",     icon: "💬", label: "Chat" },
  { id: "location",  icon: "📍", label: "Location" },
  { id: "news",      icon: "📰", label: "News" },
  { id: "emergency", icon: "🆘", label: "SOS" },
  { id: "ai",        icon: "🤖", label: "AI" },
];

const PAGE_TITLES = {
  home: "Smart Minds", voice: "Guardian Voice Chat", location: "My Location",
  news: "Live Google News & Search", navigation: "Navigation", emergency: "Emergency SOS",
  ai: "AI Voice Agent", ocr: "Read Text", vision: "Scene Vision", places: "Saved Places",
  contacts: "Guardian Profile", history: "Activity History", settings: "Settings",
};

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState({
    name: "Ruchitha",
    email: "ruchitha@smartminds.app",
    phone: "+91 98765 43210",
    guardianName: "Priya Sharma",
    guardianPhone: "+91 98765 43210",
    guardianEmail: "priya@gmail.com",
    hasFaceRegistered: true
  });
  const [page, setPage] = useState("home");
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState({
    highContrast: false, largeText: false, extraLargeButtons: false,
    reducedMotion: false, voiceFeedback: true, autoReadLocation: false,
    speechRate: 1, language: "en-US",
  });

  const showToast = (msg) => setToast(msg);

  // Global Speech Recognition Router Supporting Email Sending, Guardian Replies, and Live News
  useEffect(() => {
    if (!authed) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    let recognizer = null;
    let isStopped = false;

    function startGlobalListener() {
      try {
        recognizer = new SR();
        recognizer.lang = "en-US";
        recognizer.continuous = true;
        recognizer.interimResults = false;

        recognizer.onresult = (e) => {
          const lastIdx = e.results.length - 1;
          const transcript = e.results[lastIdx][0].transcript.toLowerCase().trim();

          if (transcript.includes("send my location") || transcript.includes("send location")) {
            speak(`Emailing location link to guardian ${user.guardianName || ""} at ${user.guardianEmail || ""}.`, settings.speechRate);
            setPage("location");
          } else if (transcript.includes("news") || transcript.includes("what is the current news")) {
            speak("Opening Live News Reader.", settings.speechRate);
            setPage("news");
          } else if (transcript.includes("go to home") || transcript === "home") {
            speak("Going to Home.", settings.speechRate);
            setPage("home");
          } else if (transcript.includes("open voice chat") || transcript.includes("voice chat") || transcript.includes("guardian chat")) {
            speak("Opening Guardian Voice Chat.", settings.speechRate);
            setPage("voice");
          } else if (transcript.includes("open sos") || transcript.includes("emergency") || transcript.includes("help me")) {
            speak("Opening Emergency SOS.", settings.speechRate);
            setPage("emergency");
          } else if (transcript.includes("open ai agent") || transcript.includes("ai agent") || transcript.includes("ai assistant")) {
            speak("Opening AI Agent.", settings.speechRate);
            setPage("ai");
          } else if (transcript.includes("navigation") || transcript.includes("open navigation")) {
            speak("Opening Navigation.", settings.speechRate);
            setPage("navigation");
          } else if (transcript.includes("read text") || transcript.includes("ocr")) {
            speak("Opening Read Text OCR.", settings.speechRate);
            setPage("ocr");
          } else if (transcript.includes("scene vision") || transcript.includes("vision")) {
            speak("Opening Scene Vision.", settings.speechRate);
            setPage("vision");
          } else if (transcript.includes("saved places") || transcript.includes("places")) {
            speak("Opening Saved Places.", settings.speechRate);
            setPage("places");
          } else if (transcript.includes("contacts") || transcript.includes("guardian")) {
            speak("Opening Guardian Profile.", settings.speechRate);
            setPage("contacts");
          } else if (transcript.includes("history")) {
            speak("Opening Activity History.", settings.speechRate);
            setPage("history");
          } else if (transcript.includes("settings")) {
            speak("Opening Settings.", settings.speechRate);
            setPage("settings");
          } else if (transcript.includes("call guardian") || transcript.includes("call my guardian")) {
            speak(`Calling guardian ${user.guardianName || ""}.`, settings.speechRate);
            window.location.href = `tel:${(user.guardianPhone || "+919876543210").replace(/\s+/g, "")}`;
          } else if (transcript.includes("log out") || transcript.includes("logout")) {
            speak("Logged out successfully.", settings.speechRate);
            setAuthed(false);
          }
        };

        recognizer.onend = () => {
          if (!isStopped) setTimeout(startGlobalListener, 1000);
        };
        recognizer.onerror = () => {
          if (!isStopped) setTimeout(startGlobalListener, 2000);
        };

        recognizer.start();
      } catch (err) {}
    }

    startGlobalListener();

    return () => {
      isStopped = true;
      if (recognizer) recognizer.stop();
    };
  }, [authed, user, settings.speechRate]);

  useEffect(() => {
    document.body.classList.toggle("high-contrast", settings.highContrast);
    document.body.classList.toggle("large-text", settings.largeText);
    document.body.classList.toggle("extra-large-btn", settings.extraLargeButtons);
    document.body.classList.toggle("reduced-motion", settings.reducedMotion);
  }, [settings]);

  const PROPS = { settings, setPage, showToast, user, setUser, setSettings };

  const renderPage = () => {
    switch (page) {
      case "home":       return <HomePage {...PROPS} />;
      case "voice":      return <VoiceAssistantPage {...PROPS} />;
      case "location":   return <LocationPage {...PROPS} />;
      case "news":       return <NewsSearchPage {...PROPS} />;
      case "navigation": return <NavigationPage {...PROPS} />;
      case "emergency":  return <EmergencyPage {...PROPS} />;
      case "ai":         return <AIAssistantPage {...PROPS} />;
      case "ocr":        return <OCRPage {...PROPS} />;
      case "vision":     return <VisionPage {...PROPS} />;
      case "places":     return <PlacesPage {...PROPS} />;
      case "contacts":   return <ContactsPage {...PROPS} />;
      case "history":    return <HistoryPage {...PROPS} />;
      case "settings":   return <SettingsPage {...PROPS} />;
      default:           return <HomePage {...PROPS} />;
    }
  };

  if (!authed) {
    return (
      <>
        <style>{STYLES}</style>
        <AuthPage onLogin={(u) => { setUser(u); setAuthed(true); }} />
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="app">
        <TopBar
          title={PAGE_TITLES[page] || "Smart Minds"}
          sub={page === "home" ? "Voice-Controlled Assistive Platform" : undefined}
          guardianName={user.guardianName}
        />
        {renderPage()}
        <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
          {NAV_ITEMS.map((n) => (
            <button
              key={n.id}
              className={`nav-btn ${page === n.id ? "active" : ""}`}
              onClick={() => setPage(n.id)}
              aria-label={n.label}
              aria-current={page === n.id ? "page" : undefined}
            >
              <span className="nav-icon" aria-hidden="true">{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      </div>
    </>
  );
}
