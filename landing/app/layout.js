import { Fraunces, Instrument_Sans, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--display", axes: ["opsz"] });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--body" });
const arabic = Noto_Naskh_Arabic({ subsets: ["arabic"], variable: "--arabic" });

export const metadata = {
  title: "Sakina – Prayer times without the noise",
  description: "A calm, ad-free prayer app with Smart Azan, Quran and Qibla.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${arabic.variable}`}>{children}</body>
    </html>
  );
}
