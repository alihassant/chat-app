import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import { DM_Sans } from "next/font/google";
import BootstrapClient from "@/components/BootstrapClient";

const font = DM_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Chat App",
  description: "A chat app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        {children}
        <BootstrapClient />
      </body>
    </html>
  );
}
