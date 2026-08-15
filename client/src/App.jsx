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
  select.input { cursor: pointer; }

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

  /* ── PLACE ITEM ── */
  .place-item {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 14px 16px;
    display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
  }
  .place-icon-wrap {
    width: 50px; height: 50px; border-radius: 14px;
    background: var(--primary-glow); display: flex; align-items: center;
    justify-content: center; font-size: 26px; flex-shrink: 0;
  }

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

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.75);
    display: flex; align-items: flex-end; justify-content: center;
    z-index: 200; padding: 0;
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius) var(--radius) 0 0;
    padding: 28px 24px 40px; width: 100%; max-width: 500px;
    max-height: 90vh; overflow-y: auto;
  }
  .modal-title { font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 20px; margin-bottom: 20px; }

  /* ── HISTORY ── */
  .history-item {
    background: var(--surface2); border-left: 3px solid var(--primary);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    padding: 12px 14px; margin-bottom: 8px;
  }
  .h-type { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--primary); font-weight: 800; margin-bottom: 4px; }
  .h-desc { font-size: 14px; color: var(--text); }
  .h-time { font-size: 11px; color: var(--text-dim); margin-top: 4px; }

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

  /* ── WELCOME ── */
  .welcome-hero { text-align: center; padding: 32px 16px 24px; }
  .welcome-logo { font-size: 76px; margin-bottom: 12px; line-height: 1; }
  .welcome-title { font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 34px; color: var(--primary); margin-bottom: 8px; }
  .welcome-sub { font-size: 15px; color: var(--text-muted); line-height: 1.6; margin-bottom: 28px; }

  /* ── AUTH ── */
  .auth-wrap { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; background: var(--bg); }
  .auth-box { width: 100%; max-width: 400px; }
  .auth-logo { text-align: center; margin-bottom: 32px; }
  .auth-logo-icon { font-size: 68px; }
  .auth-logo-title { font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 30px; color: var(--primary); margin-top: 8px; }
  .auth-logo-sub { font-size: 14px; color: var(--text-muted); margin-top: 4px; }
  .tab-row { display: flex; background: var(--surface2); border-radius: 12px; padding: 4px; margin-bottom: 22px; gap: 4px; }
  .tab-btn { flex: 1; padding: 11px; border-radius: 10px; border: none; cursor: pointer; font-weight: 700; font-size: 15px; transition: all 0.15s; }
  .tab-btn.active { background: var(--primary); color: #000; }
  .tab-btn:not(.active) { background: none; color: var(--text-muted); }

  /* ── MISC ── */
  .demo-banner {
    background: rgba(255,217,61,0.08); border: 1px solid rgba(255,217,61,0.3);
    border-radius: var(--radius-sm); padding: 10px 14px;
    font-size: 12px; color: var(--warn); text-align: center; margin-bottom: 14px; font-weight: 700;
  }
  .divider { height: 1px; background: var(--border); margin: 16px 0; }
  .row { display: flex; gap: 10px; align-items: center; }
  .loading-dots { display: flex; gap: 5px; align-items: center; }
  .loading-dots span { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); animation: dotBlink 1.2s infinite; }
  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes dotBlink { 0%,80%,100%{opacity:.2} 40%{opacity:1} }
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
  .sr-only { position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0; }
  .step-bar { display:flex; gap:6px; margin-bottom:16px; }
  .step-seg { flex:1; height:4px; border-radius:2px; background:var(--border); }
  .step-seg.done { background:var(--primary); }
  .profile-av { width:80px;height:80px;border-radius:50%;background:var(--primary-glow);border:3px solid var(--primary);display:flex;align-items:center;justify-content:center;font-size:38px;margin:0 auto 14px; }

  @media(max-width:360px){
    .feature-label{font-size:11px}
    .feature-icon{font-size:26px}
    .welcome-title{font-size:28px}
    .sos-btn{width:160px;height:160px}
  }
