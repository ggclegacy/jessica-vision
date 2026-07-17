import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DevReset } from "./dev-reset";

export const metadata: Metadata = {
  title: "Rooted Essence Vision Experience",
  description:
    "A guided experience designed to uncover the purpose, possibilities, and future of Rooted Essence.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#1B1210",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}<DevReset /></body>
    </html>
  );
}
