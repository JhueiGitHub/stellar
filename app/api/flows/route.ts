import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const flows = await db.flow.findMany({
      where: {
        stream: {
          profileId: profile.id
        }
      },
      include: {
        components: true
      }
    });

    return NextResponse.json(flows);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, streamId, type, designSystemId, isAppConfig, appId } = await req.json();

    const flow = await db.flow.create({
      data: {
        name,
        streamId,
        type,
        designSystemId,
        isAppConfig,
        appId,
        nodes: isAppConfig ? {
          wallpaper: {
            type: "color",
            value: "#000000"
          }
        } : {}
      },
      include: {
        components: true
      }
    });

    return NextResponse.json(flow);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}