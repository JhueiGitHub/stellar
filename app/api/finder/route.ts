import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, type, parentId, content, size } = await req.json();

    if (type === "folder") {
      const newFolder = await db.folder.create({
        data: {
          name,
          profileId: profile.id,
          parentId,
        },
      });
      return NextResponse.json(newFolder);
    } else if (type === "file") {
      const newFile = await db.file.create({
        data: {
          name,
          type,
          size,
          content,
          folderId: parentId,
          profileId: profile.id,
        },
      });
      return NextResponse.json(newFile);
    } else {
      return new NextResponse("Invalid item type", { status: 400 });
    }
  } catch (error) {
    console.error("[FINDER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
