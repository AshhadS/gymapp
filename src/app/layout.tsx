import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Corrected font import
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster

const inter = Inter({
  variable: '--font-inter', // Updated variable name
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BudgetFlow', // Updated App Name
  description: 'Track your expenses and manage your budget.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} h-full bg-background font-sans antialiased`} // Use the correct font variable
      >
        <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12">
          {children}
          <Toaster /> {/* Add Toaster component */}
        </main>
      </body>
    </html>
  );
}
