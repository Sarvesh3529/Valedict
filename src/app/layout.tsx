import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'Valedict AI',
  description: 'An AI-powered learning platform for students.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 pb-24 md:pb-0">{children}</main>
              <BottomNav />
            </div>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
