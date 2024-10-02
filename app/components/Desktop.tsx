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
    return <div>Loading...</div>; // Or any loading indicator
  }

  return (
    <div
      className="h-screen w-screen overflow-hidden"
      style={{
        backgroundColor: getColor("Black"),
        color: getColor("Text Primary (Hd)"),
        fontFamily: getFont("Text Primary"),
      }}
    >
      {openApps.map((app) => (
        <Window key={app.id} app={app} isActive={app.id === activeAppId} />
      ))}
      <Dock />
    </div>
  );
};

export default Desktop;
