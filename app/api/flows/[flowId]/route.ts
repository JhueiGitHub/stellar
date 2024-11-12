// app/api/flows/[flowId]/route.ts
import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { flowId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const flow = await db.flow.findUnique({
      where: {
        id: params.flowId,
        profileId: profile.id,
      },
      include: {
        designSystem: {
          include: {
            colorTokens: true,
            typographyTokens: true,
          },
        },
        components: true,
      },
    });

    return NextResponse.json(flow);
  } catch (error) {
    console.error("[FLOW_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { flowId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, description } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const flow = await db.flow.update({
      where: {
        id: params.flowId,
        profileId: profile.id,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(flow);
  } catch (error) {
    console.error("[FLOW_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { flowId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.flow.delete({
      where: { id: params.flowId, profileId: profile.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    console.error("[FLOW_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
