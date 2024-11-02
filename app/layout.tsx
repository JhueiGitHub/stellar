import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { DesignSystemProvider } from "./contexts/DesignSystemContext";
import QueryProvider from "@/app/components/providers/query-provider";

export const metadata = {
  title: "Orion",
  description: "A web-based operating system built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <QueryProvider>
          <DesignSystemProvider>
            <body>{children}</body>
          </DesignSystemProvider>
        </QueryProvider>
      </html>
    </ClerkProvider>
  );
}
