import type { Metadata } from 'next';
import { Fraunces, Karla, Caveat } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
});

const karla = Karla({
  variable: '--font-karla',
  subsets: ['latin'],
  display: 'swap',
});

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ruta Hispana · Travel & Cultural Journal | España',
  description:
    'An interactive, visually rich cultural journal exploring Spain — architectural landmarks, street fiestas, regional gastronomy, and living traditions.',
  keywords: [
    'Ruta Hispana',
    'Spain Culture',
    'Spanish Language',
    'Comida Española',
    'Fiestas de España',
    'Lugares Famosos',
    'Interactive Spain Map',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${karla.variable} ${caveat.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-cream text-ink font-body selection:bg-terracotta/25 selection:text-terracotta">
        {children}
      </body>
    </html>
  );
}
