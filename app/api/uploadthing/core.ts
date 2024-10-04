// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentProfile } from "@/lib/current-profile";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const profile = await currentProfile();
      if (!profile) throw new UploadThingError("Unauthorized");
      return { userId: profile.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId };
    }),

  videoUploader: f({ video: { maxFileSize: "64MB" } })
    .middleware(async () => {
      const profile = await currentProfile();
      if (!profile) throw new UploadThingError("Unauthorized");
      return { userId: profile.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
