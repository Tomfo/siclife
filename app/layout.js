'use client';
import NavBar from '@/components/NavBar';
import Link from 'next/link';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import MainHeader from '@/components/MainHeader';
import ResponsiveAppBar from '@/components/ResponsiveAppBar';
import { ClerkProvider } from '@clerk/nextjs';
import localFont from 'next/font/local';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang='en' className={`${geistSans.variable} ${geistMono.variable}`}>
        <head>
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0'
          />
        </head>

        <body className='bg-gray-50 min-h-screen flex flex-col'>
          {/* Header */}
          <MainHeader />

          {/* Main Content */}
          <main className='flex-1 container mx-auto px-4 py-8'>
            <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
          </main>

          {/* Footer */}
          <footer className='bg-white shadow-inner'>
            <div className='container mx-auto px-4 py-4 text-center text-gray-500 text-sm'>
              &copy; {new Date().getFullYear()} Binary Logic Limited. All rights
              reserved.
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
