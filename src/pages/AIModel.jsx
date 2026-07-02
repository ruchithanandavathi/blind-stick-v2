import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";

const PIPELINE = [
  { step: "Dataset", detail: "Curated and labeled images covering humans, vehicles, doors, stairs, poles, traffic signals, and other everyday obstacles relevant to navigation." },
  { step: "Training", detail: "The labeled dataset is used to train a YOLO (You Only Look Once) object detection model, tuned for the specific object classes the stick needs to recognize." },
  { step: "Python + OpenCV", detail: "Training and inference pipelines are built in Python, using OpenCV for image preprocessing, frame handling, and drawing bounding boxes during development." },
  { step: "Export", detail: "The trained model is exported into a lightweight format suitable for edge deployment, balancing accuracy against the limited compute of a Raspberry Pi." },
  { step: "Deploy to Raspberry Pi", detail: "The exported model is loaded directly onto the Raspberry Pi, running entirely on-device without requiring an internet connection for core detection." },
  { step: "Inference", detail: "Live camera frames are passed through the model in real time, producing bounding boxes, class labels, and confidence scores several times per second." },
  { step: "Voice Output", detail: "Each meaningful detection is converted into a short spoken alert — object, direction, and approximate distance — and played through the speaker." },
];

export default function AIModel() {
  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="AI Model"
        title="From Dataset to Spoken Alert"
        subtitle="How a trained YOLO model goes from raw images to real-time voice guidance, running entirely on the Raspberry Pi."
      />

      <div className="max-w-3xl mx-auto px-6 pb-28">
        <div className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-px trace-line" />
          <div className="flex flex-col gap-8">
            {PIPELINE.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="flex gap-5 relative"
              >
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-cyanGlow font-mono text-xs shrink-0 z-10 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
                  {i + 1}
                </div>
                <div className="glass rounded-xl p-5 flex-1">
                  <div className="font-display font-semibold mb-1.5">{p.step}</div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{p.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
