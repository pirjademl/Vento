import type { Metadata } from "next";
import { Josefin_Sans, Josefin_Slab } from "next/font/google"; // Import playful fonts
import "./globals.css";
import { ThemeProvider } from "@/components/theme.provider";
import { Toaster } from "sonner";

// Setting up Quicksand as the primary font
const quicksand = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
});

// Setting up Fredoka for a more "bubbly" accent if needed
const fredoka = Josefin_Slab({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "ChatRoom | Connect",
  description: "A playful space to talk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${quicksand.variable} ${fredoka.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
