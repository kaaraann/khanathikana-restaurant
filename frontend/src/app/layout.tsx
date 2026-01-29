import type { Metadata } from "next";
import "./globals.css";
import { RealtimeProvider } from "@/contexts/RealtimeContext";

export const metadata: Metadata = {
  title: "Khanathikana - Restaurant Management",
  description: "Complete restaurant management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RealtimeProvider>
          {children}
        </RealtimeProvider>
      </body>
    </html>
  );
}
