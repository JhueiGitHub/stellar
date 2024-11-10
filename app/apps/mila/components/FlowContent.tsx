import { useState } from "react";
import { FlowHeader } from "./FlowHeader";
import { FlowGrid } from "./FlowGrid";
import { StreamView } from "./StreamView";
import { EditorView } from "./EditorView";

export const FlowContent = () => {
  const [currentView, setCurrentView] = useState<{
    type: "dashboard" | "stream" | "editor";
    id?: string;
  }>({ type: "dashboard" });

  return (
    <div className="flex-1 min-w-0">
      {currentView.type === "dashboard" && (
        <>
          <FlowHeader title="Flow" subtitle="All Streams" onBack={null} />
          <FlowGrid
            onStreamSelect={(id) => setCurrentView({ type: "stream", id })}
          />
        </>
      )}

      {currentView.type === "stream" && (
        <>
          <FlowHeader
            title={currentView.id || ""}
            subtitle="Flows"
            onBack={() => setCurrentView({ type: "dashboard" })}
          />
          <StreamView
            streamId={currentView.id || ""}
            onFlowSelect={(flowId) =>
              setCurrentView({ type: "editor", id: flowId })
            }
          />
        </>
      )}

      {currentView.type === "editor" && (
        <EditorView
          flowId={currentView.id || ""}
          onClose={() => setCurrentView({ type: "stream", id: "os" })}
        />
      )}
    </div>
  );
};
