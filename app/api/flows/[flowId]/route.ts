// app/api/flows/[flowId]/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentProfile } from '@/lib/current-profile';

export async function GET(req: Request, { params }: { params: { flowId: string } }) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const flow = await db.flow.findUnique({
      where: { id: params.flowId, profileId: profile.id },
      include: { components: true },
    });

    if (!flow) {
      return new NextResponse("Flow not found", { status: 404 });
    }

    return NextResponse.json(flow);
  } catch (error) {
    console.error("[FLOW_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { flowId: string } }) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, description } = await req.json();
    const updatedFlow = await db.flow.update({
      where: { id: params.flowId, profileId: profile.id },
      data: { name, description },
    });

    return NextResponse.json(updatedFlow);
  } catch (error) {
    console.error("[FLOW_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { flowId: string } }) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.flow.delete({
      where: { id: params.flowId, profileId: profile.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[FLOW_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}