`;

// ─── SPEECH HELPERS ────────────────────────────────────────────────────────
const speak = (text, rate = 1, lang = "en-US") => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate; u.lang = lang; u.volume = 1;
  window.speechSynthesis.speak(u);
};

const useVoiceRecognition = (onResult) => {
  const recRef = useRef(null);
  const [listening, setListening] = useState(false);

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice recognition requires Chrome browser. Please open this app in Chrome."); return; }
    const r = new SR();
    r.lang = "en-US"; r.interimResults = false; r.maxAlternatives = 1;
    r.onresult = e => { onResult(e.results[0][0].transcript); setListening(false); };
    r.onend = () => setListening(false);
    r.onerror = () => { setListening(false); };
    recRef.current = r;
    r.start(); setListening(true);
  }, [onResult]);

  return { listening, start };
};

// ─── DEMO DATA ─────────────────────────────────────────────────────────────
const INIT_CONTACTS = [
  { id: 1, name: "Priya Sharma", relationship: "Mother", phone: "+91 98765 43210", isPrimary: true },
  { id: 2, name: "Rajan Sharma", relationship: "Father", phone: "+91 98765 43211", isPrimary: false },
];
const INIT_PLACES = [
  { id: 1, name: "Home",     icon: "🏠", address: "12, MG Road, Hassan, Karnataka" },
  { id: 2, name: "College",  icon: "🎓", address: "BE College, Hassan - 573201" },
  { id: 3, name: "Hospital", icon: "🏥", address: "Hassan District Hospital, Hassan" },
  { id: 4, name: "Market",   icon: "🛒", address: "City Market, Hassan" },
];
const INIT_HISTORY = [
  { id: 1, type: "LOCATION",   desc: "Location fetched near Hassan, Karnataka", time: "Today 9:12 AM" },
  { id: 2, type: "NAVIGATION", desc: "Navigation to College started",           time: "Today 8:45 AM" },
  { id: 3, type: "AI",         desc: 'Asked: "What is today\'s weather?"',      time: "Yesterday 3:00 PM" },
  { id: 4, type: "EMERGENCY",  desc: "Emergency mode tested — cancelled",       time: "Yesterday 2:15 PM" },
  { id: 5, type: "OCR",        desc: "Text extracted from medicine label",      time: "2 days ago" },
];

// ─── SHARED COMPONENTS ─────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className="toast" role="alert" aria-live="assertive">✅ {msg}</div>;
}

function TopBar({ title, sub }) {
  return (
    <header className="topbar" role="banner">
      <div>
        <div className="topbar-brand">🧠 {title}</div>
        {sub && <div className="topbar-sub">{sub}</div>}
      </div>
      <span className="badge badge-green" style={{ fontSize: 11 }}>● Live</span>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: HOME
// ═══════════════════════════════════════════════════════════════════════════
function HomePage({ setPage, settings }) {
  useEffect(() => {
    const t = setTimeout(() =>
      speak("Welcome to Smart Minds. I am here to help you navigate, communicate, and stay safe. Tap Start Assist Mode to begin.", settings.speechRate, settings.language), 900);
    return () => clearTimeout(t);
  }, []);

  const FEATURES = [
    { icon: "🎙️", label: "Voice\nAssistant", page: "voice" },
    { icon: "📍", label: "My\nLocation",   page: "location" },
    { icon: "🗺️", label: "Navigation",    page: "navigation" },
    { icon: "🆘", label: "Emergency\nSOS", page: "emergency" },
    { icon: "🤖", label: "AI\nAssistant",  page: "ai" },
    { icon: "📖", label: "Read\nText",     page: "ocr" },
    { icon: "👁️", label: "Scene\nVision", page: "vision" },
    { icon: "📌", label: "Saved\nPlaces",  page: "places" },
    { icon: "👥", label: "Contacts",       page: "contacts" },
    { icon: "📋", label: "History",        page: "history" },
    { icon: "👤", label: "Profile",        page: "profile" },
    { icon: "⚙️", label: "Settings",      page: "settings" },
  ];

  const quickActions = [
    { title: "Start voice assistant", action: () => setPage("voice"), icon: "🎙️" },
    { title: "Get my location", action: () => setPage("location"), icon: "📍" },
    { title: "Open AI assistant", action: () => setPage("ai"), icon: "🤖" },
    { title: "Emergency SOS", action: () => setPage("emergency"), icon: "🆘" },
  ];

  const activity = [
    { title: "Location refreshed", time: "Today, 09:12 AM", color: "badge-blue" },
    { title: "Navigation route started", time: "Today, 08:45 AM", color: "badge-green" },
    { title: "AI assistance request", time: "Yesterday, 03:00 PM", color: "badge-yellow" },
    { title: "Contact updated", time: "Yesterday, 02:10 PM", color: "badge-red" },
  ];

  return (
    <main className="page" id="main-content">
      <div className="dashboard-shell">
        <div className="dashboard-header">
          <div className="badge badge-green" style={{ marginBottom: 10 }}>● System live</div>
          <h2>Welcome back, Smart Minds</h2>
          <p>Voice-first support, location awareness, and accessible AI tools in one control panel.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Features</span>
            <span className="stat-value">12</span>
            <span className="stat-trend">+3 this sprint</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Voice commands</span>
            <span className="stat-value">24</span>
            <span className="stat-trend">Natural language ready</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Saved places</span>
            <span className="stat-value">4</span>
            <span className="stat-trend">Quick access enabled</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Accessibility score</span>
            <span className="stat-value">97%</span>
            <span className="stat-trend">High contrast ready</span>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Quick actions</h3>
            <span className="badge badge-blue">Ready</span>
          </div>
          <div className="quick-list">
            {quickActions.map((item) => (
              <button key={item.title} className="list-item" onClick={item.action} style={{ textAlign: "left", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <div className="meta">
                    <strong>{item.title}</strong>
                    <span>Open now</span>
                  </div>
                </div>
                <span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>Usage trend</h3>
              <span className="badge badge-green">+18%</span>
            </div>
            <div className="mini-chart" aria-label="Usage trend chart">
              {[30, 55, 42, 80, 68, 96, 88].map((height, index) => (
                <div key={index} className="chart-bar" style={{ height: `${height}%` }} aria-hidden="true" />
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>System readiness</h3>
              <span className="badge badge-blue">Healthy</span>
            </div>
            <div className="progress-stack">
              <div className="progress-row">
                <label><span>Voice support</span><strong>92%</strong></label>
                <div className="progress-track"><div className="progress-fill" style={{ width: "92%" }} /></div>
              </div>
              <div className="progress-row">
                <label><span>GPS accuracy</span><strong>86%</strong></label>
                <div className="progress-track"><div className="progress-fill" style={{ width: "86%" }} /></div>
              </div>
              <div className="progress-row">
                <label><span>AI assistant</span><strong>94%</strong></label>
                <div className="progress-track"><div className="progress-fill" style={{ width: "94%" }} /></div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Recent activity</h3>
            <button className="btn btn-secondary btn-sm btn-auto" onClick={() => setPage("history")} aria-label="Open activity history">View all</button>
          </div>
          <div className="quick-list">
            {activity.map((item) => (
              <div key={item.title} className="list-item">
                <div className="meta">
                  <strong>{item.title}</strong>
                  <span>{item.time}</span>
                </div>
                <span className={`badge ${item.color}`}>{item.title.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="demo-banner" role="note">🔬 Demo Mode Active — Sample data shown for presentation purposes</div>

        <h2 className="sec-title">All Features</h2>
        <p className="sec-sub">Tap any feature to open it</p>

        <div className="grid-3" role="list">
          {FEATURES.map(f => (
            <button key={f.page} className="feature-card" role="listitem"
              onClick={() => setPage(f.page)}
              aria-label={f.label.replace("\n", " ")}>
              <span className="feature-icon" aria-hidden="true">{f.icon}</span>
              <span className="feature-label" style={{ whiteSpace: "pre" }}>{f.label}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: VOICE ASSISTANT
// ═══════════════════════════════════════════════════════════════════════════
function VoiceAssistantPage({ setPage, settings }) {
  const [transcript, setTranscript] = useState("");
  const [response,   setResponse]   = useState("");
  const [history,    setHistory]    = useState([
    { role: "ai", text: "Hello! I'm your Smart Minds voice assistant. Tap the microphone and speak a command, or use the example buttons below." }
  ]);

  const COMMANDS = [
    { keys: ["where am i", "my location", "current location"], action: () => { setPage("location"); return "Opening your current location."; } },
    { keys: ["navigate", "directions", "take me", "go to"], action: () => { setPage("navigation"); return "Opening navigation. Please enter your destination."; } },
    { keys: ["emergency", "sos", "help me", "danger"],     action: () => { setPage("emergency"); return "Opening emergency SOS. Stay calm."; } },
    { keys: ["read text", "read this", "ocr", "scan"],     action: () => { setPage("ocr"); return "Opening text reader. Please upload or capture an image."; } },
    { keys: ["ai", "assistant", "ask", "question"],        action: () => { setPage("ai"); return "Opening AI assistant. What would you like to know?"; } },
    { keys: ["saved places", "my places", "home", "college"], action: () => { setPage("places"); return "Opening your saved places."; } },
    { keys: ["contacts", "call", "emergency contact"],     action: () => { setPage("contacts"); return "Opening trusted contacts."; } },
    { keys: ["settings", "accessibility"],                 action: () => { setPage("settings"); return "Opening settings."; } },
    { keys: ["vision", "scene", "around me", "describe"], action: () => { setPage("vision"); return "Opening scene vision AI."; } },
    { keys: ["profile", "my profile"],                    action: () => { setPage("profile"); return "Opening your profile."; } },
    { keys: ["history", "activity"],                      action: () => { setPage("history"); return "Opening activity history."; } },
    { keys: ["time", "what time"],                        action: () => `The current time is ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.` },
    { keys: ["date", "what day", "today"],                action: () => `Today is ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}.` },
    { keys: ["hello", "hi", "hey"],                       action: () => "Hello! How can I help you today? Say Help to hear available commands." },
    { keys: ["help", "what can you do", "commands"],      action: () => "You can say: Where am I, Navigate, Emergency SOS, Read Text, Open AI, Saved Places, Contacts, Settings, Vision, Time, Date, or Hello." },
  ];

  const processCommand = useCallback((text) => {
    setTranscript(text);
    const lower = text.toLowerCase();
    let reply = "";
    for (const cmd of COMMANDS) {
      if (cmd.keys.some(k => lower.includes(k))) { reply = cmd.action(); break; }
    }
    if (!reply) reply = `I heard: "${text}". I did not recognize that command. Say Help to hear what I can do.`;
    setResponse(reply);
    setHistory(h => [...h, { role: "user", text }, { role: "ai", text: reply }]);
    speak(reply, settings.speechRate, settings.language);
  }, [setPage, settings]);

  const { listening, start } = useVoiceRecognition(processCommand);

  const EXAMPLES = ["Where am I?", "Navigate", "Emergency SOS", "Read Text", "Open AI", "Help me", "Current time", "Vision AI"];

  return (
    <main className="page" id="main-content">
      <h1 className="sec-title">🎙️ Voice Assistant</h1>
      <p className="sec-sub">Speak any command — I understand natural language</p>

      <div className="orb-wrap">
        <button className={`orb ${listening ? "listening" : ""}`}
          onClick={start}
          aria-label={listening ? "Listening — speak now" : "Tap to speak a voice command"}
          aria-live="polite" aria-pressed={listening}>
          {listening ? "👂" : "🎙️"}
        </button>
        <p className="orb-status" aria-live="polite">
          {listening ? "🔴 Listening… speak now" : "Tap the orb to speak"}
        </p>
      </div>

      {transcript && (
        <div className="transcript-box" aria-live="polite">
          <div className="t-label">You said</div>
          "{transcript}"
        </div>
      )}
      {response && (
        <div className="transcript-box" style={{ borderColor: "var(--primary)" }} aria-live="polite">
          <div className="t-label">Response</div>
          {response}
        </div>
      )}

      <div className="divider" />
      <p style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", marginBottom: 10, letterSpacing: "0.08em" }}>EXAMPLE COMMANDS</p>
      <div className="grid-2">
        {EXAMPLES.map(c => (
          <button key={c} className="btn btn-secondary btn-sm"
            onClick={() => processCommand(c)} aria-label={`Try: ${c}`}>{c}</button>
        ))}
      </div>

      <div className="divider" />
      <p style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", marginBottom: 10, letterSpacing: "0.08em" }}>CONVERSATION LOG</p>
      <div className="chat-scroll">
        <div className="chat-area">
          {history.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}
              aria-label={`${m.role === "ai" ? "Assistant" : "You"}: ${m.text}`}>{m.text}</div>
          ))}
        </div>
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: LOCATION
// ═══════════════════════════════════════════════════════════════════════════
function LocationPage({ settings }) {
  const [loc,      setLoc]      = useState(null);
  const [address,  setAddress]  = useState("");
  const [status,   setStatus]   = useState("idle");
  const [accuracy, setAccuracy] = useState(null);

  const getLocation = () => {
    setStatus("loading");
    if (!navigator.geolocation) { setStatus("unsupported"); return; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;
        setLoc({ lat, lng }); setAccuracy(Math.round(acc));
        // In production: call Nominatim or Google Geocoding API here
        const addr = `Near Hassan, Karnataka, India (±${Math.round(acc)}m)`;
        setAddress(addr); setStatus("success");
        speak(`You are currently near Hassan, Karnataka. GPS accuracy is ${Math.round(acc)} meters.`, settings.speechRate, settings.language);
      },
      err => {
        if (err.code === 1) setStatus("denied");
        else setStatus("unavailable");
        speak("Unable to get your location. Please allow location permission in your browser.", settings.speechRate, settings.language);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  useEffect(() => { if (settings.autoReadLocation) getLocation(); }, []);

  return (
    <main className="page" id="main-content">
      <h1 className="sec-title">📍 My Location</h1>
      <p className="sec-sub">Your current GPS position with voice readout</p>

      <div className="map-ph" aria-label="Map display area">
        <span style={{ fontSize: 44 }}>🗺️</span>
        {status === "success"
          ? <><strong>GPS Location Found</strong><span style={{ fontSize: 12, color: "var(--text-dim)" }}>Connect Google Maps API for interactive map</span></>
          : <span>Map will appear after GPS is obtained</span>}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        {status === "idle"    && <p style={{ color: "var(--text-muted)" }}>Tap the button below to get your location.</p>}
        {status === "loading" && <><div className="loading-dots"><span/><span/><span/></div><p style={{ marginTop: 12, color: "var(--text-muted)" }}>Getting your GPS location…</p></>}
        {status === "success" && loc && <>
          <div className="badge badge-green" style={{ marginBottom: 12 }}>✅ Location Found</div>
          <p className="card-title" aria-live="polite">{address}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            <span className="badge badge-blue">Lat: {loc.lat.toFixed(5)}</span>
            <span className="badge badge-blue">Lng: {loc.lng.toFixed(5)}</span>
            {accuracy && <span className="badge badge-yellow">±{accuracy}m</span>}
          </div>
        </>}
        {status === "denied"      && <><div className="badge badge-red">❌ Permission Denied</div><p style={{ marginTop: 10, fontSize: 14, color: "var(--text-muted)" }}>Please allow location access in browser settings, then try again.</p></>}
        {status === "unavailable" && <><div className="badge badge-yellow">⚠️ GPS Unavailable</div><p style={{ marginTop: 10, fontSize: 14, color: "var(--text-muted)" }}>No GPS signal. Try moving to an open area or check device settings.</p></>}
        {status === "unsupported" && <><div className="badge badge-red">❌ Not Supported</div><p style={{ marginTop: 10, fontSize: 14, color: "var(--text-muted)" }}>Geolocation is not supported by this browser.</p></>}
      </div>

      <button className="btn btn-primary" onClick={getLocation} aria-label="Refresh GPS location">🔄 Get My Location</button>
      {status === "success" && (
        <button className="btn btn-secondary" onClick={() => speak(address, settings.speechRate, settings.language)} aria-label="Hear location read aloud">🔊 Read Location Aloud</button>
      )}
      <div className="demo-banner">📌 Real address requires Nominatim / Google Geocoding API key in .env</div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════
function NavigationPage({ settings }) {
  const [dest,     setDest]     = useState("");
  const [navState, setNavState] = useState("idle");
  const [step,     setStep]     = useState(0);

  const DEMO_STEPS = [
    "Head north on MG Road for 200 metres.",
    "Turn left onto College Road at the signal.",
    "Continue straight for 500 metres past the petrol bunk.",
    "Turn right at Hassan Bus Stand.",
    "Your destination, BE College, is on the left side.",
  ];

  const startNav = () => {
    if (!dest.trim()) { speak("Please enter a destination first.", settings.speechRate, settings.language); return; }
    setNavState("navigating"); setStep(0);
    speak(`Starting navigation to ${dest}. Step one: ${DEMO_STEPS[0]}`, settings.speechRate, settings.language);
  };
  const nextStep = () => {
    if (step < DEMO_STEPS.length - 1) {
      const s = step + 1; setStep(s);
      speak(DEMO_STEPS[s], settings.speechRate, settings.language);
      if (s === DEMO_STEPS.length - 1) setNavState("arrived");
    }
  };
  const stopNav = () => { setNavState("idle"); setDest(""); speak("Navigation stopped.", settings.speechRate, settings.language); };

  return (
    <main className="page" id="main-content">
      <h1 className="sec-title">🗺️ Navigation</h1>
      <p className="sec-sub">Voice-guided turn-by-turn directions</p>
      <div className="demo-banner">🔬 Demo navigation — Real directions need Google Maps / OpenRouteService API</div>

      {navState === "idle" && <>
        <div className="input-group">
          <label className="input-label" htmlFor="dest">Where do you want to go?</label>
          <input id="dest" className="input" value={dest} onChange={e => setDest(e.target.value)}
            placeholder="Type destination or say it…" aria-label="Enter destination" />
        </div>

        <p style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", marginBottom: 10, letterSpacing: "0.08em" }}>SAVED PLACES</p>
        {INIT_PLACES.map(p => (
          <button key={p.id} className="btn btn-secondary"
            onClick={() => { setDest(p.name); speak(`Destination set to ${p.name}.`, settings.speechRate, settings.language); }}
            aria-label={`Set destination to ${p.name}`}>
            {p.icon} {p.name} — {p.address}
          </button>
        ))}
        <button className="btn btn-primary" onClick={startNav} style={{ marginTop: 4 }} aria-label="Start navigation">▶️ Start Navigation</button>
      </>}

      {(navState === "navigating" || navState === "arrived") && <>
        <div className="card" style={{ borderColor: navState === "arrived" ? "var(--primary)" : "var(--accent)" }}>
          <div className="badge" style={{ marginBottom: 12, background: navState === "arrived" ? "rgba(0,184,148,0.15)" : "rgba(116,185,255,0.15)", color: navState === "arrived" ? "var(--primary)" : "var(--accent)" }}>
            {navState === "arrived" ? "✅ Arrived" : "🔵 Navigating"}
          </div>
          <p className="card-title">To: {dest}</p>
          <div className="step-bar" style={{ marginTop: 14 }}>
            {DEMO_STEPS.map((_, i) => <div key={i} className={`step-seg ${i <= step ? "done" : ""}`} />)}
          </div>
          <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 600, lineHeight: 1.6 }}
            aria-live="polite" role="status">
            {navState === "arrived"
              ? "🎉 You have arrived at your destination!"
              : `👣 Step ${step + 1} of ${DEMO_STEPS.length}: ${DEMO_STEPS[step]}`}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <span className="badge badge-yellow">⏱ ~8 min</span>
            <span className="badge badge-blue">📏 1.2 km</span>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => speak(navState === "arrived" ? "You have arrived." : DEMO_STEPS[step], settings.speechRate, settings.language)}
          aria-label="Repeat current navigation step">🔊 Repeat Step</button>
        {navState !== "arrived" && (
          <button className="btn btn-secondary" onClick={nextStep} aria-label="Go to next navigation step">⏭ Next Step</button>
        )}
        <button className="btn btn-danger" onClick={stopNav} aria-label="Stop navigation">⏹ Stop Navigation</button>
      </>}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: EMERGENCY SOS
// ═══════════════════════════════════════════════════════════════════════════
function EmergencyPage({ contacts, settings }) {
  const [sosState, setSosState] = useState("idle");
  const [loc, setLoc] = useState(null);
  const primary = contacts.find(c => c.isPrimary) || contacts[0];

  const activateSOS = () => {
    setSosState("activating");
    speak("Emergency mode activated. Getting your location. Stay calm. I will help you.", settings.speechRate, settings.language);
    navigator.geolocation?.getCurrentPosition(
      pos => { setLoc({ lat: pos.coords.latitude.toFixed(5), lng: pos.coords.longitude.toFixed(5) }); setSosState("active"); },
      ()  => { setSosState("active"); }
    );
  };
  const cancel = () => { setSosState("idle"); speak("Emergency mode cancelled. You are safe.", settings.speechRate, settings.language); };

  return (
    <main className="page" id="main-content">
      <h1 className="sec-title" style={{ color: "var(--danger)" }}>🆘 Emergency SOS</h1>
      <p className="sec-sub">Tap the SOS button to activate emergency assistance</p>

      {sosState === "idle" && <>
        <div className="card" style={{ borderColor: "rgba(255,217,61,0.4)", marginBottom: 20 }}>
          <div className="badge badge-yellow" style={{ marginBottom: 8 }}>⚠️ Before you activate</div>
          <p className="card-sub">
            Pressing SOS will: fetch your GPS location, display your emergency contact, and prepare a shareable location message. <strong>You control what gets sent.</strong> This app does not automatically call emergency services.
          </p>
        </div>

        <div style={{ textAlign: "center", margin: "24px 0 28px" }}>
          <button className="sos-btn" onClick={activateSOS} aria-label="Activate emergency SOS — tap to start">
            <span className="sos-emoji">🆘</span>
            <span className="sos-label">SOS</span>
          </button>
          <p style={{ marginTop: 14, color: "var(--text-muted)", fontSize: 13 }}>Tap to activate emergency mode</p>
        </div>

        {primary ? (
          <div className="contact-item">
            <div className="contact-av">👤</div>
            <div>
              <div className="c-name">{primary.name} <span className="badge badge-green" style={{ fontSize: 10 }}>Primary</span></div>
              <div className="c-rel">{primary.relationship}</div>
              <div className="c-phone">{primary.phone}</div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ borderColor: "var(--danger)" }}>
            <p style={{ color: "var(--danger)", fontSize: 14 }}>⚠️ No emergency contact set. Please add one in the Contacts section.</p>
          </div>
        )}
      </>}

      {sosState === "activating" && (
        <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <div className="loading-dots" style={{ justifyContent: "center", marginBottom: 16 }}><span/><span/><span/></div>
          <p style={{ color: "var(--danger)", fontWeight: 800, fontSize: 20 }}>Activating Emergency Mode…</p>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 8 }}>Getting your GPS location. Please wait.</p>
        </div>
      )}

      {sosState === "active" && <>
        <div className="card" style={{ borderColor: "var(--danger)" }}>
          <div className="badge badge-red" style={{ marginBottom: 12 }}>🔴 Emergency Mode Active</div>
          {loc ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="badge badge-blue">📍 Lat: {loc.lat}</span>
              <span className="badge badge-blue">📍 Lng: {loc.lng}</span>
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>📡 GPS unavailable — share your known location manually.</p>
          )}
        </div>

        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <button className="sos-btn pulsing" style={{ cursor: "default" }} aria-label="Emergency mode is active">
            <span className="sos-emoji">🆘</span>
            <span className="sos-label">ACTIVE</span>
          </button>
        </div>

        {primary && <>
          <button className="btn btn-danger"
            onClick={() => { speak(`Calling ${primary.name}.`, settings.speechRate, settings.language); window.location.href = `tel:${primary.phone.replace(/\s/g, '')}`; }}
            aria-label={`Call ${primary.name} — ${primary.phone}`}>
            📞 Call {primary.name}
          </button>
          <button className="btn btn-secondary"
            onClick={() => {
              const msg = `🆘 EMERGENCY: I need help!\nMy location: ${loc ? `https://maps.google.com/?q=${loc.lat},${loc.lng}` : "Location unavailable — please find me"}\nSent from Smart Minds App`;
              navigator.clipboard?.writeText(msg).then(() =>
                speak("Location message copied to clipboard. Please paste it into WhatsApp or SMS to send.", settings.speechRate, settings.language)
              );
            }}
            aria-label="Copy emergency location message to clipboard for sharing">
            📋 Copy Location to Share
          </button>
        </>}
        <button className="btn btn-ghost" onClick={cancel} aria-label="Cancel emergency mode">✖ Cancel Emergency Mode</button>
      </>}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: AI ASSISTANT
// ═══════════════════════════════════════════════════════════════════════════
function AIAssistantPage({ settings }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your Smart Minds AI assistant powered by Claude. Ask me anything — navigation tips, accessibility advice, general knowledge, daily tasks, or any question you have. I'm here to help!" }
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");
    setMessages(m => [...m, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      const reply = data.reply || data.error || "Sorry, I could not get a response right now. Please try again.";
      setMessages(m => [...m, { role: "ai", text: reply }]);
      speak(reply, settings.speechRate, settings.language);
    } catch {
      const err = "AI service is not available. Please check your internet connection and try again.";
      setMessages(m => [...m, { role: "ai", text: err }]);
      speak(err, settings.speechRate, settings.language);
    } finally {
      setLoading(false);
      setTimeout(() => chatRef.current?.scrollTo(0, chatRef.current.scrollHeight), 120);
    }
  };

  const { listening, start } = useVoiceRecognition(sendMessage);

  const QUICK = ["Give me a safety tip", "How do I navigate safely?", "What can you help me with?", "Tell me today's date", "What is the weather like?", "Describe what a crosswalk looks like"];

  return (
    <main className="page" id="main-content">
      <h1 className="sec-title">🤖 AI Assistant</h1>
      <p className="sec-sub">Powered by Claude AI — ask anything, get spoken answers</p>

      <div className="chat-scroll" ref={chatRef}>
        <div className="chat-area">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}
              aria-label={`${m.role === "ai" ? "AI says" : "You said"}: ${m.text}`}>
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="chat-msg ai" aria-label="AI is thinking">
              <div className="loading-dots"><span/><span/><span/></div>
            </div>
          )}
        </div>
      </div>

      <div className="chat-input-row">
        <input className="input" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type or speak your question…"
          aria-label="Message input — press Enter to send" />
        <button className="btn btn-primary btn-icon" onClick={() => sendMessage()} aria-label="Send message" disabled={loading}>➤</button>
        <button className={`btn btn-secondary btn-icon ${listening ? "" : ""}`}
          onClick={start}
          aria-label="Voice input — tap to speak"
          style={{ borderColor: listening ? "var(--primary)" : "" }}>
          {listening ? "👂" : "🎙️"}
        </button>
      </div>

      <div className="divider" />
      <p style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", marginBottom: 10, letterSpacing: "0.08em" }}>QUICK QUESTIONS</p>
      <div className="grid-2">
        {QUICK.map(q => (
          <button key={q} className="btn btn-secondary btn-sm"
            onClick={() => sendMessage(q)} aria-label={`Ask: ${q}`}>{q}</button>
        ))}
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: READ TEXT (OCR)
// ═══════════════════════════════════════════════════════════════════════════
function OCRPage({ settings }) {
  const [image,   setImage]   = useState(null);
  const [text,    setText]    = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleFile = file => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => { setImage(e.target.result); setText(""); };
    reader.readAsDataURL(file);
  };

  const readText = async () => {
    if (!image) return;
    setLoading(true); setText("");
    try {
      const base64 = image.split(",")[1];
      const mediaType = image.split(";")[0]?.split(":")[1]?.split(";")[0] || "image/jpeg";
      const res = await fetch("/api/ai/read-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType })
      });
      const data = await res.json();
      const result = data.text || data.error || "No text could be extracted from this image.";
      setText(result);
      speak(result, settings.speechRate, settings.language);
    } catch {
      const err = "Text reading service is not available. Please check your connection and try again.";
      setText(err); speak(err, settings.speechRate, settings.language);
    } finally { setLoading(false); }
  };

  return (
    <main className="page" id="main-content">
      <h1 className="sec-title">📖 Read Text</h1>
      <p className="sec-sub">Upload or capture any image — AI reads all text aloud</p>

      <div className="row" style={{ marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => { fileRef.current.removeAttribute("capture"); fileRef.current.click(); }}
          aria-label="Upload image from your photo gallery">📁 Upload Image</button>
        <button className="btn btn-secondary"
          onClick={() => { fileRef.current.setAttribute("capture", "environment"); fileRef.current.click(); }}
          aria-label="Take a photo with your camera">📷 Camera</button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => handleFile(e.target.files[0])} aria-hidden="true" />

      {image && <>
        <img src={image} alt="Uploaded image for text extraction"
          style={{ width: "100%", borderRadius: 12, border: "1px solid var(--border)", maxHeight: 240, objectFit: "cover", marginBottom: 12 }} />
        <button className="btn btn-primary" onClick={readText} disabled={loading}
          aria-label="Extract and read text from uploaded image">
          {loading ? "Reading…" : "🔍 Extract & Read Text"}
        </button>
      </>}

      {loading && (
        <div className="card" style={{ textAlign: "center", padding: "28px" }}>
          <div className="loading-dots" style={{ justifyContent: "center", marginBottom: 12 }}><span/><span/><span/></div>
          <p style={{ color: "var(--text-muted)" }}>AI is reading the image…</p>
        </div>
      )}

      {text && <>
        <div className="card" style={{ borderColor: "var(--primary)" }}>
          <div className="badge badge-green" style={{ marginBottom: 10 }}>✅ Text Extracted</div>
          <p style={{ fontSize: 15, lineHeight: 1.8, whiteSpace: "pre-wrap" }} aria-live="polite">{text}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => speak(text, settings.speechRate, settings.language)}
          aria-label="Read extracted text aloud again">🔊 Read Aloud Again</button>
        <button className="btn btn-ghost" onClick={() => navigator.clipboard?.writeText(text)}
          aria-label="Copy extracted text to clipboard">📋 Copy Text</button>
      </>}

      {!image && (
        <div className="map-ph" style={{ height: 160, marginTop: 8 }}>
          <span style={{ fontSize: 44 }}>📄</span>
          <span>Upload a photo of any document, sign, label, menu, or book page</span>
        </div>
      )}

      <div className="divider" />
      <p className="card-sub">Works with: prescription labels, medicine bottles, food menus, street signs, documents, books, notices, price tags</p>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: SCENE VISION AI
// ═══════════════════════════════════════════════════════════════════════════
function VisionPage({ settings }) {
  const [image,   setImage]   = useState(null);
  const [result,  setResult]  = useState("");
  const [loading, setLoading] = useState(false);
  const [mode,    setMode]    = useState("describe");
  const fileRef = useRef();

  const MODES = [
    { id: "describe", label: "Describe Scene",  emoji: "🌍", prompt: "Describe this scene in detail as if helping a visually impaired person understand their surroundings. Mention people, objects, text, colours, distances, and any potential hazards. Be specific about spatial positions (left, right, near, far)." },
    { id: "objects",  label: "List Objects",    emoji: "📦", prompt: "List every object visible in this image. For each object, state: its name, its position (left/right/center, near/far), its approximate size, and whether it could be a hazard or obstacle for someone walking." },
    { id: "safety",   label: "Safety Check",   emoji: "🛡️", prompt: "You are a safety assistant for a visually impaired person. Analyse this image and identify: 1) Any immediate hazards or obstacles. 2) Uneven surfaces, stairs, or drops. 3) Moving vehicles or people. 4) Safe paths to walk. Be very specific about locations." },
    { id: "people",   label: "Find People",    emoji: "👥", prompt: "Are there any people in this image? Describe: total count, their positions in the frame, what they appear to be doing, and if any are moving toward the camera. If no people, say so clearly." },
    { id: "text",     label: "Read All Signs", emoji: "🪧", prompt: "Read every piece of text visible in this image, including signs, labels, numbers, arrows, warnings, and notices. Present them in a clear numbered list in the order they appear from top to bottom, left to right." },
  ];

  const analyze = async () => {
    if (!image) return;
    setLoading(true); setResult("");
    const m = MODES.find(x => x.id === mode);
    try {
      const base64 = image.split(",")[1];
      const mediaType = image.split(";")[0]?.split(":")[1]?.split(";")[0] || "image/jpeg";
      const res = await fetch("/api/ai/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType, prompt: m.prompt })
      });
      const data = await res.json();
      const reply = data.description || data.error || "Could not analyze the image. Please try again.";
      setResult(reply); speak(reply, settings.speechRate, settings.language);
    } catch {
      const err = "Vision AI is unavailable. Please check your internet connection.";
      setResult(err); speak(err, settings.speechRate, settings.language);
    } finally { setLoading(false); }
  };

  return (
    <main className="page" id="main-content">
      <h1 className="sec-title">👁️ Scene Vision AI</h1>
      <p className="sec-sub">AI describes your surroundings from a photo</p>

      <p style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", marginBottom: 10, letterSpacing: "0.08em" }}>ANALYSIS MODE</p>
      <div className="grid-2" style={{ marginBottom: 16 }}>
        {MODES.map(m => (
          <button key={m.id} className={`btn btn-sm ${mode === m.id ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setMode(m.id)} aria-label={m.label} aria-pressed={mode === m.id}>
            {m.emoji} {m.label}
          </button>
        ))}
      </div>

      <div className="row" style={{ marginBottom: 14 }}>
        <button className="btn btn-secondary" onClick={() => { fileRef.current.removeAttribute("capture"); fileRef.current.click(); }}
          aria-label="Upload image from gallery">📁 Upload</button>
        <button className="btn btn-secondary" onClick={() => { fileRef.current.setAttribute("capture", "environment"); fileRef.current.click(); }}
          aria-label="Take photo with camera">📷 Camera</button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => { setImage(ev.target.result); setResult(""); }; r.readAsDataURL(f); } }} />

      {image && <>
        <img src={image} alt="Scene for AI vision analysis"
          style={{ width: "100%", borderRadius: 12, border: "1px solid var(--border)", maxHeight: 240, objectFit: "cover", marginBottom: 12 }} />
        <button className="btn btn-primary" onClick={analyze} disabled={loading}
          aria-label={`Analyze image: ${MODES.find(m => m.id === mode)?.label}`}>
          {loading ? "Analyzing…" : `🔍 ${MODES.find(m => m.id === mode)?.label}`}
        </button>
      </>}

      {loading && (
        <div className="card" style={{ textAlign: "center", padding: "28px" }}>
          <div className="loading-dots" style={{ justifyContent: "center", marginBottom: 12 }}><span/><span/><span/></div>
          <p style={{ color: "var(--text-muted)" }}>AI is analyzing the scene…</p>
        </div>
      )}

      {result && <>
        <div className="card" style={{ borderColor: "var(--primary)" }}>
          <div className="badge badge-green" style={{ marginBottom: 10 }}>✅ Analysis Complete</div>
          <p style={{ fontSize: 15, lineHeight: 1.8, whiteSpace: "pre-wrap" }} aria-live="polite">{result}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => speak(result, settings.speechRate, settings.language)}
          aria-label="Read analysis result aloud">🔊 Read Aloud</button>
      </>}

      {!image && (
        <div className="map-ph" style={{ height: 160, marginTop: 8 }}>
          <span style={{ fontSize: 44 }}>👁️</span>
          <span>Take a photo or upload an image for AI scene analysis</span>
        </div>
      )}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: CONTACTS
