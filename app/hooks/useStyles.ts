// hooks/useStyles.ts
import { useDesignSystem } from "../contexts/DesignSystemContext";

export const useStyles = () => {
  const { designSystem, isLoading } = useDesignSystem();

  if (isLoading) {
    return {
      getColor: () => "",
      getFont: () => "",
      isLoading,
    };
  }

  if (!designSystem) {
    console.error("Design system not loaded");
    return {
      getColor: () => "",
      getFont: () => "",
      isLoading,
    };
  }

  const getColor = (name: string) => {
    const token = designSystem.colorTokens.find((t) => t.name === name);
    return token
      ? `rgba(${hexToRgb(token.value)}, ${token.opacity / 100})`
      : "";
  };

  const getFont = (name: string) => {
    const token = designSystem.typographyTokens.find((t) => t.name === name);
    return token?.fontFamily || "";
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
          result[3],
          16
        )}`
      : null;
  };

  return { getColor, getFont, isLoading };
};
