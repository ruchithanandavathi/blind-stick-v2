import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Component anchor points (local model space, y-up, stick vertical) ────────
export const COMPONENT_ANCHORS = {
  solar:       [0.0,  2.18,  0.0],
  camera:      [0.0,  1.98,  0.19],
  microphone:  [0.0,  1.82,  0.19],
  ultrasonic:  [0.0,  1.72, -0.18],
  raspberrypi: [0.0,  1.42,  0.0],
  gps:         [0.19, 1.55,  0.0],
  sim:         [0.19, 1.28,  0.0],
  speaker:     [-0.18, 1.18, 0.0],
  sos:         [0.0,  1.02,  0.19],
  vibration:   [0.0,  0.7,   0.16],
  battery:     [0.0,  0.6,  -0.16],
  water:       [0.0, -1.98,  0.0],
};

const COMPONENT_KEYS = Object.keys(COMPONENT_ANCHORS);

// ─── Materials factory (memoised per render) ──────────────────────────────────
function useMaterials() {
  return useMemo(() => ({
    body: new THREE.MeshStandardMaterial({
      color: "#1a1c20", metalness: 0.45, roughness: 0.6,
    }),
    grip: new THREE.MeshStandardMaterial({
      color: "#0d0f12", metalness: 0.25, roughness: 0.8,
    }),
    metal: new THREE.MeshStandardMaterial({
      color: "#b0bec5", metalness: 0.92, roughness: 0.12,
    }),
    copper: new THREE.MeshStandardMaterial({
      color: "#b87333", metalness: 0.88, roughness: 0.18,
    }),
    pcbGreen: new THREE.MeshStandardMaterial({
      color: "#0d3320", metalness: 0.3, roughness: 0.55,
    }),
    pcbGold: new THREE.MeshStandardMaterial({
      color: "#d4a017", metalness: 0.85, roughness: 0.22,
    }),
    lens: new THREE.MeshStandardMaterial({
      color: "#001122", metalness: 0.1, roughness: 0.05,
      transparent: true, opacity: 0.82,
    }),
    solarGlass: new THREE.MeshStandardMaterial({
      color: "#0a1a2a", metalness: 0.2, roughness: 0.08,
      transparent: true, opacity: 0.9,
    }),
    plastic: new THREE.MeshStandardMaterial({
      color: "#1c1c24", metalness: 0.15, roughness: 0.75,
    }),
    redButton: new THREE.MeshStandardMaterial({
      color: "#cc2222", metalness: 0.3, roughness: 0.45,
      emissive: "#ff3333", emissiveIntensity: 0.4,
    }),
  }), []);
}

