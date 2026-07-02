import { useRef } from "react";
import Hero from "../components/Hero";
import Explorer from "../components/Explorer";
import ObjectDetection from "../components/ObjectDetection";
import AIAssistant from "../components/AIAssistant";
import GPSNavigation from "../components/GPSNavigation";
import EmergencySOS from "../components/EmergencySOS";
import SystemArchitecture from "../components/SystemArchitecture";
import PinDiagram from "../components/PinDiagram";
import Workflow from "../components/Workflow";
import Features from "../components/Features";
import Final from "../components/Final";

export default function Home() {
  const explorerRef = useRef(null);
  const scrollToExplorer = () => explorerRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <Hero onComponents={scrollToExplorer} />
      <div ref={explorerRef}><Explorer id="explorer" /></div>
      <ObjectDetection />
      <AIAssistant />
      <GPSNavigation />
      <EmergencySOS />
      <SystemArchitecture />
      <PinDiagram />
      <Workflow />
      <Features />
      <Final />
    </>
  );
}
