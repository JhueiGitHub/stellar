// lib/create-zenith-design-system.ts

import { db } from "@/lib/db";

export const createZenithDesignSystem = async (profileId: string) => {
  const zenithDesignSystem = await db.designSystem.create({
    data: {
      name: "Zenith",
      profileId,
      colorTokens: {
        createMany: {
          data: [
            { name: "Underlying BG", value: "#292929", opacity: 81 },
            { name: "Overlaying BG", value: "#010203", opacity: 69 },
            { name: "Brd", value: "#292929", opacity: 81 },
            { name: "Black", value: "#000000", opacity: 30 },
            { name: "White", value: "#CCCCCC", opacity: 69 },
            { name: "Lilac Accent", value: "#7B6CBD", opacity: 100 },
            { name: "Teal Accent", value: "#003431", opacity: 100 },
            { name: "Text Primary (Hd)", value: "#ABC4C3", opacity: 100 },
            { name: "Text Secondary (Bd)", value: "#748393", opacity: 100 },
          ],
        },
      },
      typographyTokens: {
        createMany: {
          data: [
            { name: "Text Primary", fontFamily: "Arial" },
            { name: "Text Secondary", fontFamily: "Inter" },
          ],
        },
      },
    },
  });

  return zenithDesignSystem;
};
