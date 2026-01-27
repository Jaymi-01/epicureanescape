import type { Metadata } from "next";
import { Playfair_Display, Montserrat, } from 'next/font/google';
import "./globals.css";


const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Epicurean Escape by Tiara",
  description: "An exclusive culinary journey where entry is by reservation only.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
