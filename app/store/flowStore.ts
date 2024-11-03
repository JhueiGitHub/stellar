import { create } from "zustand";
import { Flow, FlowComponent, FlowType } from "@prisma/client";

// Match the schema's JSON structure
interface FlowNodeData {
  type: "wallpaper" | "dockConfig" | "windowConfig";
  value: string;
  opacity?: number;
  config?: Record<string, any>;
  position?: {
    x: number;
    y: number;
  };
}

// Correctly extend Flow type to match Prisma schema
interface ExtendedFlow extends Omit<Flow, "nodes"> {
  components: FlowComponent[];
  nodes: {
    [key: string]: FlowNodeData;
  };
}

interface FlowState {
  flows: ExtendedFlow[];
  activeFlowId: string | null;

  // Core flow actions
  setFlows: (flows: ExtendedFlow[]) => void;
  setActiveFlow: (flowId: string) => void;
  addFlow: (flow: ExtendedFlow) => void;
  updateFlow: (updatedFlow: ExtendedFlow) => void;
  deleteFlow: (flowId: string) => void;

  // Component actions
  addComponent: (flowId: string, component: FlowComponent) => void;
  updateComponent: (flowId: string, updatedComponent: FlowComponent) => void;
  deleteComponent: (flowId: string, componentId: string) => void;

  // App config actions
  openAppConfig: (appId: string) => Promise<void>;
  updateFlowNodes: (
    flowId: string,
    nodes: Record<string, FlowNodeData>
  ) => Promise<void>;
}

export const useFlowStore = create<FlowState>((set) => ({
  flows: [],
  activeFlowId: null,

  setFlows: (flows) => set({ flows }),
  setActiveFlow: (flowId) => set({ activeFlowId: flowId }),

  addFlow: (flow) =>
    set((state) => ({
      flows: [...state.flows, flow],
    })),

  updateFlow: (updatedFlow) =>
    set((state) => ({
      flows: state.flows.map((flow) =>
        flow.id === updatedFlow.id ? updatedFlow : flow
      ),
    })),

  deleteFlow: (flowId) =>
    set((state) => ({
      flows: state.flows.filter((flow) => flow.id !== flowId),
      activeFlowId: state.activeFlowId === flowId ? null : state.activeFlowId,
    })),

  addComponent: (flowId, component) =>
    set((state) => ({
      flows: state.flows.map((flow) =>
        flow.id === flowId
          ? { ...flow, components: [...flow.components, component] }
          : flow
      ),
    })),

  updateComponent: (flowId, updatedComponent) =>
    set((state) => ({
      flows: state.flows.map((flow) =>
        flow.id === flowId
          ? {
              ...flow,
              components: flow.components.map((comp) =>
                comp.id === updatedComponent.id ? updatedComponent : comp
              ),
            }
          : flow
      ),
    })),

  deleteComponent: (flowId, componentId) =>
    set((state) => ({
      flows: state.flows.map((flow) =>
        flow.id === flowId
          ? {
              ...flow,
              components: flow.components.filter(
                (comp) => comp.id !== componentId
              ),
            }
          : flow
      ),
    })),

  openAppConfig: async (appId) => {
    try {
      const response = await fetch(`/api/flows/app-config/${appId}`);
      if (!response.ok) throw new Error("Failed to fetch app config");

      const configFlow: ExtendedFlow = await response.json();

      set((state) => ({
        flows: [...state.flows, configFlow],
        activeFlowId: configFlow.id,
      }));
    } catch (error) {
      console.error("Error opening app config:", error);
      throw error;
    }
  },

  updateFlowNodes: async (flowId, nodes) => {
    try {
      const response = await fetch(`/api/flows/${flowId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes }),
      });

      if (!response.ok) throw new Error("Failed to update flow nodes");

      set((state) => ({
        flows: state.flows.map((flow) =>
          flow.id === flowId ? { ...flow, nodes } : flow
        ),
      }));
    } catch (error) {
      console.error("Error updating flow nodes:", error);
      throw error;
    }
  },
}));

// API Utility Functions
export async function fetchFlows() {
  try {
    const response = await fetch("/api/flows");
    if (!response.ok) throw new Error("Failed to fetch flows");

    const flows: ExtendedFlow[] = await response.json();
    useFlowStore.getState().setFlows(flows);
    return flows;
  } catch (error) {
    console.error("Error fetching flows:", error);
    return null;
  }
}

export async function createFlow(
  name: string,
  streamId: string,
  type: FlowType
) {
  try {
    const response = await fetch("/api/flows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        streamId,
        type,
        nodes:
          type === "APP_CONFIG"
            ? {
                wallpaper: {
                  type: "color",
                  value: "#000000",
                  opacity: 100,
                  position: { x: 100, y: 100 },
                },
              }
            : {},
      }),
    });

    if (!response.ok) throw new Error("Failed to create flow");

    const newFlow: ExtendedFlow = await response.json();
    useFlowStore.getState().addFlow(newFlow);
    return newFlow;
  } catch (error) {
    console.error("Error creating flow:", error);
    return null;
  }
}
