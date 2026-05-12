import Hero from "../components/Hero";
import FeatureCards from "../components/FeatureCards";
import DashboardPreview from "../components/DashboardPreview";
import TechStack from "../components/TechStack";
import Workflow from "../components/Workflow";
import Collaboration from "../components/Collaboration";
import FutureEnhancements from "../components/FutureEnhancements";

export default function Landing() {
  return (
    <div className="w-full">
      <Hero />
      <FeatureCards />
      <DashboardPreview />
      <Workflow />
      <Collaboration />
      <TechStack />
      <FutureEnhancements />
    </div>
  );
}
