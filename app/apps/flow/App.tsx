// app/apps/flow/App.tsx
"use client";

import React from "react";
import { useFlowStore } from "@/app/store/flowStore";
import { FlowDashboard } from "./components/FlowDashboard";
import { EditorView } from "./components/EditorView";

const App: React.FC = () => {
  const { activeFlowId, setActiveFlow } = useFlowStore();

  // Only render EditorView if we have an activeFlowId
  return (
    <div className="w-full h-full" style={{ backgroundColor: "#010203" }}>
      {activeFlowId ? (
        <EditorView flowId={activeFlowId} onClose={() => setActiveFlow(null)} />
      ) : (
        <FlowDashboard />
      )}
    </div>
  );
};

export default App;
