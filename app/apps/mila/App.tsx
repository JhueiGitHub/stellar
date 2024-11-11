import React from "react";
import { useFlowStore } from "../../store/flowStore";
import FlowDashboard from "../../components/FlowDashboard";
import FlowEditor from "../../components/FlowEditor";
import { useStyles } from "../../hooks/useStyles";

const FlowApp: React.FC = () => {
  const { activeFlowId } = useFlowStore();
  const { getColor } = useStyles();

  return (
    <div
      className="w-full h-full"
      style={{ backgroundColor: getColor("Underlying BG") }}
    >
      {activeFlowId ? <FlowEditor /> : <FlowDashboard />}
    </div>
  );
};

export default FlowApp;
