// components/Dock.tsx
import { appDefinitions } from "../types/AppTypes";
import { useAppStore } from "../store/appStore";
import { FloatingDock } from "./ui/floating-dock";
import { useStyles } from "../hooks/useStyles";

const Dock: React.FC = () => {
  const { openApp } = useAppStore();
  const { getColor } = useStyles();

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
        {/* Replace image with a placeholder div */}
        <div
          className="w-8 h-8 rounded-md"
          style={{ backgroundColor: getColor("Overlaying BG") }}
        />
      </button>
    ),
    href: "#",
  }));

  return (
    <FloatingDock
      items={dockItems}
      desktopClassName="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 p-2 rounded-lg"
      mobileClassName="fixed bottom-4 right-4"
      backgroundColor={getColor("Black")}
      borderColor={getColor("Brd")}
    />
  );
};

export default Dock;
