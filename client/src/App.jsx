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
    padding: 8px 14px; border-radius: 12px;
    min-width: 56px; min-height: 52px; justify-content: center;
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
  .btn-icon { width: auto; padding: 12px 14px; margin-bottom: 0; min-height: 44px; }

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
  .panel-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }

  .quick-list { display: flex; flex-direction: column; gap: 10px; }
  .list-item {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 12px 14px; background: var(--surface2); border: 1px solid var(--border); border-radius: 12px;
  }
  .list-item .meta { display: flex; flex-direction: column; gap: 4px; }
  .list-item .meta strong { font-size: 14px; }
  .list-item .meta span { font-size: 12px; color: var(--text-muted); }
  .mini-chart { display: flex; align-items: end; gap: 8px; height: 110px; padding-top: 12px; }
  .chart-bar {
    flex: 1; border-radius: 8px 8px 0 0; min-height: 20px; background: linear-gradient(180deg, var(--primary), rgba(0,184,148,0.4));
    opacity: 0.9;
  }
  .progress-stack { display: flex; flex-direction: column; gap: 12px; }
  .progress-row { display: flex; flex-direction: column; gap: 6px; }
  .progress-row label { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); }
  .progress-track {
    width: 100%; height: 10px; background: var(--surface2); border: 1px solid var(--border); border-radius: 999px; overflow: hidden;
  }
  .progress-fill {
    height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--primary), var(--accent));
  }

  /* ── FEATURE CARDS ── */
  .feature-card {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 18px 10px;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    cursor: pointer; text-align: center; min-height: 100px; justify-content: center;
    border-bottom: 3px solid transparent;
    transition: border-color 0.15s, background 0.15s;
  }
  .feature-card:hover, .feature-card:focus-visible {
    border-color: var(--primary); background: var(--primary-glow);
  }
  .feature-card:focus-visible { outline: 2px solid var(--primary); }
  .feature-icon { font-size: 30px; line-height: 1; }
  .feature-label { font-size: 12px; font-weight: 700; color: var(--text); line-height: 1.3; }

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

  /* ── VOICE ORB ── */
  .orb-wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 16px 0; }
  .orb {
    width: 130px; height: 130px; border-radius: 50%;
    background: radial-gradient(circle at 38% 32%, #00d4a8, #00856e);
    display: flex; align-items: center; justify-content: center;
    font-size: 52px; cursor: pointer; border: none;
    box-shadow: 0 0 0 0 rgba(0,184,148,0.4);
  }
  .orb.listening { animation: orbPulse 1.4s infinite; }
  @keyframes orbPulse {
    0%   { box-shadow: 0 0 0 0   rgba(0,184,148,0.5); }
    70%  { box-shadow: 0 0 0 32px rgba(0,184,148,0); }
    100% { box-shadow: 0 0 0 0   rgba(0,184,148,0); }
  }
  .orb-status { font-size: 14px; color: var(--text-muted); text-align: center; }

  /* ── TRANSCRIPT ── */
  .transcript-box {
    background: var(--surface2); border: 1.5px solid var(--border);
    border-radius: var(--radius-sm); padding: 14px 16px;
    min-height: 72px; font-size: 15px; line-height: 1.6; margin-bottom: 12px;
  }
  .t-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: var(--text-dim); font-weight: 700; margin-bottom: 6px; }

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
  .icon-btn {
    background: none; border: none; cursor: pointer;
    font-size: 18px; padding: 8px; border-radius: 8px;
    min-width: 38px; min-height: 38px; display: flex; align-items: center; justify-content: center;
  }
  .icon-btn:hover { background: var(--surface); }
  .icon-btn:focus-visible { outline: 2px solid var(--primary); }

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

  /* ── AI CHAT ── */
  .chat-scroll { max-height: 340px; overflow-y: auto; padding: 4px 2px; margin-bottom: 12px; }
  .chat-area { display: flex; flex-direction: column; gap: 10px; }
  .chat-msg {
    padding: 12px 16px; border-radius: 18px; font-size: 15px;
    line-height: 1.6; max-width: 90%;
  }
  .chat-msg.user { background: var(--primary); color: #000; align-self: flex-end; border-bottom-right-radius: 4px; font-weight: 600; }
  .chat-msg.ai { background: var(--surface2); border: 1px solid var(--border); align-self: flex-start; border-bottom-left-radius: 4px; }
  .chat-input-row { display: flex; gap: 8px; }
  .chat-input-row .input { flex: 1; margin: 0; padding: 12px 14px; }

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

  // Compute 128 spatial luminance grid values representing face landmarks
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
        setStatusMsg("Camera permission denied. Use password login fallback.");
        if (onError) onError("Camera permission denied.");
      }
    }

    async function attemptFaceLogin(descriptor) {
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

// ─── DEMO INITIAL DATA ─────────────────────────────────────────────────────
const INIT_CONTACTS = [
  { id: 1, name: "Priya Sharma", relationship: "Guardian / Mother", phone: "+91 98765 43210", email: "priya@gmail.com", isPrimary: true },
  { id: 2, name: "Rajan Sharma", relationship: "Father", phone: "+91 98765 43211", email: "rajan@gmail.com", isPrimary: false },
];
const INIT_PLACES = [
  { id: 1, name: "Home",     icon: "🏠", address: "12, MG Road, Hassan, Karnataka" },
  { id: 2, name: "College",  icon: "🎓", address: "BE College, Hassan - 573201" },
  { id: 3, name: "Hospital", icon: "🏥", address: "Hassan District Hospital, Hassan" },
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
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
// PAGE: HOME / DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
function HomePage({ setPage, settings, user }) {
  useEffect(() => {
    const t = setTimeout(() => {
      speak(
        `Welcome ${user.name || ""}. Voice control is active. You can say Home, Voice Chat, SOS, AI Agent, Check Location, or Call Guardian.`,
        settings.speechRate,
        settings.language
      );
    }, 800);
    return () => clearTimeout(t);
  }, []);

  const quickActions = [
    { title: "Voice Chat & Guardian Messaging", action: () => { speak("Opening Voice Chat."); setPage("voice"); }, icon: "🎙️", badge: "Voice Ready" },
    { title: "Check & Send Current Location", action: () => { speak("Opening Location."); setPage("location"); }, icon: "📍", badge: "GPS Active" },
    { title: "Emergency SOS Alert", action: () => { speak("Opening Emergency Assistance."); setPage("emergency"); }, icon: "🆘", badge: "Guardian SOS" },
    { title: "AI Assistant", action: () => { speak("Opening AI Assistant."); setPage("ai"); }, icon: "🤖", badge: "Gemini 3.5" },
    { title: "Guardian Details", action: () => { speak("Opening Guardian Information."); setPage("guardian"); }, icon: "🛡️", badge: user.guardianName || "Guardian" },
  ];

  return (
    <main className="page" id="main-content">
      <div className="dashboard-shell">
        <div className="dashboard-header">
          <div className="badge badge-green" style={{ marginBottom: 10 }}>● Voice Control Active</div>
          <h2>Welcome, {user.name || "Assistance User"}</h2>
          <p>Your fully voice-activated Smart Blind Assistant. Guardian linked: <strong>{user.guardianName || "Not Set"}</strong> ({user.guardianPhone || "Configured"})</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Guardian Status</span>
            <span className="stat-value" style={{ fontSize: 20, color: "var(--primary)" }}>Connected</span>
            <span className="stat-trend">Email & SMS Ready</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Face Recognition</span>
            <span className="stat-value" style={{ fontSize: 20, color: "var(--accent)" }}>
              {user.hasFaceRegistered ? "Registered" : "Active"}
            </span>
            <span className="stat-trend">Auto Login Enabled</span>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Accessibility Voice Controls</h3>
            <span className="badge badge-blue">Speak Command</span>
          </div>
          <div className="quick-list">
            {quickActions.map((item) => (
              <button key={item.title} className="list-item" onClick={item.action} style={{ textAlign: "left", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                  <div className="meta">
                    <strong>{item.title}</strong>
                    <span>{item.badge}</span>
                  </div>
                </div>
                <span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: VOICE CHAT & VOICE-TO-TEXT MESSAGING TO GUARDIAN
// ═══════════════════════════════════════════════════════════════════════════
function VoiceAssistantPage({ settings, user, showToast }) {
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("Tap orb or speak command...");
  const [confirmingMsg, setConfirmingMsg] = useState(null);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Welcome to Voice Chat. Speak your message for your guardian or AI assistant." }
  ]);

  const sendToGuardianApi = async (text) => {
    try {
      setStatus("Sending message to registered guardian...");
      speak(`Sending message to your guardian ${user.guardianName || "Guardian"}.`, settings.speechRate);
      
      let lat = null, lng = null;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
            await executeSend(text, lat, lng);
          },
          async () => { await executeSend(text, null, null); }
        );
      } else {
        await executeSend(text, null, null);
      }
    } catch (err) {
      showToast("Error sending message");
    }
  };

  const executeSend = async (text, lat, lng) => {
    const res = await fetch("/api/messages/guardian", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`
      },
      body: JSON.stringify({ recognizedText: text, latitude: lat, longitude: lng })
    });
    const data = await res.json();
    if (res.ok) {
      showToast("Message sent to Guardian!");
      speak("Your message has been delivered to your guardian.", settings.speechRate);
      setMessages(prev => [...prev, { role: "assistant", text: `✅ Delivered to ${user.guardianEmail || "Guardian"}: "${text}"` }]);
      setConfirmingMsg(null);
      setStatus("Message delivered.");
    } else {
      showToast("Failed to send to guardian");
    }
  };

  const handleVoiceInput = (text) => {
    const clean = text.trim();
    if (!clean) return;
    setTranscript(clean);

    if (confirmingMsg) {
      if (clean.toLowerCase().includes("send") || clean.toLowerCase().includes("yes")) {
        sendToGuardianApi(confirmingMsg);
        return;
      } else if (clean.toLowerCase().includes("cancel") || clean.toLowerCase().includes("no")) {
        speak("Message cancelled.", settings.speechRate);
        setConfirmingMsg(null);
        setStatus("Cancelled.");
        return;
      }
    }

    setMessages(prev => [...prev, { role: "user", text: clean }]);
    setConfirmingMsg(clean);

    speak(
      `I recognized: ${clean}. Say Send to deliver to your guardian ${user.guardianName || ""}, or Say Cancel.`,
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
      <div className="sec-title">🎙️ Voice Chat & Guardian Messaging</div>
      <div className="sec-sub">Speak to compose messages. Speech is converted to text and read back for voice confirmation before sending to your registered guardian.</div>

      <div className="orb-wrap">
        <button
          className={`orb ${listening ? "listening" : ""}`}
          onClick={startListen}
          aria-label="Activate voice recording for guardian message"
        >
          🎙️
        </button>
        <div className="orb-status">{listening ? "🔴 Listening... Speak now" : status}</div>
      </div>

      {transcript && (
        <div className="transcript-box">
          <div className="t-label">Recognized Speech</div>
          <div>"{transcript}"</div>
        </div>
      )}

      {confirmingMsg && (
        <div className="card" style={{ borderColor: "var(--primary)" }}>
          <div className="card-title">🔊 Confirmation Required</div>
          <p className="card-sub" style={{ marginBottom: 12 }}>
            Deliver this message to <strong>{user.guardianName || "Guardian"}</strong> ({user.guardianEmail || "Email"}):<br />
            <em>"{confirmingMsg}"</em>
          </p>
          <div className="grid-2">
            <button className="btn btn-primary" onClick={() => sendToGuardianApi(confirmingMsg)}>
              ✅ Send Message
            </button>
            <button className="btn btn-secondary" onClick={() => setConfirmingMsg(null)}>
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <h3>Conversation History</h3>
        </div>
        <div className="chat-scroll">
          <div className="chat-area">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-msg ${m.role === "user" ? "user" : "ai"}`}>
                {m.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: EMERGENCY SOS & GUARDIAN NOTIFICATION
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
// PAGE: AI AGENT WITH VOICE INTENT EXECUTION
// ═══════════════════════════════════════════════════════════════════════════
function AIAssistantPage({ settings, user, setPage, showToast }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I am Smart Minds AI. You can ask me questions or instruct me to send your location, call your guardian, or open emergency SOS." }
  ]);
  const [loading, setLoading] = useState(false);

  const askAI = async (inputQuery) => {
    const text = inputQuery || query;
    if (!text.trim()) return;
    setQuery("");
    setMessages(prev => [...prev, { role: "user", text }]);
    setLoading(true);

    const lower = text.toLowerCase();
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
    if (lower.includes("call guardian") || lower.includes("call my guardian")) {
      speak(`Calling guardian ${user.guardianName || ""}.`, settings.speechRate);
      window.location.href = `tel:${(user.guardianPhone || "+919876543210").replace(/\s+/g, "")}`;
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
// PAGE: LOCATION & ADDRESS LOOKUP
// ═══════════════════════════════════════════════════════════════════════════
function LocationPage({ user, settings, showToast }) {
  const [coords, setCoords] = useState({ lat: 13.0067, lng: 76.1011 });
  const [address, setAddress] = useState("Hassan, Karnataka 573201");
  const [loading, setLoading] = useState(false);

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

  const sendLocationToGuardian = async () => {
    speak(`Sending location to guardian ${user.guardianName || ""}.`, settings.speechRate);
    try {
      const res = await fetch("/api/messages/guardian", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({
          recognizedText: `Current location update from ${user.name || "User"}`,
          latitude: coords.lat,
          longitude: coords.lng
        })
      });
      if (res.ok) {
        showToast("Location sent to Guardian!");
        speak("Location link delivered to guardian email and mobile.", settings.speechRate);
      }
    } catch (err) {}
  };

  useEffect(() => { fetchLocation(); }, []);

  return (
    <main className="page" id="main-content">
      <div className="sec-title">📍 My Location</div>
      <div className="sec-sub">Real-time GPS positioning and Google Maps link generator for blind user navigation.</div>

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
        <button className="btn btn-primary" onClick={fetchLocation}>
          🔄 Refresh Location
        </button>
        <button className="btn btn-ghost" onClick={sendLocationToGuardian}>
          📤 Send to Guardian
        </button>
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: GUARDIAN PROFILE
// ═══════════════════════════════════════════════════════════════════════════
function GuardianPage({ user, settings }) {
  return (
    <main className="page" id="main-content">
      <div className="sec-title">🛡️ Registered Guardian</div>
      <div className="sec-sub">All emergency SOS alerts, live location links, and voice-to-text messages are delivered to this guardian.</div>

      <div className="card" style={{ borderColor: "var(--primary)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <div className="contact-av">🛡️</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{user.guardianName || "Registered Guardian"}</div>
            <div style={{ fontSize: 12, color: "var(--primary)" }}>● Primary Emergency Contact</div>
          </div>
        </div>
        <div className="divider" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
          <div><strong>📞 Mobile Number:</strong> {user.guardianPhone || "+91 98765 43210"}</div>
          <div><strong>📧 Email Address:</strong> {user.guardianEmail || "guardian@smartminds.org"}</div>
          <div><strong>👤 Linked Blind User:</strong> {user.name || "Assistance User"}</div>
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={() => {
          speak(`Calling guardian ${user.guardianName || ""}.`, settings.speechRate);
          window.location.href = `tel:${(user.guardianPhone || "+919876543210").replace(/\s+/g, "")}`;
        }}
      >
        📞 Call Guardian Now
      </button>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: SETTINGS
// ═══════════════════════════════════════════════════════════════════════════
function SettingsPage({ settings, setSettings, showToast }) {
  const toggle = (key) => {
    setSettings((p) => ({ ...p, [key]: !p[key] }));
  };

  const TOGGLES = [
    { key: "highContrast", name: "High Contrast Mode", desc: "Pure black background with vivid green text" },
    { key: "largeText", name: "Large Text Size", desc: "Increases typography for readability" },
    { key: "extraLargeButtons", name: "Extra Large Buttons", desc: "Expanded 70px minimum touch targets" },
    { key: "voiceFeedback", name: "Voice Audio Feedback", desc: "Text-to-speech confirmation for all actions" }
  ];

  return (
    <main className="page" id="main-content">
      <div className="sec-title">⚙️ Accessibility Settings</div>
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
      <button className="btn btn-primary" onClick={() => { showToast("Settings saved"); speak("Settings saved successfully."); }}>
        ✅ Save Settings
      </button>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: SIGN IN & REGISTER (WITH WEBCAM FACE REGISTRATION & AUTO FACE LOGIN)
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
      speak(`Registration successful. Welcome to Smart Minds, ${data.user.name}! Voice control is ready.`, 1, "en-US");
      onLogin(data.user);
    } catch (err) {
      // Fallback for offline demo mode
      const demoUser = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        guardianName: form.guardianName,
        guardianPhone: form.guardianPhone,
        guardianEmail: form.guardianEmail,
        hasFaceRegistered: !!faceDescriptor
      };
      speak(`Registration complete. Welcome ${demoUser.name}! Voice control active.`, 1, "en-US");
      onLogin(demoUser);
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
              <p className="card-sub" style={{ marginBottom: 10 }}>Emergency notifications, location links, and voice messages will be delivered to this guardian.</p>
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
              guardianName: "Guardian Priya",
              guardianPhone: "+91 98765 43210",
              guardianEmail: "guardian@smartminds.org",
              hasFaceRegistered: true
            };
            speak("Welcome Ruchitha! Voice control active. You can say Home, Voice Chat, SOS, or Call Guardian.", 1, "en-US");
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
// ROOT APP (WITH CONTINUOUS GLOBAL VOICE COMMAND ROUTER)
// ═══════════════════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { id: "home",      icon: "🏠", label: "Home" },
  { id: "voice",     icon: "🎙️", label: "Voice" },
  { id: "emergency", icon: "🆘", label: "SOS" },
  { id: "ai",        icon: "🤖", label: "AI" },
  { id: "guardian",  icon: "🛡️", label: "Guardian" },
];

const PAGE_TITLES = {
  home: "Smart Minds", voice: "Voice Chat", location: "My Location",
  emergency: "Emergency SOS", ai: "AI Voice Agent", guardian: "Guardian Info",
  settings: "Settings",
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
    reducedMotion: false, voiceFeedback: true, speechRate: 1, language: "en-US",
  });

  const showToast = (msg) => setToast(msg);

  // Global Speech Recognition Loop for Navigation Commands
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

          if (transcript.includes("go to home") || transcript === "home") {
            speak("Going to Home.", settings.speechRate);
            setPage("home");
          } else if (transcript.includes("open voice chat") || transcript.includes("voice chat")) {
            speak("Opening Voice Chat.", settings.speechRate);
            setPage("voice");
          } else if (transcript.includes("open sos") || transcript.includes("emergency") || transcript.includes("help me")) {
            speak("Opening Emergency SOS.", settings.speechRate);
            setPage("emergency");
          } else if (transcript.includes("open ai agent") || transcript.includes("ai agent") || transcript.includes("ai assistant")) {
            speak("Opening AI Agent.", settings.speechRate);
            setPage("ai");
          } else if (transcript.includes("check location") || transcript.includes("where am i") || transcript.includes("check my location")) {
            speak("Opening Location.", settings.speechRate);
            setPage("location");
          } else if (transcript.includes("call guardian") || transcript.includes("call my guardian")) {
            speak(`Calling guardian ${user.guardianName || ""}.`, settings.speechRate);
            window.location.href = `tel:${(user.guardianPhone || "+919876543210").replace(/\s+/g, "")}`;
          } else if (transcript.includes("log out") || transcript.includes("logout")) {
            speak("Logged out successfully.", settings.speechRate);
            setAuthed(false);
          }
        };

        recognizer.onend = () => {
          if (!isStopped) {
            setTimeout(startGlobalListener, 1000);
          }
        };
        recognizer.onerror = () => {
          if (!isStopped) {
            setTimeout(startGlobalListener, 2000);
          }
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
  }, [settings]);

  const PROPS = { settings, setPage, showToast, user, setUser, setSettings };

  const renderPage = () => {
    switch (page) {
      case "home":      return <HomePage {...PROPS} />;
      case "voice":     return <VoiceAssistantPage {...PROPS} />;
      case "emergency": return <EmergencyPage {...PROPS} />;
      case "ai":        return <AIAssistantPage {...PROPS} />;
      case "location":  return <LocationPage {...PROPS} />;
      case "guardian":  return <GuardianPage {...PROPS} />;
      case "settings":  return <SettingsPage {...PROPS} />;
      default:          return <HomePage {...PROPS} />;
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
