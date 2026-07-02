import { NavLink } from "react-router-dom";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/ai-model", label: "AI Model" },
  { to: "/technology", label: "Technology" },
  { to: "/about", label: "About" },
  { to: "/battery", label: "Battery" },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3">
      <nav className="max-w-6xl mx-auto glass rounded-full px-4 md:px-6 py-2.5 flex items-center justify-between">
        <NavLink to="/" className="font-display font-semibold text-sm tracking-wide flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyanGlow shadow-[0_0_8px_#00d4ff]" />
          Smart Blind Stick
        </NavLink>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive ? "bg-cyanGlow text-black" : "hover:text-cyanGlow"
                }`
              }
              style={({ isActive }) => (isActive ? {} : { color: "var(--text-muted)" })}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-8 h-8 rounded-full glass flex items-center justify-center hover:border-cyanGlow/50 transition-colors"
        >
          {isDark ? <FiSun size={14} /> : <FiMoon size={14} />}
        </button>
      </nav>

      <div className="md:hidden max-w-6xl mx-auto mt-2 flex gap-1 overflow-x-auto glass rounded-full px-2 py-1.5">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${
                isActive ? "bg-cyanGlow text-black" : ""
              }`
            }
            style={({ isActive }) => (isActive ? {} : { color: "var(--text-muted)" })}
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
