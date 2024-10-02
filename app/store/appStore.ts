import { create } from 'zustand'
import { AppDefinition } from '../types/AppTypes'

interface AppState {
  openApps: AppDefinition[];
  activeAppId: string | null;
  openApp: (app: AppDefinition) => void;
  closeApp: (appId: string) => void;
  setActiveApp: (appId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  openApps: [],
  activeAppId: null,
  openApp: (app) => set((state) => {
    if (state.openApps.some(openApp => openApp.id === app.id)) {
      return { activeAppId: app.id };
    }
    return { 
      openApps: [...state.openApps, app],
      activeAppId: app.id
    };
  }),
  closeApp: (appId) => set((state) => ({
    openApps: state.openApps.filter(app => app.id !== appId),
    activeAppId: state.openApps.length > 1 ? state.openApps[state.openApps.length - 2].id : null
  })),
  setActiveApp: (appId) => set({ activeAppId: appId }),
}));