// ═══════════════════════════════════════════════════════════════════════════
function ContactsPage({ contacts, setContacts, settings, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState({ name: "", phone: "", relationship: "", isPrimary: false });

  const openAdd  = ()  => { setForm({ name: "", phone: "", relationship: "", isPrimary: false }); setEditing(null); setShowModal(true); };
  const openEdit = (c) => { setForm(c); setEditing(c.id); setShowModal(true); };

  const save = () => {
    if (!form.name.trim() || !form.phone.trim()) { return; }
    if (form.isPrimary) setContacts(cs => cs.map(c => ({ ...c, isPrimary: false })));
    if (editing) setContacts(cs => cs.map(c => c.id === editing ? { ...form, id: editing } : c));
    else         setContacts(cs => [...cs, { ...form, id: Date.now() }]);
    setShowModal(false);
    showToast(editing ? "Contact updated" : "Contact added");
    speak(editing ? "Contact updated successfully." : `${form.name} has been added as a trusted contact.`, settings.speechRate, settings.language);
  };

  const del = (c) => {
    if (!window.confirm(`Delete contact ${c.name}?`)) return;
    setContacts(cs => cs.filter(x => x.id !== c.id));
    showToast("Contact deleted");
  };

  return (
    <main className="page" id="main-content">
      <h1 className="sec-title">👥 Trusted Contacts</h1>
      <p className="sec-sub">People who will be notified in an emergency</p>
      <button className="btn btn-primary" onClick={openAdd} aria-label="Add new trusted contact">➕ Add Contact</button>

      {contacts.length === 0 && (
        <div className="map-ph" style={{ height: 120, marginTop: 8 }}>
          <span>No contacts yet. Add a trusted contact for emergency use.</span>
        </div>
      )}

      {contacts.map(c => (
        <div key={c.id} className="contact-item">
          <div className="contact-av" aria-hidden="true">👤</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="c-name">
              {c.name}
              {c.isPrimary && <span className="badge badge-green" style={{ fontSize: 10, marginLeft: 6 }}>Primary</span>}
            </div>
            <div className="c-rel">{c.relationship}</div>
            <div className="c-phone">{c.phone}</div>
          </div>
          <div className="c-actions">
            <button className="icon-btn" onClick={() => { speak(`Calling ${c.name}.`, settings.speechRate, settings.language); window.location.href = `tel:${c.phone.replace(/\s/g, '')}`; }}
              aria-label={`Call ${c.name}`}>📞</button>
            <button className="icon-btn" onClick={() => openEdit(c)} aria-label={`Edit ${c.name}`}>✏️</button>
            <button className="icon-btn" onClick={() => del(c)} aria-label={`Delete ${c.name}`}>🗑️</button>
          </div>
        </div>
      ))}

      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={editing ? "Edit contact" : "Add new contact"}>
          <div className="modal">
            <h2 className="modal-title">{editing ? "✏️ Edit Contact" : "➕ Add Contact"}</h2>
            {[["name","Full Name","Priya Sharma"],["phone","Phone Number","+91 98765 43210"],["relationship","Relationship","Mother / Father / Friend"]].map(([f,label,ph]) => (
              <div className="input-group" key={f}>
                <label className="input-label" htmlFor={`cf-${f}`}>{label}</label>
                <input id={`cf-${f}`} className="input" value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} placeholder={ph} />
              </div>
            ))}
            <div className="setting-row" style={{ padding: "12px 0" }}>
              <div><div className="s-name">Set as Primary Emergency Contact</div><div className="s-desc">This person will be shown first in SOS mode</div></div>
              <button className={`toggle ${form.isPrimary ? "on" : ""}`}
                onClick={() => setForm(p => ({ ...p, isPrimary: !p.isPrimary }))}
                aria-label="Toggle primary contact" aria-pressed={form.isPrimary} />
            </div>
            <button className="btn btn-primary" onClick={save} style={{ marginTop: 14 }}
              aria-label="Save contact">💾 Save Contact</button>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: SAVED PLACES
// ═══════════════════════════════════════════════════════════════════════════
function PlacesPage({ places, setPlaces, settings, showToast, setPage }) {
  const [showModal, setShowModal] = useState(false);
  const [form,      setForm]      = useState({ name: "", address: "", icon: "📍" });
  const [editing,   setEditing]   = useState(null);

  const ICONS = ["🏠","🎓","🏥","🛒","🏢","⛪","🌳","🏪","🏋️","📍","🚉","🏦","🌊","🏕️","🎭"];

  const openAdd  = ()  => { setForm({ name: "", address: "", icon: "📍" }); setEditing(null); setShowModal(true); };
  const openEdit = (p) => { setForm(p); setEditing(p.id); setShowModal(true); };

  const save = () => {
    if (!form.name.trim()) return;
    if (editing) setPlaces(ps => ps.map(p => p.id === editing ? { ...form, id: editing } : p));
    else         setPlaces(ps => [...ps, { ...form, id: Date.now() }]);
    setShowModal(false);
    showToast(editing ? "Place updated" : "Place saved");
    speak(editing ? `${form.name} updated.` : `${form.name} saved to your places.`, settings.speechRate, settings.language);
  };

  const del = (p) => {
    if (!window.confirm(`Remove ${p.name} from saved places?`)) return;
    setPlaces(ps => ps.filter(x => x.id !== p.id)); showToast("Place removed");
  };

  return (
    <main className="page" id="main-content">
      <h1 className="sec-title">📌 Saved Places</h1>
      <p className="sec-sub">Your frequently visited locations — voice accessible</p>
      <button className="btn btn-primary" onClick={openAdd} aria-label="Add new saved place">➕ Add Place</button>

      {places.length === 0 && (
        <div className="map-ph" style={{ height: 120, marginTop: 8 }}>
          <span>No saved places yet. Add your home, college, hospital, and other frequent destinations.</span>
        </div>
      )}

      {places.map(p => (
        <div key={p.id} className="place-item">
          <div className="place-icon-wrap" aria-hidden="true">{p.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="c-name">{p.name}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{p.address || "No address saved"}</div>
          </div>
          <div className="c-actions">
            <button className="icon-btn" onClick={() => { setPage("navigation"); speak(`Setting destination to ${p.name}.`, settings.speechRate, settings.language); }}
              aria-label={`Navigate to ${p.name}`}>🗺️</button>
            <button className="icon-btn" onClick={() => openEdit(p)} aria-label={`Edit ${p.name}`}>✏️</button>
            <button className="icon-btn" onClick={() => del(p)} aria-label={`Delete ${p.name}`}>🗑️</button>
          </div>
        </div>
      ))}

      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={editing ? "Edit place" : "Add new place"}>
          <div className="modal">
            <h2 className="modal-title">{editing ? "✏️ Edit Place" : "📌 Add Place"}</h2>
            <div className="input-group">
              <div className="input-label">Choose Icon</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {ICONS.map(ic => (
                  <button key={ic} onClick={() => setForm(p => ({ ...p, icon: ic }))}
                    style={{ fontSize: 22, background: form.icon === ic ? "var(--primary-glow)" : "none", border: `2px solid ${form.icon === ic ? "var(--primary)" : "var(--border)"}`, borderRadius: 10, padding: 7, cursor: "pointer", lineHeight: 1 }}
                    aria-label={`Select icon ${ic}`} aria-pressed={form.icon === ic}>{ic}</button>
                ))}
              </div>
            </div>
            {[["name","Place Name","Home / College / Hospital…"],["address","Address","Street, City…"]].map(([f,label,ph]) => (
              <div className="input-group" key={f}>
                <label className="input-label" htmlFor={`pf-${f}`}>{label}</label>
                <input id={`pf-${f}`} className="input" value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} placeholder={ph} />
              </div>
            ))}
            <button className="btn btn-primary" onClick={save} style={{ marginTop: 12 }}>💾 Save Place</button>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: HISTORY
// ═══════════════════════════════════════════════════════════════════════════
function HistoryPage({ history, setHistory, showToast }) {
  const TYPE_COLORS = { LOCATION: "badge-blue", NAVIGATION: "badge-green", AI: "badge-yellow", EMERGENCY: "badge-red", OCR: "badge-yellow", VISION: "badge-blue", CONTACT: "badge-green" };
  return (
    <main className="page" id="main-content">
      <h1 className="sec-title">📋 Activity History</h1>
      <p className="sec-sub">Your recent Smart Minds activity log</p>

      {history.length > 0 && (
        <button className="btn btn-secondary btn-sm btn-auto" style={{ marginBottom: 14 }}
          onClick={() => { if (window.confirm("Clear all history?")) { setHistory([]); showToast("History cleared"); } }}
          aria-label="Clear all activity history">🗑️ Clear All History</button>
      )}

      {history.length === 0 && (
        <div className="map-ph" style={{ height: 120 }}><span>No activity yet. Your Smart Minds usage will appear here.</span></div>
      )}

      {history.map(h => (
        <div key={h.id} className="history-item">
          <div className={`badge ${TYPE_COLORS[h.type] || "badge-blue"}`} style={{ marginBottom: 6 }}>{h.type}</div>
          <div className="h-desc">{h.desc}</div>
          <div className="h-time">🕐 {h.time}</div>
        </div>
      ))}

      <div className="divider" />
      <div className="card">
        <div className="card-title">🔒 Privacy Notice</div>
        <p className="card-sub" style={{ marginTop: 6 }}>Activity history is stored locally on your device. Clear it at any time. No history is shared without your permission.</p>
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: PROFILE
// ═══════════════════════════════════════════════════════════════════════════
function ProfilePage({ user, setUser, showToast }) {
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState(user);

  const save = () => { setUser(form); setEditing(false); showToast("Profile updated"); };

  return (
    <main className="page" id="main-content">
      <h1 className="sec-title">👤 My Profile</h1>
      <p className="sec-sub">Your personal information and preferences</p>

      <div className="card" style={{ textAlign: "center", paddingTop: 28, paddingBottom: 24 }}>
        <div className="profile-av" aria-hidden="true">👤</div>
        <div style={{ fontWeight: 800, fontSize: 20 }}>{user.name || "Your Name"}</div>
        <div style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>{user.email || "your@email.com"}</div>
        <div style={{ marginTop: 12 }}><span className="badge badge-green">✅ Active User</span></div>
      </div>

      {!editing ? <>
        {[["Full Name", user.name], ["Email", user.email], ["Phone", user.phone], ["Language", user.language]].map(([label, val]) => (
          <div key={label} className="setting-row">
            <div><div className="s-name">{label}</div><div className="s-desc">{val || "Not set"}</div></div>
          </div>
        ))}
        <button className="btn btn-primary" onClick={() => setEditing(true)} style={{ marginTop: 16 }} aria-label="Edit your profile">✏️ Edit Profile</button>
      </> : <>
        {[["name","Full Name"],["email","Email address"],["phone","Phone number"]].map(([f,label]) => (
          <div className="input-group" key={f}>
            <label className="input-label" htmlFor={`pr-${f}`}>{label}</label>
            <input id={`pr-${f}`} className="input" type={f === "email" ? "email" : "text"} value={form[f] || ""} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} />
          </div>
        ))}
        <div className="input-group">
          <label className="input-label" htmlFor="pr-lang">Preferred Language</label>
          <select id="pr-lang" className="input" value={form.language || "en-US"} onChange={e => setForm(p => ({ ...p, language: e.target.value }))}>
            <option value="en-US">English (US)</option>
            <option value="en-IN">English (India)</option>
            <option value="kn-IN">Kannada (ಕನ್ನಡ)</option>
            <option value="hi-IN">Hindi (हिन्दी)</option>
            <option value="ta-IN">Tamil (தமிழ்)</option>
            <option value="te-IN">Telugu (తెలుగు)</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={save} aria-label="Save profile changes">💾 Save Profile</button>
        <button className="btn btn-secondary" onClick={() => { setForm(user); setEditing(false); }}>Cancel</button>
      </>}

      <div className="divider" />
      <div className="card" style={{ borderColor: "rgba(116,185,255,0.3)" }}>
        <div className="card-title">🔒 Privacy Statement</div>
        <p className="card-sub" style={{ marginTop: 8 }}>Smart Minds collects only what is necessary: your location (only when you request it), your contacts (stored locally), and usage history (you can delete it anytime). Your data is never sold or shared.</p>
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: SETTINGS
// ═══════════════════════════════════════════════════════════════════════════
function SettingsPage({ settings, setSettings, showToast }) {
  const toggle = key => setSettings(s => ({ ...s, [key]: !s[key] }));

  const TOGGLES = [
    { key: "highContrast",       name: "High Contrast Mode",     desc: "Maximum colour contrast for easier visibility" },
    { key: "largeText",          name: "Large Text Mode",         desc: "Increases all text size across the app" },
    { key: "extraLargeButtons",  name: "Extra Large Buttons",     desc: "Bigger tap targets — easier to press" },
    { key: "reducedMotion",      name: "Reduce Motion",           desc: "Disables all animations and transitions" },
    { key: "voiceFeedback",      name: "Voice Feedback",          desc: "Speaks confirmations and responses aloud" },
    { key: "autoReadLocation",   name: "Auto-Read Location",      desc: "Automatically reads location when page opens" },
  ];

  return (
    <main className="page" id="main-content">
      <h1 className="sec-title">⚙️ Accessibility Settings</h1>
      <p className="sec-sub">Customise Smart Minds for your needs</p>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 16 }}>🔊 Speech Rate</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)", minWidth: 36 }}>Slow</span>
          <input type="range" min="0.5" max="2" step="0.1" value={settings.speechRate}
            onChange={e => setSettings(s => ({ ...s, speechRate: parseFloat(e.target.value) }))}
            aria-label={`Speech rate: ${settings.speechRate} times normal speed`} style={{ flex: 1 }} />
          <span style={{ fontSize: 13, color: "var(--text-muted)", minWidth: 36 }}>Fast</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
          <span className="badge badge-blue">Rate: {settings.speechRate}×</span>
          <button className="btn btn-ghost btn-sm btn-auto"
            onClick={() => speak("This is a test of your current speech rate setting in Smart Minds.", settings.speechRate, settings.language)}
            aria-label="Test current speech rate">🔊 Test Voice</button>
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 4 }}>🌐 Voice Language</div>
        <p className="card-sub" style={{ marginBottom: 12 }}>Language used for all spoken output</p>
        <select className="input" value={settings.language}
          onChange={e => setSettings(s => ({ ...s, language: e.target.value }))}
          aria-label="Select voice language">
          <option value="en-US">English (US)</option>
          <option value="en-IN">English (India)</option>
          <option value="kn-IN">Kannada (ಕನ್ನಡ)</option>
          <option value="hi-IN">Hindi (हिन्दी)</option>
          <option value="ta-IN">Tamil (தமிழ்)</option>
          <option value="te-IN">Telugu (తెలుగు)</option>
        </select>
      </div>

      <div className="card">
        {TOGGLES.map(t => (
          <div key={t.key} className="setting-row">
            <div style={{ flex: 1, paddingRight: 16 }}>
              <div className="s-name">{t.name}</div>
              <div className="s-desc">{t.desc}</div>
            </div>
            <button className={`toggle ${settings[t.key] ? "on" : ""}`}
              onClick={() => toggle(t.key)}
              aria-label={`${t.name}: currently ${settings[t.key] ? "on" : "off"}`}
              aria-pressed={settings[t.key]} />
          </div>
        ))}
      </div>

      <button className="btn btn-primary"
        onClick={() => { showToast("Settings saved"); speak("Settings saved successfully.", settings.speechRate, settings.language); }}
        aria-label="Save all settings">✅ Save Settings</button>

      <div className="card" style={{ marginTop: 8, borderColor: "rgba(255,217,61,0.3)" }}>
        <div className="card-title" style={{ marginBottom: 8 }}>♿ Accessibility Notes</div>
        <p className="card-sub">All buttons meet the 44×44px minimum touch target. Screen reader labels are on every element. Colour is never the only way information is communicated. Use Tab key to navigate by keyboard.</p>
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: AUTH
// ═══════════════════════════════════════════════════════════════════════════
function AuthPage({ onLogin }) {
  const [mode,  setMode]  = useState("login");
  const [form,  setForm]  = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = () => {
    setError("");
    if (!form.email.trim() || !form.password.trim()) { setError("Please fill in all required fields."); return; }
    if (mode === "register" && !form.name.trim()) { setError("Please enter your full name."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    const name = form.name || form.email.split("@")[0];
    onLogin({ name, email: form.email, phone: "", language: "en-US" });
    speak(`Welcome to Smart Minds, ${name}! I am ready to help you.`, 1, "en-US");
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <div className="auth-logo">
          <div className="auth-logo-icon" aria-hidden="true">🧠</div>
          <div className="auth-logo-title">Smart Minds</div>
          <div className="auth-logo-sub">AI-Powered Assistive Platform</div>
        </div>

        <div className="tab-row" role="tablist" aria-label="Sign in or register">
          {[["login","Sign In"],["register","Register"]].map(([m,label]) => (
            <button key={m} className={`tab-btn ${mode === m ? "active" : ""}`}
              onClick={() => { setMode(m); setError(""); }}
              role="tab" aria-selected={mode === m} aria-label={label}>{label}</button>
          ))}
        </div>

        {mode === "register" && (
          <div className="input-group">
            <label className="input-label" htmlFor="a-name">Full Name</label>
            <input id="a-name" className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" autoComplete="name" />
          </div>
        )}
        <div className="input-group">
          <label className="input-label" htmlFor="a-email">Email Address</label>
          <input id="a-email" className="input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@email.com" autoComplete="email" />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="a-pass">Password</label>
          <input id="a-pass" className="input" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            placeholder="••••••••" autoComplete={mode === "login" ? "current-password" : "new-password"}
            onKeyDown={e => e.key === "Enter" && submit()} />
        </div>

        {error && <div className="badge badge-red" style={{ marginBottom: 12, display: "flex" }} role="alert" aria-live="assertive">⚠️ {error}</div>}

        <button className="btn btn-primary" onClick={submit}
          aria-label={mode === "login" ? "Sign in to Smart Minds" : "Create your Smart Minds account"}>
          {mode === "login" ? "🔓 Sign In" : "✨ Create Account"}
        </button>

        <button className="btn btn-secondary" onClick={() => onLogin({ name: "Demo User", email: "demo@smartminds.app", phone: "+91 99999 00000", language: "en-US" })}
          aria-label="Try demo mode without creating an account">
          🔬 Try Demo Mode (No Account Needed)
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-dim)", marginTop: 8, lineHeight: 1.6 }}>
          Demo mode uses sample data and is safe for presentations.<br/>No account or internet needed for demo.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { id: "home",      icon: "🏠", label: "Home" },
  { id: "voice",     icon: "🎙️", label: "Voice" },
  { id: "emergency", icon: "🆘", label: "SOS" },
  { id: "ai",        icon: "🤖", label: "AI" },
  { id: "settings",  icon: "⚙️", label: "More" },
];

const PAGE_TITLES = {
  home: "Smart Minds", voice: "Voice Assistant", location: "My Location",
  navigation: "Navigation", emergency: "Emergency SOS", ai: "AI Assistant",
  ocr: "Read Text", vision: "Scene Vision", places: "Saved Places",
  contacts: "Contacts", history: "History", profile: "Profile", settings: "Settings",
};

export default function App() {
  const [authed,   setAuthed]   = useState(false);
  const [user,     setUser]     = useState({ name: "", email: "", phone: "", language: "en-US" });
  const [page,     setPage]     = useState("home");
  const [contacts, setContacts] = useState(INIT_CONTACTS);
  const [places,   setPlaces]   = useState(INIT_PLACES);
  const [history,  setHistory]  = useState(INIT_HISTORY);
  const [toast,    setToast]    = useState(null);
  const [settings, setSettings] = useState({
    highContrast: false, largeText: false, extraLargeButtons: false,
    reducedMotion: false, voiceFeedback: true, autoReadLocation: false,
    speechRate: 1, language: "en-US",
  });

  const showToast = msg => setToast(msg);

  useEffect(() => {
    document.body.classList.toggle("high-contrast",      settings.highContrast);
    document.body.classList.toggle("large-text",         settings.largeText);
    document.body.classList.toggle("extra-large-btn",    settings.extraLargeButtons);
    document.body.classList.toggle("reduced-motion",     settings.reducedMotion);
  }, [settings]);

  const PROPS = { settings, setPage, showToast, contacts, setContacts, places, setPlaces, history, setHistory, user, setUser, setSettings };

  const renderPage = () => {
    switch (page) {
      case "home":       return <HomePage       {...PROPS} />;
      case "voice":      return <VoiceAssistantPage {...PROPS} />;
      case "location":   return <LocationPage   {...PROPS} />;
      case "navigation": return <NavigationPage {...PROPS} />;
      case "emergency":  return <EmergencyPage  {...PROPS} />;
      case "ai":         return <AIAssistantPage {...PROPS} />;
      case "ocr":        return <OCRPage        {...PROPS} />;
      case "vision":     return <VisionPage     {...PROPS} />;
      case "places":     return <PlacesPage     {...PROPS} />;
      case "contacts":   return <ContactsPage   {...PROPS} />;
      case "history":    return <HistoryPage    {...PROPS} />;
      case "profile":    return <ProfilePage    {...PROPS} />;
      case "settings":   return <SettingsPage   {...PROPS} />;
      default:           return <HomePage       {...PROPS} />;
    }
  };

  if (!authed) return (
    <>
      <style>{STYLES}</style>
      <AuthPage onLogin={u => { setUser(u); setAuthed(true); }} />
    </>
  );

  return (
    <>
      <style>{STYLES}</style>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="app">
        <TopBar title={PAGE_TITLES[page] || "Smart Minds"} sub={page === "home" ? "Assistive AI Platform" : undefined} />
        {renderPage()}
        <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
          {NAV_ITEMS.map(n => (
            <button key={n.id} className={`nav-btn ${page === n.id ? "active" : ""}`}
              onClick={() => setPage(n.id)}
              aria-label={n.label} aria-current={page === n.id ? "page" : undefined}>
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
