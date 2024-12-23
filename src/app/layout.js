
import { Montserrat } from "next/font/google";
import "./globals.css";
// import Providers from "./providers";
import localFont from 'next/font/local'

import Link from "next/link";



const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "JPW",
  description: "A collection of web experiments by JPW",
};

// const makawao = localFont({
//   src: '../../public/TAYMakawao.woff',
//   display: 'swap',
//   variable: '--font-makawao',
// })

// const dreamboat = localFont({
//   src: '../../public/TAYDreamboat-Thin.woff',
//   display: 'swap',
//   variable: '--font-dreamboat',
// })

export default function RootLayout({ children }) {


  return (
    <html lang="en" suppressHydrationWarning className={` h-full`}>

      <body className="h-full flex flex-col">
        

          <div className="flex-grow">
            {children}
            
          </div>

        
      </body>

    </html>
  );
}

