import React from "react";
import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";

const FinderContent: React.FC = () => {
  return (
    <div className="flex h-full">
      <Sidebar />
      <ContentArea />
    </div>
  );
};

export default FinderContent;
