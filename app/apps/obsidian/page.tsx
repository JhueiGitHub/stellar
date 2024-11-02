// app/apps/stellar/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  QueryClientProvider,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import UploadCareButton from "@/app/components/uploadcare-button";

const queryClient = new QueryClient();

interface MediaItem {
  id: string;
  name: string;
  type: "IMAGE" | "VIDEO" | "FONT";
  url: string;
  createdAt: Date;
}

function MediaGrid() {
  const [isUploading, setIsUploading] = useState(false);

  const { data: mediaItems = [], refetch } = useQuery<MediaItem[]>({
    queryKey: ["mediaItems"],
    queryFn: async () => {
      const response = await axios.get("/api/media");
      return response.data;
    },
  });

  const handleUpload = async (cdnUrl: string) => {
    try {
      setIsUploading(true);

      // Better file type detection
      let type: "IMAGE" | "VIDEO" | "FONT";

      // Convert URL to lowercase for case-insensitive matching
      const lowerUrl = cdnUrl.toLowerCase();

      if (lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/)) {
        type = "IMAGE";
      } else if (lowerUrl.match(/\.(mp4|webm|mov|avi|mkv)$/)) {
        type = "VIDEO";
      } else if (lowerUrl.match(/\.(ttf|otf|woff|woff2)$/)) {
        type = "FONT";
      } else {
        // Default to IMAGE if the extension isn't matched
        // Since Uploadcare provides image URLs without extensions
        type = "IMAGE";
      }

      const uploadData = {
        name: cdnUrl.split("/").pop() || "Untitled",
        type,
        url: cdnUrl,
      };

      await axios.post("/api/media", uploadData);
      refetch();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-full w-full relative bg-black bg-opacity-80">
      <div className="absolute inset-0 flex flex-col p-4">
        {/* Header with upload button */}
        <div className="flex justify-center mb-6">
          <div className="p-2">
            <UploadCareButton onUpload={handleUpload} />
          </div>
        </div>

        {/* Media grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-4 gap-4 p-4">
            {mediaItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square rounded-lg overflow-hidden bg-[#292929] border border-[#292929]"
              >
                {item.type === "IMAGE" && (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {item.type === "VIDEO" && (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                  />
                )}
                {item.type === "FONT" && (
                  <div className="w-full h-full flex items-center justify-center text-[#ABC4C3]">
                    <span className="text-sm">{item.name}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload indicator */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="text-[#ABC4C3]">Uploading...</div>
        </div>
      )}
    </div>
  );
}

export default function Stellar() {
  return (
    <QueryClientProvider client={queryClient}>
      <MediaGrid />
    </QueryClientProvider>
  );
}
