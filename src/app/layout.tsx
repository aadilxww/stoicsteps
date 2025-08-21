import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SisyphusAndBoulderIcon } from '@/components/SisyphusAndBoulderIcon';

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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
