import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TimePortal - Internet Archive Explorer",
  description: "Explore historical web content through time",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {/* Main content */}
        <div className="min-h-screen bg-gray-50">{children}</div>

        {/* Footer */}
        <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              Data provided by the Internet Archive. Built with Next.js and
              Tailwind CSS.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
