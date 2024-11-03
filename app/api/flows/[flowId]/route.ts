import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { flowId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { nodes } = await req.json();

    const flow = await db.flow.update({
      where: {
        id: params.flowId,
        stream: {
          profileId: profile.id,
        },
      },
      data: {
        nodes,
      },
      include: {
        components: true,
      },
    });

    return NextResponse.json(flow);
  } catch (error) {
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

    const flow = await db.flow.delete({
      where: {
        id: params.flowId,
        stream: {
          profileId: profile.id,
        },
      },
    });

    return NextResponse.json(flow);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
