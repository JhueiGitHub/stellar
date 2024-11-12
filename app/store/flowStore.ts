// app/store/flowStore.ts
import { create } from "zustand";

interface Flow {
  id: string;
  name: string;
  description?: string;
  profileId: string;
  designSystemId: string;
  components: any[];
  designSystem: {
    colorTokens: any[];
    typographyTokens: any[];
  };
  createdAt: Date;
  updatedAt: Date;
}

interface FlowState {
  flows: Flow[];
  activeFlowId: string | null;
  currentStream: string | null;
  setFlows: (flows: Flow[]) => void;
  setActiveFlow: (flowId: string | null) => void; // Updated to accept null
  setCurrentStream: (streamId: string) => void;
  fetchFlows: () => Promise<void>;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  flows: [],
  activeFlowId: null,
  currentStream: null,

  setFlows: (flows) => set({ flows }),
  setActiveFlow: (flowId) => set({ activeFlowId: flowId }),
  setCurrentStream: (streamId) => set({ currentStream: streamId }),

  fetchFlows: async () => {
    try {
      const response = await fetch("/api/flows");
      const data = await response.json();
      set({ flows: data.flows });
    } catch (error) {
      console.error("Failed to fetch flows:", error);
    }
  },
}));
