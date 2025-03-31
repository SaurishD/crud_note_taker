import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { NextFont } from 'next/dist/compiled/@next/font';
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

const inter: NextFont = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Note Taker",
  description: "A modern note taking application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
          {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
