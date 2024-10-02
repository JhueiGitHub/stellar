// app/apps/flow/App.tsx
import React, { useState, useEffect } from "react";
import { useFlowStore } from "../../store/flowStore";
import FlowDashboard from "../../components/FlowDashboard";
import FlowEditor from "../../components/FlowEditor";

const FlowApp: React.FC = () => {
  const { activeFlowId } = useFlowStore();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (activeFlowId && !isEditing) {
      setIsEditing(true);
    } else if (!activeFlowId && isEditing) {
      setIsEditing(false);
    }
  }, [activeFlowId, isEditing]);

  return (
    <div className="w-full h-full">
      {isEditing ? <FlowEditor /> : <FlowDashboard />}
    </div>
  );
};

export default FlowApp;