// ─── Pulsing glow ring ────────────────────────────────────────────────────────
function GlowRing({ position, rotation = [0,0,0], color = "#00d4ff", active, hovered, scale = 1 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const on = active || hovered;
    ref.current.scale.setScalar(scale * (on ? 1 + Math.sin(t * 4) * 0.1 : 1));
    ref.current.material.opacity = on ? 0.9 : 0.28;
  });
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <ringGeometry args={[0.048, 0.068, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.28} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Animated scan cone for camera/ultrasonic ─────────────────────────────────
function ScanCone({ active, color = "#00d4ff", distance = 0.7 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.material.opacity = active
      ? 0.08 + Math.sin(clock.getElapsedTime() * 2.5) * 0.04 : 0;
  });
  return (
    <mesh ref={ref} position={[0, 0, distance / 2]} rotation={[Math.PI / 2, 0, 0]}>
      <coneGeometry args={[distance * 0.55, distance, 24, 1, true]} />
      <meshBasicMaterial color={color} transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Ultrasonic wave rings ─────────────────────────────────────────────────────
function UltrasonicWaves({ active }) {
  const rings = [useRef(), useRef(), useRef()];
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    rings.forEach((r, i) => {
      if (!r.current) return;
      const phase = (t * 1.5 + i * 0.6) % 2;
      r.current.scale.setScalar(active ? 0.5 + phase * 0.8 : 0.01);
      r.current.material.opacity = active ? Math.max(0, 0.5 - phase * 0.25) : 0;
    });
  });
  return (
    <>
      {rings.map((r, i) => (
        <mesh key={i} ref={r} position={[0, 0, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.02, 0.04, 24]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
}

// ─── Solar cell grid pattern ───────────────────────────────────────────────────
function SolarCells({ active }) {
  const lines = [];
  for (let i = -2; i <= 2; i++) {
    lines.push(
      <mesh key={`h${i}`} position={[i * 0.018, 0.001, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.001, 0.001, 0.095]} />
        <meshBasicMaterial color={active ? "#1e88e5" : "#222"} />
      </mesh>,
      <mesh key={`v${i}`} position={[0, 0.001, i * 0.018]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.095, 0.001, 0.001]} />
        <meshBasicMaterial color={active ? "#1e88e5" : "#222"} />
      </mesh>
    );
  }
  return <>{lines}</>;
}

// ─── Vibration motor ripple ────────────────────────────────────────────────────
function VibrationRipple({ active }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    if (active) {
      ref.current.position.x = Math.sin(t * 40) * 0.006;
      ref.current.position.z = Math.cos(t * 40) * 0.006;
    } else {
      ref.current.position.x = 0;
      ref.current.position.z = 0;
    }
  });
  return <group ref={ref} />;
}

// ─── Copper wire trace ─────────────────────────────────────────────────────────
function WireTrace({ points, color = "#b87333", visible = true, animated = false }) {
  const ref = useRef();
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), []);
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 20, 0.004, 6, false), [curve]);
  useFrame(({ clock }) => {
    if (!ref.current || !animated) return;
    const t = (clock.getElapsedTime() * 0.5) % 1;
    ref.current.material.dashOffset = -t;
  });
  if (!visible) return null;
  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} transparent opacity={0.7} />
    </mesh>
  );
}

// ─── PCB chip representation ───────────────────────────────────────────────────
function PCBChip({ position, size = [0.025, 0.004, 0.025], color = "#1a1a1a" }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* pin legs */}
      {[-1, 1].map(side =>
        Array.from({ length: 3 }).map((_, i) => (
          <mesh key={`${side}-${i}`} position={[side * (size[0] / 2 + 0.003), 0, (i - 1) * (size[2] / 3)]}>
            <boxGeometry args={[0.006, 0.002, 0.001]} />
            <meshStandardMaterial color="#b87333" metalness={0.85} roughness={0.2} />
          </mesh>
        ))
      )}
    </group>
  );
}

