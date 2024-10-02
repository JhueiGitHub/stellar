// app/components/FlowDashboard.tsx
import React, { useEffect, useState } from "react";
import { useFlowStore, fetchFlows } from "../store/flowStore";
import { useAppStore } from "../store/appStore";

const FlowDashboard: React.FC = () => {
  const { flows, setFlows, setActiveFlow } = useFlowStore();
  const { openApp, openApps } = useAppStore(); // Add openApps here
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFlows = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedFlows = await fetchFlows();
        if (fetchedFlows) {
          setFlows(fetchedFlows);
        }
      } catch (err) {
        setError("Failed to fetch flows");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadFlows();
  }, [setFlows]);

  const handleFlowClick = (flowId: string) => {
    setActiveFlow(flowId);

    // Only open the app if it's not already open
    if (!openApps.some((app) => app.id === "flow")) {
      openApp({
        id: "flow",
        name: "Flow",
        icon: "flow-icon",
        dockPosition: 1,
        animationType: "magnify",
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Flow Dashboard</h2>

      {/* Debug Panel */}
      <div className="bg-gray-100 p-4 mb-4 rounded">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <p>Is Loading: {isLoading ? "Yes" : "No"}</p>
        <p>Error: {error || "None"}</p>
        <p>Number of Flows: {flows.length}</p>
      </div>

      {isLoading ? (
        <p>Loading flows...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : flows.length === 0 ? (
        <p>No flows available. Create a new flow to get started.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {flows.map((flow) => (
            <div
              key={flow.id}
              className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleFlowClick(flow.id)}
            >
              <h3 className="text-lg font-semibold">{flow.name}</h3>
              <p className="text-sm text-gray-600">{flow.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlowDashboard;
