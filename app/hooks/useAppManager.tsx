import { AppDefinition, appDefinitions } from ".././types/AppTypes";
import { useAppStore } from "../store/appStore";

export const useAppManager = () => {
  const { openApps, activeAppId, openApp, closeApp, setActiveApp } =
    useAppStore();

  const handleOpenApp = (appId: string) => {
    const appToOpen = appDefinitions.find((app) => app.id === appId);
    if (appToOpen) {
      openApp(appToOpen);
    }
  };

  const handleCloseApp = (appId: string) => {
    closeApp(appId);
  };

  const handleSetActiveApp = (appId: string) => {
    setActiveApp(appId);
  };

  return {
    openApps,
    activeAppId,
    openApp: handleOpenApp,
    closeApp: handleCloseApp,
    setActiveApp: handleSetActiveApp,
  };
};
