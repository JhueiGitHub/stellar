// components/FlowDashboard.tsx
import { FlowSidebar } from "./FlowSidebar";
import { FlowContent } from "./FlowContent";

export const FlowDashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <FlowSidebar />
      <FlowContent />
    </div>
  );
};

export default FlowDashboard;
