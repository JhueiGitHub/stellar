import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { AppDefinition } from "../types/AppTypes";
import { useAppStore } from "../store/appStore";
import { useStyles } from "../hooks/useStyles";
import { useDebounceCallback } from "../hooks/useDebounce";
import SaveIndicator from "./SaveIndicator";

interface WindowProps {
  app: AppDefinition;
  isActive: boolean;
}

// Define a type for the dynamically loaded component props
interface DynamicAppProps {}

const Window: React.FC<WindowProps> = ({ app, isActive }) => {
  const { closeApp, setActiveApp, updateAppState } = useAppStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const { getColor } = useStyles();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );

  // Update the dynamic import to use the DynamicAppProps
  const AppComponent = dynamic<DynamicAppProps>(
    () => import(`../apps/${app.id}/page`),
    {
      loading: () => <p>Loading...</p>,
    }
  );

  const handleClose = () => closeApp(app.id);
  const handleMinimize = () => setIsMinimized(true);
  const handleMaximize = () => setIsMinimized(false);

  const [debouncedSave, cancelDebounce] = useDebounceCallback(() => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 1000);
    }, 500);
  }, 3000);

  const handleContentChange = useCallback(() => {
    setSaveStatus("saving");
    debouncedSave();
  }, [debouncedSave]);

  useEffect(() => {
    const checkStateChanges = (
      state: ReturnType<typeof useAppStore.getState>
    ) => {
      const appState = state.openApps.find(
        (openApp) => openApp.id === app.id
      )?.state;
      if (appState) {
        handleContentChange();
      }
    };

    const unsubscribe = useAppStore.subscribe(checkStateChanges);
    return () => {
      unsubscribe();
    };
  }, [app.id, handleContentChange]);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: isMinimized ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        zIndex: isActive ? 10 : 1,
        backgroundColor: getColor("Glass"),
        border: `1px solid ${getColor("Brd")}`,
      }}
      className="absolute top-10 left-10 w-3/4 h-3/4 rounded-lg shadow-lg overflow-hidden"
    >
      <div
        className="p-2 flex justify-between items-center"
        style={{ backgroundColor: getColor("Glass") }}
        onClick={() => setActiveApp(app.id)}
      >
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
        <h2
          className="text-sm font-medium"
          style={{ color: getColor("Text Primary (Hd)") }}
        >
          {app.name}
        </h2>
        <SaveIndicator status={saveStatus} />
      </div>
      <div className="h-full overflow-auto">
        <AppComponent />
      </div>
    </motion.div>
  );
};

export default Window;
