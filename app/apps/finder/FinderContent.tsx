import React from "react";
import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";
import { useAppStore } from "@/app/store/appStore";

const FinderContent: React.FC = () => {
  const { updateAppState } = useAppStore();

  const handleContentChange = () => {
    updateAppState("finder", { lastModified: Date.now() });
  };

  return (
    <div className="flex h-full">
      <Sidebar />
      <ContentArea onItemSelect={handleContentChange} />
    </div>
  );
};

export default FinderContent;
