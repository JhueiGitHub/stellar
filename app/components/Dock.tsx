import { appDefinitions } from "../types/AppTypes";
import { useAppStore } from "../store/appStore";
import { FloatingDock } from "./ui/floating-dock";

const Dock: React.FC = () => {
  const { openApp } = useAppStore();

  const handleAppClick = (app: (typeof appDefinitions)[number]) => {
    openApp(app);
  };

  const dockItems = appDefinitions.map((app) => ({
    title: app.name,
    icon: (
      <button
        onClick={() => handleAppClick(app)}
        className="focus:outline-none"
      >
        <img src={app.icon} alt={app.name} className="w-12 h-12" />
      </button>
    ),
    href: "#",
  }));

  return (
    <FloatingDock
      items={dockItems}
      desktopClassName="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-gray-800 bg-opacity-50 p-2 rounded-lg"
      mobileClassName="fixed bottom-4 right-4"
    />
  );
};

export default Dock;
