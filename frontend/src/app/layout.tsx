
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { NextProviders } from "./NextProvider";
import SWRProvider from "@/components/SWRProvider";
import { Toaster } from "@/components/ui/toaster";

const be = Be_Vietnam_Pro({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${be.className} antialiased`}>
      <NextProviders>
          <SWRProvider>
              <main>{children}</main>
              <Toaster />
          </SWRProvider>
        </NextProviders>
      </body>
    </html>
  );
}