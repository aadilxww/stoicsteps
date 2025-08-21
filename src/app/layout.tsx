import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Stoic Steps',
  description: 'Daily tasks and stoic wisdom.',
  openGraph: {
    images: ['/images/Stoic Steps.png'],
  },
  icons: {
    icon: '/images/Stoic Steps.png',
    shortcut: '/images/Stoic Steps.png',
    apple: '/images/Stoic Steps.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <header className="absolute top-4 left-4 z-10">
          <Image
            src="/images/Stoic Steps.png"
            alt="Stoic Steps Logo"
            width={64}
            height={64}
            className="w-16 h-16"
          />
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
