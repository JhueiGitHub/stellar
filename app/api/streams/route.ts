// app/api/streams/route.ts
import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

// GET handler for fetching streams
export async function GET() {
  try {
    // 1. Get the current user's profile
    const profile = await currentProfile();

    // 2. If no profile exists, return unauthorized
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 3. Fetch streams with related flows and components
    const streams = await db.stream.findMany({
      where: {
        profileId: profile.id,
      },
      include: {
        flows: {
          include: {
            components: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 4. Return the streams as JSON
    return NextResponse.json(streams);
  } catch (error) {
    console.error("[STREAMS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST handler for creating new streams
export async function POST(req: Request) {
  try {
    // 1. Get the current user's profile
    const profile = await currentProfile();

    // 2. If no profile exists, return unauthorized
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 3. Get the request body
    const { name, description, type } = await req.json();

    // 4. Validate required fields
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // 5. Create the new stream
    const stream = await db.stream.create({
      data: {
        name,
        description,
        type: type || "CUSTOM",
        profileId: profile.id,
      },
      include: {
        flows: {
          include: {
            components: true,
          },
        },
      },
    });

    // 6. Return the created stream
    return NextResponse.json(stream);
  } catch (error) {
    console.error("[STREAMS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
