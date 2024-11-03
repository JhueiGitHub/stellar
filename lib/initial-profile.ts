// initial-profile.ts
import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

const DEFAULT_ZENITH_NODES = {
  designSystem: {
    colors: {
      "Underlying BG": { value: "#292929", opacity: 81 },
      "Overlaying BG": { value: "#010203", opacity: 69 },
      "Brd": { value: "#292929", opacity: 81 },
      "Black": { value: "#000000", opacity: 100 },
      "Glass": { value: "#000000", opacity: 30 },
      "White": { value: "#CCCCCC", opacity: 69 },
      "Active": { value: "#28C840", opacity: 100 },
      "Warning": { value: "#FEBC2E", opacity: 100 },
      "Error": { value: "#FF5F57", opacity: 100 },
      "Lilac Accent": { value: "#7B6CBD", opacity: 100 },
      "Teal Accent": { value: "#003431", opacity: 100 },
      "Text Primary (Hd)": { value: "#ABC4C3", opacity: 100 },
      "Text Secondary (Bd)": { value: "#748393", opacity: 100 }
    },
    typography: {
      "Text Primary": { fontFamily: "Arial" },
      "Text Secondary": { fontFamily: "Inter" }
    }
  }
};

const DEFAULT_ORION_NODES = {
  wallpaper: {
    type: "color",
    value: "#000000"
  },
  dock: {
    background: "Glass",
    icons: {} // Default app icons
  }
};

export const initialProfile = async () => {
  const user = await currentUser();
  
  if (!user) {
    return redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: { userId: user.id }
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.$transaction(async (tx) => {
    // Create profile
    const profile = await tx.profile.create({
      data: {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress
      }
    });

    // Create OS stream
    const osStream = await tx.stream.create({
      data: {
        name: "OS",
        profileId: profile.id
      }
    });

    // Create design system
    const designSystem = await tx.designSystem.create({
      data: {
        name: "Zenith",
        profileId: profile.id
      }
    });

    // Create Zenith design system flow
    const zenithFlow = await tx.flow.create({
      data: {
        name: "Zenith",
        type: "DESIGN_SYSTEM",
        streamId: osStream.id,
        designSystemId: designSystem.id,
        nodes: DEFAULT_ZENITH_NODES,
        isAppConfig: false
      }
    });

    // Create Orion app config flow
    const orionFlow = await tx.flow.create({
      data: {
        name: "Zenith",
        type: "APP_CONFIG",
        streamId: osStream.id,
        designSystemId: designSystem.id,
        nodes: DEFAULT_ORION_NODES,
        isAppConfig: true,
        appId: "orion"
      }
    });

    // Create root folder structure
    const rootFolder = await tx.folder.create({
      data: {
        name: "root",
        isRoot: true,
        profileId: profile.id,
        children: {
          create: [
            {
              name: "Apps",
              profileId: profile.id,
              children: {
                create: [
                  { name: "Flow", profileId: profile.id },
                  { name: "Stellar", profileId: profile.id },
                  { name: "Orion", profileId: profile.id }
                ]
              }
            },
            { name: "Home", profileId: profile.id },
            { name: "Documents", profileId: profile.id }
          ]
        }
      }
    });

    // Create default constellation
    const constellation = await tx.constellation.create({
      data: {
        name: "Orion",
        profileId: profile.id,
        isActive: true,
        flowMappings: {
          orion: orionFlow.id
        }
      }
    });

    return profile;
  });

  return newProfile;
};