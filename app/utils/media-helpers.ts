// import { MediaItem, MediaType } from "@prisma/client";

// // utils/media-helpers.ts
// export function getMediaType(file: {
//   name: string;
//   mimeType?: string;
// }): MediaType {
//   const extension = file.name.split(".").pop()?.toLowerCase();
//   const mimeType = file.mimeType?.toLowerCase();

//   // Font detection
//   if (
//     (extension && ["ttf", "otf", "woff", "woff2"].includes(extension)) ||
//     (mimeType &&
//       ["font/ttf", "font/otf", "font/woff", "font/woff2"].includes(mimeType))
//   ) {
//     return "FONT";
//   }

//   // Image detection
//   if (
//     (extension &&
//       ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) ||
//     (mimeType && mimeType.startsWith("image/"))
//   ) {
//     return "IMAGE";
//   }

//   // Video detection
//   if (
//     (extension && ["mp4", "webm", "ogg", "mov"].includes(extension)) ||
//     (mimeType && mimeType.startsWith("video/"))
//   ) {
//     return "VIDEO";
//   }

//   throw new Error(`Unsupported file type: ${file.name}`);
// }

// export function parseUploadcareResponse(response: any): MediaItem {
//   const cdnUrl = response.cdnUrl || response.url;
//   const originalName = response.originalFilename || response.name || "Untitled";
//   const mimeType = response.mimeType || response.contentType;

//   // Extract file extension from original name or URL
//   const fileExtension = originalName.split(".").pop()?.toLowerCase();

//   const mediaType = getMediaType({
//     name: originalName,
//     mimeType: mimeType,
//   });

//   return {
//     id: response.uuid || crypto.randomUUID(),
//     name: originalName,
//     type: mediaType,
//     url: cdnUrl,
//     originalFilename: originalName,
//     mimeType: mimeType,
//     fileExtension: fileExtension,
//     metadata: response.metadata || {},
//   };
// }
