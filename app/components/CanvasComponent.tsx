// app/components/CanvasComponent.tsx
import React from "react";

interface CanvasComponentProps {
  component: any;
  onUpdate: (componentId: string, updates: any) => void;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  component,
  onUpdate,
}) => {
  if (component.type === "color") {
    return (
      <div className="border rounded p-2">
        <div
          className="w-full h-20 rounded"
          style={{
            backgroundColor: component.value,
            opacity: component.opacity / 100,
          }}
        ></div>
        <p className="mt-2 text-sm font-semibold">{component.name}</p>
        <p className="text-xs">{component.value}</p>
      </div>
    );
  } else if (component.type === "typography") {
    return (
      <div className="border rounded p-2">
        <p
          style={{
            fontFamily: component.fontFamily,
            fontSize: component.fontSize,
            fontWeight: component.fontWeight,
            lineHeight: component.lineHeight,
            letterSpacing: component.letterSpacing,
          }}
        >
          {component.name}
        </p>
        <p className="text-xs mt-2">{component.fontFamily}</p>
      </div>
    );
  }

  return null;
};

export default CanvasComponent;
