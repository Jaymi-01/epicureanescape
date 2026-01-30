import type { Metadata } from "next";
import { Playfair_Display, Montserrat, } from 'next/font/google';
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { GlobalAlert } from "@/components/global-alert";

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: "Epicurean Escape by Tiara | Exclusive Fine Dining",
    template: "%s | Epicurean Escape by Tiara"
  },
  description: "Experience the art of Nigerian fusion fine dining. Entry is granted exclusively to those with a confirmed reservation. Located in Lagos.",
  keywords: ["Fine Dining", "Lagos Restaurant", "Nigerian Cuisine", "Luxury Dining", "Reservation Only", "Tiara"],
  openGraph: {
    title: "Epicurean Escape by Tiara",
    description: "An exclusive culinary journey where entry is by reservation only.",
    url: "https://epicureanescape.com",
    siteName: "Epicurean Escape",
    images: [
      {
        url: "/eet-logo.jpg",
        width: 800,
        height: 600,
        alt: "Epicurean Escape Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/eet-logo.jpg",
    apple: "/eet-logo.jpg",
  }
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
        <GlobalAlert />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
