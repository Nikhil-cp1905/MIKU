import type { Metadata } from "next";
import "./globals.css";
import { QuizProvider } from "@/context/QuizProvider";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/shared/Header";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "QuizTime - Embedded Systems Quiz",
  description: "A professional quiz web app for embedded systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased"
        )}
      >
        <QuizProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </QuizProvider>
      </body>
    </html>
  );
}
