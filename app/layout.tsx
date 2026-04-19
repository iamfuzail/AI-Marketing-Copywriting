import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'CopyCraft · AI Marketing Copy Generator',
  description:
    'AI-powered marketing copy generator for Indian brands. Generate emailers, social media posts, WhatsApp broadcasts, ad copy, and push notifications for every occasion.',
  keywords: [
    'AI copywriting',
    'marketing copy generator',
    'Indian festivals',
    'D2C marketing',
    'social media copy',
    'email marketing',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <Header />
        <main>{children}</main>
        <ToastProvider />
      </body>
    </html>
  );
}
