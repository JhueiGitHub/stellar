import { create } from "zustand";
import { AppDefinition } from "../types/AppTypes";

// Extended AppDefinition to include state
interface AppWithState extends AppDefinition {
  state: Record<string, any>; // Flexible state object for each app
}

interface AppState {
  openApps: AppWithState[];
  activeAppId: string | null;
  openApp: (app: AppDefinition) => void;
  closeApp: (appId: string) => void;
  setActiveApp: (appId: string) => void;
  updateAppState: (appId: string, newState: Record<string, any>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  openApps: [],
  activeAppId: null,

  // Open an app or bring it to focus if already open
  openApp: (app) =>
    set((state) => {
      const existingApp = state.openApps.find(
        (openApp) => openApp.id === app.id
      );
      if (existingApp) {
        return { activeAppId: app.id };
      }
      // Create a new AppWithState object
      const newApp: AppWithState = { ...app, state: {} };
      return {
        openApps: [...state.openApps, newApp],
        activeAppId: app.id,
      };
    }),

  // Close an app
  closeApp: (appId) =>
    set((state) => ({
      openApps: state.openApps.filter((app) => app.id !== appId),
      activeAppId:
        state.openApps.length > 1
          ? state.openApps[state.openApps.length - 2].id
          : null,
    })),

  // Set the active app
  setActiveApp: (appId) => set({ activeAppId: appId }),

  // Update the state of a specific app
  updateAppState: (appId, newState) =>
    set((state) => ({
      openApps: state.openApps.map((app) =>
        app.id === appId
          ? { ...app, state: { ...app.state, ...newState } }
          : app
      ),
    })),
}));
