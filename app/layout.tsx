import "./globals.css";
import OTPWrapper from "@/app/components/custom-otp-input";
import { ClerkProvider } from "@clerk/nextjs";
import { DesignSystemProvider } from "./contexts/DesignSystemContext";

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
        <DesignSystemProvider>
          <body className="h-screen w-screen bg-black">
            <OTPWrapper>{children}</OTPWrapper>
          </body>
        </DesignSystemProvider>
      </html>
    </ClerkProvider>
  );
}
