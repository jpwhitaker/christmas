
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import localFont from 'next/font/local'




const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Skydiving Santa",
  description: "A game by JPW",
};


export default function RootLayout({ children }) {


  return (
    <html lang="en" suppressHydrationWarning className={` h-full`}>

      <body className="h-full flex flex-col">
        

          <div className="flex-grow">
            {children}
            <Analytics />
          </div>

        
      </body>

    </html>
  );
}

