"use client";

import React from "react";
import { Profile, DesignSystem } from "@prisma/client";
import { useAppStore } from "../store/appStore";
import Window from "./Window";
import Dock from "./Dock";

interface DesktopProps {
  profile: Profile;
  designSystem: DesignSystem & {
    colorTokens: { id: string; name: string; value: string }[];
    typographyTokens: {
      id: string;
      name: string;
      fontFamily: string;
      fontSize: string;
      fontWeight: string;
      lineHeight: string;
      letterSpacing: string;
    }[];
  };
}

const Desktop: React.FC<DesktopProps> = ({ profile, designSystem }) => {
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