// ─── Exploded position calculator ─────────────────────────────────────────────
function getExplodedOffset(key, t) {
  const offsets = {
    solar:       [0, 0.9, 0],
    camera:      [0.5, 0.5, 0.4],
    microphone:  [0.5, 0.25, 0.4],
    ultrasonic:  [-0.5, 0.25, -0.3],
    raspberrypi: [0.6, 0.1, 0],
    gps:         [0.55, 0.6, 0.2],
    sim:         [0.55, 0.35, 0.2],
    speaker:     [-0.55, 0.2, 0.2],
    sos:         [0.3, -0.1, 0.5],
    vibration:   [0.3, -0.3, 0.4],
    battery:     [-0.5, -0.4, -0.3],
    water:       [0, -0.9, 0],
  };
  const off = offsets[key] || [0, 0, 0];
  return off.map(v => v * t);
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN MODEL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function SmartStickModel({
  activeComponent,
  onSelect,
  onHover,
  autoRotate = true,
  exploded = false,
  showWiring = false,
}) {
  const group = useRef();
  const [hovered, setHovered] = useState(null);
  const [explodeT, setExplodeT] = useState(0);
  const mat = useMaterials();

  // Smooth explode transition
  useFrame((_, delta) => {
    if (autoRotate && group.current && !activeComponent) {
      group.current.rotation.y += delta * 0.14;
    }
    setExplodeT(prev => {
      const target = exploded ? 1 : 0;
      return THREE.MathUtils.lerp(prev, target, delta * 2.5);
    });
  });

  const isActive = k => activeComponent === k;
  const isHov = k => hovered === k;
  const dimmed = k => !!activeComponent && !isActive(k);

  const handlers = key => ({
    onClick: e => { e.stopPropagation(); onSelect?.(key); },
    onPointerOver: e => {
      e.stopPropagation();
      setHovered(key);
      onHover?.(key);
      document.body.style.cursor = "pointer";
    },
    onPointerOut: e => {
      e.stopPropagation();
      setHovered(null);
      onHover?.(null);
      document.body.style.cursor = "auto";
    },
  });

  // Returns a material that reacts to active/hover/dim state
  const stateMat = (key, base, emissive = "#00d4ff") => {
    const on = isActive(key) || isHov(key);
    const d = dimmed(key);
    return new THREE.MeshStandardMaterial({
      color: d ? "#1a1c20" : base,
      emissive: emissive,
      emissiveIntensity: d ? 0 : on ? 1.4 : 0.0,
      metalness: 0.35,
      roughness: 0.45,
      transparent: d,
      opacity: d ? 0.35 : 1,
    });
  };

  // Anchor + explode offset combined position
  const pos = key => {
    const a = COMPONENT_ANCHORS[key];
    const off = getExplodedOffset(key, explodeT);
    return [a[0] + off[0], a[1] + off[1], a[2] + off[2]];
  };

  return (
    <group ref={group} position={[0, -0.4, 0]}>

      {/* ═══ MAIN SHAFT ══════════════════════════════════════════════════════ */}
      {!exploded && (
        <group>
          {/* Primary shaft — matte black carbon-look */}
          <mesh material={mat.body} castShadow receiveShadow>
            <cylinderGeometry args={[0.045, 0.052, 3.4, 32]} />
          </mesh>
          {/* Metallic ring joints every 22cm */}
          {Array.from({ length: 16 }).map((_, i) => (
            <mesh key={i} position={[0, -1.0 + i * 0.22, 0]} material={mat.metal}>
              <torusGeometry args={[0.053, 0.0028, 8, 24]} />
            </mesh>
          ))}
          {/* Flat panel channel for electronics housing */}
          <mesh material={mat.plastic} position={[0, 1.3, 0.052]} castShadow>
            <boxGeometry args={[0.18, 0.88, 0.012]} />
          </mesh>
          <mesh material={mat.plastic} position={[0.052, 1.3, 0]} rotation={[0, Math.PI/2, 0]}>
            <boxGeometry args={[0.18, 0.88, 0.012]} />
          </mesh>
        </group>
      )}

      {/* ═══ GRIP HANDLE ═════════════════════════════════════════════════════ */}
      {!exploded && (
        <group position={[0, 2.3, 0]}>
          <mesh material={mat.grip} castShadow>
            <cylinderGeometry args={[0.075, 0.06, 0.55, 24]} />
          </mesh>
          {/* Grip texture ridges */}
          {Array.from({ length: 10 }).map((_, i) => (
            <mesh key={i} position={[0, -0.22 + i * 0.048, 0]} material={mat.grip}>
              <torusGeometry args={[0.078, 0.007, 8, 24]} />
            </mesh>
          ))}
          {/* Top cap */}
          <mesh position={[0, 0.29, 0]} material={mat.metal}>
            <sphereGeometry args={[0.075, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        </group>
      )}

      {/* ═══ SOLAR PANEL (TOP) ═══════════════════════════════════════════════ */}
      <group position={pos("solar")} {...handlers("solar")}>
        {/* Mounting ring */}
        <mesh material={mat.metal}>
          <cylinderGeometry args={[0.058, 0.055, 0.018, 16]} />
        </mesh>
        {/* Glass solar surface */}
        <mesh position={[0, 0.01, 0]} material={isActive("solar") || isHov("solar")
          ? new THREE.MeshStandardMaterial({ color: "#0a2a4a", metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.92, emissive: "#1e5fff", emissiveIntensity: 0.4 })
          : mat.solarGlass}>
          <boxGeometry args={[0.1, 0.008, 0.1]} />
        </mesh>
        <SolarCells active={isActive("solar") || isHov("solar")} />
        {/* Screws */}
        {[[-0.04, 0, -0.04], [0.04, 0, 0.04], [-0.04, 0, 0.04], [0.04, 0, -0.04]].map((p, i) => (
          <mesh key={i} position={[p[0], 0.014, p[2]]} material={mat.metal}>
            <cylinderGeometry args={[0.005, 0.005, 0.007, 8]} />
          </mesh>
        ))}
        <GlowRing
          position={[0, 0.02, 0]}
          rotation={[-Math.PI/2, 0, 0]}
          color="#1e5fff"
          active={isActive("solar")} hovered={isHov("solar")}
        />
      </group>

      {/* ═══ CAMERA MODULE ═══════════════════════════════════════════════════ */}
      <group position={pos("camera")} {...handlers("camera")}>
        {/* PCB body */}
        <mesh material={mat.pcbGreen}>
          <boxGeometry args={[0.052, 0.006, 0.052]} />
        </mesh>
        {/* Lens barrel */}
        <mesh position={[0, 0.007, 0.012]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.014, 0.018, 16]} />
          <meshStandardMaterial color="#111" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Lens glass */}
        <mesh position={[0, 0.017, 0.012]} rotation={[Math.PI / 2, 0, 0]}
          material={isActive("camera") || isHov("camera")
            ? new THREE.MeshStandardMaterial({ color: "#002244", transparent: true, opacity: 0.88, emissive: "#00d4ff", emissiveIntensity: 0.8, roughness: 0.05 })
            : mat.lens}>
          <cylinderGeometry args={[0.0095, 0.0095, 0.003, 16]} />
        </mesh>
        {/* Ribbon cable stub */}
        <mesh position={[0, -0.01, -0.018]} material={mat.plastic}>
          <boxGeometry args={[0.03, 0.003, 0.02]} />
        </mesh>
        <ScanCone active={isActive("camera") || isHov("camera")} distance={0.6} />
        <GlowRing position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]} active={isActive("camera")} hovered={isHov("camera")} />
      </group>

      {/* ═══ MICROPHONE ══════════════════════════════════════════════════════ */}
      <group position={pos("microphone")} {...handlers("microphone")}>
        <mesh material={mat.metal}>
          <cylinderGeometry args={[0.014, 0.014, 0.012, 16]} />
        </mesh>
        {/* Mesh grille */}
        <mesh position={[0, 0.007, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.003, 16]} />
          <meshStandardMaterial color="#222" wireframe />
        </mesh>
        <GlowRing position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]} active={isActive("microphone")} hovered={isHov("microphone")} />
      </group>

      {/* ═══ ULTRASONIC SENSOR ═══════════════════════════════════════════════ */}
      <group position={pos("ultrasonic")} rotation={[0, Math.PI, 0]} {...handlers("ultrasonic")}>
        {/* Housing board */}
        <mesh material={mat.pcbGreen}>
          <boxGeometry args={[0.09, 0.006, 0.032]} />
        </mesh>
        {/* Twin transducer cans */}
        {[-0.028, 0.028].map((x, i) => (
          <group key={i} position={[x, 0.014, 0]}>
            <mesh>
              <cylinderGeometry args={[0.014, 0.014, 0.028, 16]} />
              <meshStandardMaterial color="#c0c8d0" metalness={0.7} roughness={0.25} />
            </mesh>
            {/* Inner mesh */}
            <mesh position={[0, 0.015, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.003, 16]} />
              <meshStandardMaterial color="#333" wireframe />
            </mesh>
          </group>
        ))}
        <UltrasonicWaves active={isActive("ultrasonic") || isHov("ultrasonic")} />
        <GlowRing position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]} active={isActive("ultrasonic")} hovered={isHov("ultrasonic")} />
      </group>

      {/* ═══ RASPBERRY PI ════════════════════════════════════════════════════ */}
      <group position={pos("raspberrypi")} {...handlers("raspberrypi")}>
        {/* Main PCB */}
        <mesh material={mat.pcbGreen} castShadow>
          <boxGeometry args={[0.17, 0.007, 0.115]} />
        </mesh>
        {/* CPU chip */}
        <PCBChip position={[0.02, 0.007, -0.01]} size={[0.038, 0.005, 0.038]} color="#1a1a1a" />
        {/* RAM chip */}
        <PCBChip position={[-0.04, 0.007, 0.02]} size={[0.022, 0.004, 0.022]} color="#111" />
        {/* USB ports */}
        {[0.01, 0.04].map((z, i) => (
          <mesh key={i} position={[0.085, 0.01, z]}>
            <boxGeometry args={[0.016, 0.012, 0.022]} />
            <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
          </mesh>
        ))}
        {/* GPIO header pins */}
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i} position={[-0.075 + i * 0.015, 0.013, -0.045]} material={mat.metal}>
            <cylinderGeometry args={[0.0018, 0.0018, 0.012, 6]} />
          </mesh>
        ))}
        {/* Gold pads on edge */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[-0.075 + i * 0.026, 0.007, 0.056]} material={mat.pcbGold}>
            <boxGeometry args={[0.012, 0.002, 0.005]} />
          </mesh>
        ))}
        {/* Status LEDs */}
        {[["#00ff00", -0.055, 0.052], ["#ff0000", -0.035, 0.052]].map(([c, x, z]) => (
          <mesh key={c} position={[x, 0.009, z]}>
            <boxGeometry args={[0.006, 0.004, 0.004]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={isActive("raspberrypi") ? 1.5 : 0.4} />
          </mesh>
        ))}
        <GlowRing position={[0, 0.015, 0]} rotation={[-Math.PI/2, 0, 0]} active={isActive("raspberrypi")} hovered={isHov("raspberrypi")} scale={1.4} />
      </group>

      {/* ═══ GPS ANTENNA ═════════════════════════════════════════════════════ */}
      <group position={pos("gps")} rotation={[0, -Math.PI/2, 0]} {...handlers("gps")}>
        {/* Patch antenna square */}
        <mesh material={mat.metal}>
          <boxGeometry args={[0.025, 0.003, 0.025]} />
        </mesh>
        <mesh position={[0, 0.008, 0]} material={isActive("gps") || isHov("gps")
          ? new THREE.MeshStandardMaterial({ color: "#0022aa", emissive: "#1e5fff", emissiveIntensity: 1 })
          : new THREE.MeshStandardMaterial({ color: "#0a0a3a", metalness: 0.2, roughness: 0.6 })}>
          <boxGeometry args={[0.022, 0.006, 0.022]} />
        </mesh>
        {/* Cable coax stub */}
        <mesh position={[0, -0.012, 0]} material={mat.plastic}>
          <cylinderGeometry args={[0.004, 0.004, 0.02, 8]} />
        </mesh>
        <GlowRing position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]} color="#1e5fff" active={isActive("gps")} hovered={isHov("gps")} />
      </group>

      {/* ═══ SIM800L / GSM MODULE ════════════════════════════════════════════ */}
      <group position={pos("sim")} rotation={[0, -Math.PI/2, 0]} {...handlers("sim")}>
        <mesh material={mat.pcbGreen}>
          <boxGeometry args={[0.055, 0.006, 0.04]} />
        </mesh>
        <PCBChip position={[0, 0.007, -0.005]} size={[0.022, 0.004, 0.018]} color="#111" />
        {/* SIM card slot */}
        <mesh position={[0.02, 0.005, 0.016]} material={mat.metal}>
          <boxGeometry args={[0.018, 0.006, 0.006]} />
        </mesh>
        {/* Antenna wire */}
        <mesh position={[-0.04, 0.018, 0]} material={mat.metal}>
          <cylinderGeometry args={[0.002, 0.002, 0.05, 6]} />
        </mesh>
        <GlowRing position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]} color="#ffb340" active={isActive("sim")} hovered={isHov("sim")} />
      </group>

      {/* ═══ SPEAKER ═════════════════════════════════════════════════════════ */}
      <group position={pos("speaker")} rotation={[0, Math.PI/2, 0]} {...handlers("speaker")}>
        {/* Housing */}
        <mesh material={mat.plastic}>
          <cylinderGeometry args={[0.032, 0.032, 0.018, 24]} />
        </mesh>
        {/* Grille mesh */}
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh key={i} position={[0, 0.01, 0]} rotation={[Math.PI/2, (i * Math.PI) / 4, 0]}>
            <boxGeometry args={[0.001, 0.058, 0.001]} />
            <meshBasicMaterial color={isActive("speaker") || isHov("speaker") ? "#00d4ff" : "#444"} />
          </mesh>
        ))}
        {/* Outer ring detail */}
        <mesh position={[0, 0, 0]} material={mat.metal}>
          <torusGeometry args={[0.032, 0.003, 8, 24]} />
        </mesh>
        <GlowRing position={[0, 0.012, 0]} rotation={[-Math.PI/2, 0, 0]} active={isActive("speaker")} hovered={isHov("speaker")} />
      </group>

      {/* ═══ SOS BUTTON ══════════════════════════════════════════════════════ */}
      <group position={pos("sos")} {...handlers("sos")}>
        {/* Mounting ring */}
        <mesh material={mat.metal}>
          <cylinderGeometry args={[0.026, 0.026, 0.01, 20]} />
        </mesh>
        {/* Red dome cap */}
        <mesh position={[0, 0.012, 0]}>
          <sphereGeometry args={[0.02, 20, 12, 0, Math.PI*2, 0, Math.PI/2]} />
          <meshStandardMaterial
            color="#cc1111"
            emissive="#ff2222"
            emissiveIntensity={isActive("sos") || isHov("sos") ? 1.6 : 0.45}
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>
        {/* SOS label engraving (tiny plane) */}
        <mesh position={[0, 0.022, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[0.018, 0.006]} />
          <meshBasicMaterial color="#fff" transparent opacity={0.4} />
        </mesh>
        <GlowRing position={[0, 0.005, 0]} rotation={[-Math.PI/2, 0, 0]} color="#ff4444" active={isActive("sos")} hovered={isHov("sos")} />
      </group>

      {/* ═══ VIBRATION MOTOR ═════════════════════════════════════════════════ */}
      <group position={pos("vibration")} {...handlers("vibration")}>
        <VibrationRipple active={isActive("vibration") || isHov("vibration")} />
        {/* Coin motor */}
        <mesh material={mat.metal}>
          <cylinderGeometry args={[0.018, 0.018, 0.005, 20]} />
        </mesh>
        {/* Eccentric weight */}
        <mesh position={[0.01, 0, 0]} rotation={[0, 0, Math.PI/4]}>
          <cylinderGeometry args={[0.008, 0.008, 0.003, 8, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Wire leads */}
        <mesh position={[-0.022, 0, 0]} rotation={[0, 0, Math.PI/2]} material={mat.copper}>
          <cylinderGeometry args={[0.0015, 0.0015, 0.015, 6]} />
        </mesh>
        <GlowRing position={[0, 0.006, 0]} rotation={[-Math.PI/2, 0, 0]} color="#3dffb0" active={isActive("vibration")} hovered={isHov("vibration")} />
      </group>

      {/* ═══ BATTERY ═════════════════════════════════════════════════════════ */}
      <group position={pos("battery")} {...handlers("battery")}>
        {/* Li-ion cell body */}
        <mesh material={isActive("battery") || isHov("battery")
          ? new THREE.MeshStandardMaterial({ color: "#1a3a1a", emissive: "#3dffb0", emissiveIntensity: 0.6, metalness: 0.6, roughness: 0.3 })
          : new THREE.MeshStandardMaterial({ color: "#1a2a1a", metalness: 0.65, roughness: 0.3 })}>
          <boxGeometry args={[0.055, 0.09, 0.018]} />
        </mesh>
        {/* Charge level bars */}
        {[0, 1, 2].map(i => (
          <mesh key={i} position={[0, -0.025 + i * 0.025, 0.011]}>
            <boxGeometry args={[0.038, 0.016, 0.002]} />
            <meshStandardMaterial
              color={i === 0 ? "#ff4d4d" : i === 1 ? "#ffb340" : "#3dffb0"}
              emissive={i === 2 ? "#3dffb0" : "#000"}
              emissiveIntensity={isActive("battery") ? 0.8 : 0}
            />
          </mesh>
        ))}
        {/* Positive/negative terminals */}
        {[0.03, -0.03].map((x, i) => (
          <mesh key={i} position={[x, 0.048, 0]} material={mat.metal}>
            <cylinderGeometry args={[0.006, 0.006, 0.009, 8]} />
          </mesh>
        ))}
        <GlowRing position={[0, 0, 0.014]} color="#3dffb0" active={isActive("battery")} hovered={isHov("battery")} />
      </group>

      {/* ═══ WATER SENSOR (BOTTOM TIP) ═══════════════════════════════════════ */}
      <group position={pos("water")} {...handlers("water")}>
        {/* Sensor PCB disc */}
        <mesh material={mat.pcbGreen}>
          <cylinderGeometry args={[0.03, 0.03, 0.01, 16]} />
        </mesh>
        {/* Probe traces (copper lines on bottom) */}
        {[0, Math.PI/4, Math.PI/2, 3*Math.PI/4].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle)*0.016, -0.006, Math.sin(angle)*0.016]} material={mat.copper}>
            <boxGeometry args={[0.004, 0.002, 0.024]} />
          </mesh>
        ))}
        {/* Stainless tip cone */}
        <mesh position={[0, -0.05, 0]} material={mat.metal}>
          <coneGeometry args={[0.024, 0.08, 16]} />
        </mesh>
        {/* Tip cap */}
        <mesh position={[0, -0.09, 0]} material={mat.metal}>
          <sphereGeometry args={[0.012, 12, 8]} />
        </mesh>
        <GlowRing position={[0, -0.002, 0]} rotation={[-Math.PI/2, 0, 0]} active={isActive("water")} hovered={isHov("water")} />
      </group>

      {/* ═══ INTERNAL WIRING VIEW ════════════════════════════════════════════ */}
      {showWiring && (
        <group>
          {/* Camera → Pi */}
          <WireTrace points={[[0, 1.98, 0.19], [0, 1.8, 0.12], [0, 1.5, 0.085]]} color="#00d4ff" animated />
          {/* GPS → Pi */}
          <WireTrace points={[[0.19, 1.55, 0], [0.14, 1.52, 0], [0.085, 1.48, 0]]} color="#1e5fff" animated />
          {/* SIM → Pi */}
          <WireTrace points={[[0.19, 1.28, 0], [0.14, 1.3, 0], [0.085, 1.38, 0]]} color="#ffb340" animated />
          {/* Speaker → Pi */}
          <WireTrace points={[[-0.18, 1.18, 0], [-0.12, 1.22, 0], [-0.085, 1.36, 0]]} color="#00d4ff" animated />
          {/* Ultrasonic → Pi */}
          <WireTrace points={[[0, 1.72, -0.18], [0, 1.62, -0.1], [0, 1.56, 0]]} color="#00d4ff" animated />
          {/* Battery → Solar */}
          <WireTrace points={[[0, 0.6, -0.16], [0, 1.2, -0.1], [0, 2.18, 0]]} color="#3dffb0" animated />
          {/* SOS → Pi */}
          <WireTrace points={[[0, 1.02, 0.19], [0, 1.15, 0.15], [0, 1.42, 0.08]]} color="#ff4444" animated />
          {/* Water → Pi */}
          <WireTrace points={[[0, -1.98, 0], [0, 0, 0.02], [0, 1.42, -0.05]]} color="#00d4ff" animated />
          {/* Mic → Pi */}
          <WireTrace points={[[0, 1.82, 0.19], [0, 1.72, 0.14], [0, 1.5, 0.085]]} color="#00d4ff" animated />
        </group>
      )}

      {/* ═══ EXPLODED VIEW CONNECTOR LINES ══════════════════════════════════ */}
      {exploded && explodeT > 0.5 && COMPONENT_KEYS.map(key => {
        const anchor = COMPONENT_ANCHORS[key];
        const off = getExplodedOffset(key, explodeT);
        const compPos = [anchor[0] + off[0], anchor[1] + off[1], anchor[2] + off[2]];
        return (
          <WireTrace
            key={key}
            points={[[anchor[0], anchor[1], anchor[2]], compPos]}
            color="#ffffff"
            visible
          />
        );
      })}

      {/* ═══ AMBIENT FILL LIGHT ══════════════════════════════════════════════ */}
      <pointLight position={[0, 1.5, 0.6]} intensity={0.5} color="#00d4ff" distance={3.5} />
      <pointLight position={[0.5, 2.0, -0.3]} intensity={0.25} color="#1e5fff" distance={2.5} />
    </group>
  );
}
