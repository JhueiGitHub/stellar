import React, { useEffect, useState } from "react";
import { useFlowStore } from "../store/flowStore";
import { useDesignSystem } from "../contexts/DesignSystemContext";
import { useStyles } from "../hooks/useStyles";
import { debounce } from "lodash";

const FlowEditor: React.FC = () => {
  const { activeFlowId, flows } = useFlowStore();
  const { designSystem, isLoading: isDesignSystemLoading, updateDesignSystem } = useDesignSystem();
  const { getColor, getFont, updateColor, updateFont } = useStyles();
  const [canvasComponents, setCanvasComponents] = useState<any[]>([]);

  useEffect(() => {
    if (activeFlowId && !isDesignSystemLoading && designSystem) {
      const activeFlow = flows.find((flow) => flow.id === activeFlowId);
      if (activeFlow) {
        const flowComponents = activeFlow.components.map(component => ({
          ...component,
          isFlowComponent: true
        }));
        const designSystemComponents = [
          ...designSystem.colorTokens.map((token) => ({
            id: token.id,
            type: "color",
            name: token.name,
            value: token.value,
            opacity: token.opacity,
            isDesignSystemComponent: true
          })),
          ...designSystem.typographyTokens.map((token) => ({
            id: token.id,
            type: "typography",
            name: token.name,
            fontFamily: token.fontFamily,
            isDesignSystemComponent: true
          })),
        ];
        setCanvasComponents([...flowComponents, ...designSystemComponents]);
      }
    }
  }, [activeFlowId, flows, designSystem, isDesignSystemLoading]);

  const handleComponentUpdate = debounce(async (componentId: string, updates: any) => {
    if (!designSystem || !activeFlowId) return;

    const updatedComponents = canvasComponents.map(comp =>
      comp.id === componentId ? { ...comp, ...updates } : comp
    );

    setCanvasComponents(updatedComponents);

    try {
      const flowComponents = updatedComponents.filter(comp => comp.isFlowComponent);
      const response = await fetch(`/api/flows/${activeFlowId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ components: flowComponents }),
      });

      if (!response.ok) {
        throw new Error('Failed to update flow');
      }

      const updatedFlow = await response.json();
      useFlowStore.getState().updateFlow(updatedFlow);

      // Update design system if the updated component is a design system component
      const updatedComponent = updatedComponents.find(comp => comp.id === componentId);
      if (updatedComponent && updatedComponent.isDesignSystemComponent) {
        if (updatedComponent.type === 'color') {
          await updateColor(updatedComponent.name, updatedComponent.value, updatedComponent.opacity);
        } else if (updatedComponent.type === 'typography') {
          await updateFont(updatedComponent.name, updatedComponent.fontFamily);
        }
      }

    } catch (error) {
      console.error("Failed to update flow:", error);
      // Revert the change in the local state if the API call fails
      setCanvasComponents(prevComponents => prevComponents.map(comp =>
        comp.id === componentId ? { ...comp, ...designSystem.colorTokens.find(token => token.id === componentId) } : comp
      ));
    }
  }, 300);

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