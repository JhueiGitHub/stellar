import "./globals.css";

export const metadata = {
  title: "NextJS OS",
  description: "A web-based operating system built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
