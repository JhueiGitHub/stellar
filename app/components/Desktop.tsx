// components/Desktop.tsx
"use client";

import React from "react";
import { useAppStore } from "../store/appStore";
import Window from "./Window";
import Dock from "./Dock";
import { useStyles } from "../hooks/useStyles";

const Desktop: React.FC = () => {
  const { openApps, activeAppId } = useAppStore();
  const { getColor, getFont, isLoading } = useStyles();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <video
        src="/media/siamese.mp4"
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="relative z-10 h-full"
        style={{
          color: getColor("Text Primary (Hd)"),
          fontFamily: getFont("Text Primary"),
        }}
      >
        {openApps.map((app) => (
          <Window key={app.id} app={app} isActive={app.id === activeAppId} />
        ))}
        <Dock />
      </div>
    </div>
  );
};

export default Desktop;
