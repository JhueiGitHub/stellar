// contexts/DesignSystemContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DesignSystem, ColorToken, TypographyToken } from "@prisma/client";

interface DesignSystemContextType {
  designSystem:
    | (DesignSystem & {
        colorTokens: ColorToken[];
        typographyTokens: TypographyToken[];
      })
    | null;
  setDesignSystem: React.Dispatch<
    React.SetStateAction<DesignSystemContextType["designSystem"]>
  >;
  updateDesignSystem: (
    updatedSystem: DesignSystemContextType["designSystem"]
  ) => Promise<void>;
  isLoading: boolean;
}

export const DesignSystemContext = createContext<
  DesignSystemContextType | undefined
>(undefined);

export const DesignSystemProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [designSystem, setDesignSystem] =
    useState<DesignSystemContextType["designSystem"]>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDesignSystem();
  }, []);

  const fetchDesignSystem = async () => {
    try {
      const response = await fetch("/api/design-system");
      const data = await response.json();
      setDesignSystem(data);
    } catch (error) {
      console.error("Failed to fetch design system:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDesignSystem = async (
    updatedSystem: DesignSystemContextType["designSystem"]
  ) => {
    if (!updatedSystem) return;
    setDesignSystem(updatedSystem);
    try {
      await fetch("/api/design-system", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSystem),
      });
    } catch (error) {
      console.error("Failed to update design system:", error);
      // Optionally, revert the local state if the update fails
      await fetchDesignSystem();
    }
  };

  return (
    <DesignSystemContext.Provider
      value={{ designSystem, setDesignSystem, updateDesignSystem, isLoading }}
    >
      {children}
    </DesignSystemContext.Provider>
  );
};

export const useDesignSystem = () => {
  const context = useContext(DesignSystemContext);
  if (context === undefined) {
    throw new Error(
      "useDesignSystem must be used within a DesignSystemProvider"
    );
  }
  return context;
};
