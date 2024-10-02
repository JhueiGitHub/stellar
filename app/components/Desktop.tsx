"use client";

import { useAppStore } from "../store/appStore";
import Dock from "./Dock";
import Window from "./Window";

const Desktop: React.FC = () => {
  const { openApps, activeAppId } = useAppStore();

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900">
      {openApps.map((app) => (
        <Window key={app.id} app={app} isActive={app.id === activeAppId} />
      ))}
      <Dock />
    </div>
  );
};

export default Desktop;
