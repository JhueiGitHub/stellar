import React from "react";
import { useStyles } from "@/app/hooks/useStyles";

const StatusBar: React.FC = () => {
  const { getColor, getFont } = useStyles();

  return (
    <div
      className="h-8 flex items-center px-4"
      style={{
        backgroundColor: getColor("Overlaying BG"),
        borderTop: `1px solid ${getColor("Brd")}`,
        color: getColor("Text Primary (Hd)"),
        fontFamily: getFont("Text Primary"),
      }}
    >
      <span>3 items, 150 MB available</span>
    </div>
  );
};

export default StatusBar;
