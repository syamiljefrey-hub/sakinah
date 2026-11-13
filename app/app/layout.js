import { Fraunces, DM_Sans, Amiri_Quran } from "next/font/google";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--display" });
const body = DM_Sans({ subsets: ["latin"], variable: "--body" });
const quran = Amiri_Quran({ subsets: ["arabic"], weight: "400", variable: "--quran" });

export const metadata = { title: "Sakina", description: "Quran, prayer times and Qibla in one calm app." };
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${quran.variable}`}>{children}</body>
    </html>
  );
}
