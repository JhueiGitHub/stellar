import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const designSystem = await db.designSystem.findUnique({
      where: {
        profileId: profile.id,
      },
      include: {
        colorTokens: true,
        typographyTokens: true,
      },
    });

    return NextResponse.json(designSystem);
  } catch (error) {
    console.log("[DESIGN_SYSTEM_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
