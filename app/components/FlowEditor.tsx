// app/components/FlowEditor.tsx
import React, { useEffect, useState } from "react";
import { useFlowStore } from "../store/flowStore";
import { useStyles } from "../hooks/useStyles";
import { debounce } from "lodash";

const FlowEditor: React.FC = () => {
  const { activeFlowId, flows } = useFlowStore();
  const { getColor, getFont, updateColor, updateFont } = useStyles();
  const [canvasComponents, setCanvasComponents] = useState<any[]>([]);

  useEffect(() => {
    if (activeFlowId) {
      const activeFlow = flows.find((flow) => flow.id === activeFlowId);
      if (activeFlow) {
        // Load components from the active flow
        setCanvasComponents(activeFlow.components);
      }
    }
  }, [activeFlowId, flows]);

  const handleComponentUpdate = debounce(
    (componentId: string, updates: any) => {
      // Update the component in the canvas
      setCanvasComponents((prevComponents) =>
        prevComponents.map((comp) =>
          comp.id === componentId ? { ...comp, ...updates } : comp
        )
      );

      // Update the design system
      if (updates.type === "color") {
        updateColor(updates.name, updates.value, updates.opacity);
      } else if (updates.type === "typography") {
        updateFont(updates.name, updates.value);
      }

      // Here you would also update the flow in the database
      // This is left as a TODO for brevity
    },
    300
  );

  return (
    <div className="w-full h-full bg-gray-100 overflow-auto">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Flow Editor</h2>
        <div className="canvas bg-white border border-gray-300 p-4 min-h-screen">
          {canvasComponents.map((component) => (
            <CanvasComponent
              key={component.id}
              component={component}
              onUpdate={handleComponentUpdate}
              getColor={getColor}
              getFont={getFont}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface CanvasComponentProps {
  component: any;
  onUpdate: (id: string, updates: any) => void;
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
    onUpdate(component.id, { [e.target.name]: e.target.value });
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
          value={getColor(component.name)}
          onChange={handleChange}
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
          name="value"
          value={getFont(component.name)}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
    );
  }

  return null;
};

export default FlowEditor;
