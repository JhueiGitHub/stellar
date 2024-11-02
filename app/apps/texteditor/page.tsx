"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ObsidianPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Simulate a delay before showing the 404 message
    const timer = setTimeout(() => {
      // You can customize this message or use a proper 404 component
      console.log("404 - Obsidian Vault Not Found");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-2xl font-bold">404 - Obsidian Vault Not Found</h1>
    </div>
  );
};

export default ObsidianPage;
