// components/FlowDashboard.tsx
import { FlowSidebar } from "./FlowSidebar";
import { FlowContent } from "./FlowContent";

export const FlowDashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#010203] bg-opacity-75">
      <FlowSidebar />
      <FlowContent />
    </div>
  );
};

export default FlowDashboard;
