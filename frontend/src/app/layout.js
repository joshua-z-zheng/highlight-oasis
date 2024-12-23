import "./globals.css"
import Link from "next/link";
import { GiSoccerKick } from 'react-icons/gi'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0">
            <nav className="w-full border-b border-gray-800">
              <div className="flex py-4 px-4 space-x-6">
                <div className="font-bold text-xl">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 hover:text-gray-300"
                  >
                    <GiSoccerKick className="w-5 h-5" color="limegreen"/>
                    <span>highlight oasis</span>
                  </Link>
                </div>
                <div className="flex flex-row space-x-4">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 hover:text-gray-300"
                  >
                    <p className="underline underline-offset-8 decoration-green-400">Home</p>
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center space-x-2 hover:text-gray-300"
                  >
                    Premier League
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center space-x-2 hover:text-gray-300"
                  >
                    UCL
                  </Link>
                </div>
              </div>
            </nav>
          </header>
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
