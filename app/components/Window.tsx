"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { AppDefinition } from "../types/AppTypes";
import { useAppStore } from "../store/appStore";

interface WindowProps {
  app: AppDefinition;
  isActive: boolean;
}

const Window: React.FC<WindowProps> = ({ app, isActive }) => {
  const { closeApp, setActiveApp } = useAppStore();
  const [isMinimized, setIsMinimized] = useState(false);

  const AppComponent = dynamic(() => import(`../apps/${app.id}/App`), {
    loading: () => <p>Loading...</p>,
  });

  const handleClose = () => closeApp(app.id);
  const handleMinimize = () => setIsMinimized(true);
  const handleMaximize = () => setIsMinimized(false);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: isMinimized ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ zIndex: isActive ? 10 : 1 }}
      className="absolute top-10 left-10 w-3/4 h-3/4 bg-white rounded-lg shadow-lg overflow-hidden"
      onClick={() => setActiveApp(app.id)}
    >
      <div className="bg-gray-200 p-2 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={handleClose}
            className="w-3 h-3 rounded-full bg-red-500"
          />
          <button
            onClick={handleMinimize}
            className="w-3 h-3 rounded-full bg-yellow-500"
          />
          <button
            onClick={handleMaximize}
            className="w-3 h-3 rounded-full bg-green-500"
          />
        </div>
        <h2 className="text-sm font-medium">{app.name}</h2>
      </div>
      <div className="p-4 h-full overflow-auto">
        <AppComponent />
      </div>
    </motion.div>
  );
};

export default Window;
