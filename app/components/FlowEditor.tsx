import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useFlowStore } from "../store/flowStore";
import { useDesignSystem } from "../contexts/DesignSystemContext";
import { useStyles } from "../hooks/useStyles";
import { debounce } from "lodash";
import { ChromePicker, ColorResult } from "react-color";

// Memoize CanvasComponent to prevent unnecessary re-renders
const MemoizedCanvasComponent = React.memo(CanvasComponent);

const FlowEditor: React.FC = () => {
  const { activeFlowId, flows } = useFlowStore();
  const {
    designSystem,
    isLoading: isDesignSystemLoading,
    updateDesignSystem,
  } = useDesignSystem();
  const { getColor, getFont } = useStyles();
  const [canvasComponents, setCanvasComponents] = useState<any[]>([]);

  // Effect to load canvas components when activeFlowId or designSystem changes
  useEffect(() => {
    if (activeFlowId && !isDesignSystemLoading && designSystem) {
      const activeFlow = flows.find((flow) => flow.id === activeFlowId);
      if (activeFlow) {
        const flowComponents = activeFlow.components.map((component) => ({
          ...component,
          isFlowComponent: true,
        }));
        const designSystemComponents = [
          ...designSystem.colorTokens.map((token) => ({
            id: token.id,
            type: "color",
            name: token.name,
            value: token.value,
            opacity: token.opacity,
            isDesignSystemComponent: true,
          })),
          ...designSystem.typographyTokens.map((token) => ({
            id: token.id,
            type: "typography",
            name: token.name,
            fontFamily: token.fontFamily,
            isDesignSystemComponent: true,
          })),
        ];
        setCanvasComponents([...flowComponents, ...designSystemComponents]);
      }
    }
  }, [activeFlowId, flows, designSystem, isDesignSystemLoading]);

  // Debounced function to update design system
  const debouncedUpdateDesignSystem = useMemo(
    () =>
      debounce(async (updates: any) => {
        if (!designSystem) return;
        try {
          const updatedDesignSystem = {
            ...designSystem,
            colorTokens: designSystem.colorTokens.map((token) =>
              updates[token.id] ? { ...token, ...updates[token.id] } : token
            ),
            typographyTokens: designSystem.typographyTokens.map((token) =>
              updates[token.id] ? { ...token, ...updates[token.id] } : token
            ),
          };
          await updateDesignSystem(updatedDesignSystem);
        } catch (error) {
          console.error("Failed to update design system:", error);
        }
      }, 1000),
    [designSystem, updateDesignSystem]
  );

  // Memoized function to handle component updates
  const handleComponentUpdate = useCallback(
    (componentId: string, updates: any) => {
      setCanvasComponents((prevComponents) =>
        prevComponents.map((comp) =>
          comp.id === componentId ? { ...comp, ...updates } : comp
        )
      );

      if (
        updates.value !== undefined ||
        updates.opacity !== undefined ||
        updates.fontFamily !== undefined
      ) {
        debouncedUpdateDesignSystem({ [componentId]: updates });
      }
    },
    [debouncedUpdateDesignSystem]
  );

  // Memoized function to create stable onUpdate references for each component
  const memoizedOnUpdate = useCallback(
    (componentId: string) => (updates: any) =>
      handleComponentUpdate(componentId, updates),
    [handleComponentUpdate]
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
            <MemoizedCanvasComponent
              key={component.id}
              component={component}
              getColor={getColor}
              getFont={getFont}
              onUpdate={memoizedOnUpdate(component.id)}
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

function CanvasComponent({
  component,
  onUpdate,
  getColor,
  getFont,
}: CanvasComponentProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleColorChange = useCallback(
    (color: ColorResult) => {
      onUpdate({
        value: color.hex,
        opacity: Math.round((color.rgb.a ?? 1) * 100),
      });
    },
    [onUpdate]
  );

  const handleTypographyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ [e.target.name]: e.target.value });
    },
    [onUpdate]
  );

  const togglePicker = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPicker((prev) => !prev);
  }, []);

  if (component.type === "color") {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          {component.name}
        </label>
        <div
          className="w-full h-10 rounded cursor-pointer"
          style={{
            backgroundColor: component.value,
            opacity: component.opacity / 100,
          }}
          onClick={togglePicker}
        />
        {showPicker && (
          <div className="absolute z-10">
            <ChromePicker
              color={component.value}
              onChange={handleColorChange}
              onChangeComplete={() => setShowPicker(false)}
            />
          </div>
        )}
        <p className="mt-2 text-xs">
          {component.value} - Opacity: {component.opacity}%
        </p>
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
          onChange={handleTypographyChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
        />
      </div>
    );
  }

  return null;
}

export default React.memo(FlowEditor);
