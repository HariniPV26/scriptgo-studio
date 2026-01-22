import type { Metadata } from "next";
import { Inter, Outfit, Caveat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CursorGlow } from "@/components/CursorGlow";
import { BackgroundDecor } from "@/components/BackgroundDecor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "ScriptGo | AI Data-Driven Content Generation",
  description: "Generate viral scripts for LinkedIn, YouTube, and TikTok in seconds with advanced AI frameworks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} ${caveat.variable} font-sans bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CursorGlow />
          <BackgroundDecor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
