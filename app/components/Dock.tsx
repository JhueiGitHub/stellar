import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { appDefinitions } from "../types/AppTypes";
import { useAppStore } from "../store/appStore";
import { FloatingDock } from "./ui/floating-dock";
import { useStyles } from "../hooks/useStyles";

const DOCK_HEIGHT = 70; // Adjust this value based on your dock's height
const TRIGGER_AREA_HEIGHT = 60; // Height of the area that triggers the dock to appear
const DOCK_BOTTOM_MARGIN = 9; // Distance from the bottom edge of the screen

const Dock: React.FC = () => {
  const { openApp } = useAppStore();
  const { getColor } = useStyles();
  const [isDockVisible, setIsDockVisible] = useState(false);

  const handleAppClick = (app: (typeof appDefinitions)[number]) => {
    openApp(app);
  };

  const dockItems = appDefinitions.map((app) => ({
    title: app.name,
    icon: (
      <button
        onClick={() => handleAppClick(app)}
        className="focus:outline-none w-12 h-12 flex items-center justify-center"
        style={{ backgroundColor: getColor("Overlaying BG") }}
      >
        <div
          className="w-8 h-8 rounded-md"
          style={{ backgroundColor: getColor("Overlaying BG") }}
        />
      </button>
    ),
    href: "#",
  }));

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientY } = e;
    const windowHeight = window.innerHeight;
    const shouldShowDock =
      clientY > windowHeight - DOCK_HEIGHT - TRIGGER_AREA_HEIGHT;
    setIsDockVisible(shouldShowDock);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <>
      {/* Invisible trigger area */}
      <div
        className="fixed bottom-0 left-0 right-0"
        style={{ height: TRIGGER_AREA_HEIGHT }}
      />
      {/* Grid container for centering */}
      <div className="fixed inset-x-0 bottom-0 grid place-items-center pointer-events-none">
        <AnimatePresence>
          {isDockVisible && (
            <motion.div
              initial={{ y: DOCK_HEIGHT, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: DOCK_HEIGHT, scale: 0.95, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
              className="flex justify-center items-end pointer-events-auto"
              style={{
                width: "fit-content",
                marginBottom: `${DOCK_BOTTOM_MARGIN}px`,
              }}
            >
              <FloatingDock
                items={dockItems}
                backgroundColor={getColor("Black")}
                borderColor={getColor("Brd")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Dock;
