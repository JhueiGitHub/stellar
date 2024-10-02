import React, { useEffect, useState } from "react";
import { useFlowStore } from "../store/flowStore";
import { useDesignSystem } from "../contexts/DesignSystemContext";
import { useStyles } from "../hooks/useStyles";
import { debounce } from "lodash";

const FlowEditor: React.FC = () => {
  const { activeFlowId, flows } = useFlowStore();
  const { designSystem, isLoading: isDesignSystemLoading } = useDesignSystem();
  const { getColor, getFont, updateColor, updateFont } = useStyles();
  const [canvasComponents, setCanvasComponents] = useState<any[]>([]);

  useEffect(() => {
    if (activeFlowId && !isDesignSystemLoading) {
      const activeFlow = flows.find((flow) => flow.id === activeFlowId);
      if (activeFlow && designSystem) {
        const designSystemComponents = [
          ...designSystem.colorTokens.map((token) => ({
            id: token.id,
            type: "color",
            name: token.name,
            value: token.value,
            opacity: token.opacity,
          })),
          ...designSystem.typographyTokens.map((token) => ({
            id: token.id,
            type: "typography",
            name: token.name,
            fontFamily: token.fontFamily,
            fontSize: token.fontSize,
            fontWeight: token.fontWeight,
            lineHeight: token.lineHeight,
            letterSpacing: token.letterSpacing,
          })),
        ];
        setCanvasComponents([
          ...activeFlow.components,
          ...designSystemComponents,
        ]);
      }
    }
  }, [activeFlowId, flows, designSystem, isDesignSystemLoading]);

  const handleComponentUpdate = debounce(
    (componentId: string, updates: any) => {
      setCanvasComponents((prevComponents) =>
        prevComponents.map((comp) =>
          comp.id === componentId ? { ...comp, ...updates } : comp
        )
      );

      if (updates.type === "color") {
        updateColor(updates.name, updates.value, updates.opacity);
      } else if (updates.type === "typography") {
        updateFont(updates.name, updates.value);
      }

      // TODO: Update the flow in the database
    },
    300
  );

  if (isDesignSystemLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full bg-gray-100 overflow-auto">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Flow Editor</h2>
        <div className="canvas bg-white border border-gray-300 p-4 min-h-screen grid grid-cols-4 gap-4">
          {canvasComponents.map((component) => (
            <CanvasComponent
              key={component.id}
              component={component}
              getColor={getColor}
              getFont={getFont}
              onUpdate={(updatedComponent) =>
                handleComponentUpdate(component.id, updatedComponent)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface CanvasComponentProps {
  component: any;
  onUpdate: (updates: any) => void;
  getColor: (name: string) => string;
  getFont: (name: string) => string;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  component,
  onUpdate,
  getColor,
  getFont,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ [e.target.name]: e.target.value });
  };

  if (component.type === "color") {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          {component.name}
        </label>
        <input
          type="color"
          name="value"
          value={component.value}
          onChange={handleChange}
          className="mt-1 block w-full"
        />
        <input
          type="number"
          name="opacity"
          value={component.opacity}
          onChange={handleChange}
          min="0"
          max="100"
          className="mt-1 block w-full"
        />
      </div>
    );
  } else if (component.type === "typography") {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          {component.name}
        </label>
        <input
          type="text"
          name="fontFamily"
          value={component.fontFamily}
          onChange={handleChange}
          className="mt-1 block w-full"
        />
      </div>
    );
  }

  return null;
};

export default FlowEditor;
