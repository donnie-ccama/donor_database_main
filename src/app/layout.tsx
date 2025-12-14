import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Citykid Donor CRM",
  description: "A modern donor management CRM for nonprofits. Track donors, gifts, segments, and more.",
  keywords: ["donor management", "CRM", "nonprofit", "fundraising", "gifts"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
