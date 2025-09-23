"use client"
// import { GeistSans } from "geist/font/sans"
// import { GeistMono } from "geist/font/mono"
// import { Analytics } from "@vercel/analytics/next"
// import "./globals.css"
// import { Suspense } from "react"

// export const metadata = {
//   title: "Invertio.us – Invertio Taxation Company",
//   description:
//     "Professional taxation management platform with comprehensive document handling, payment processing, and business management solutions",
//   keywords: "taxation, business management, document handling, payment processing, tax returns, Invertio",
//   authors: [{ name: "Invertio Taxation Company" }],
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
//         <Suspense fallback={null}>{children}</Suspense>
//         <Analytics />
//       </body>
//     </html>
//   )
// }

// app/layout.js

import { AuthProvider } from "@/src/contexts/AuthContext"
import './globals.css'
import DashboardLayout from "@/src/components/DashboardLayout"
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }) {
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        const clonedResponse = response.clone();

        let data;
        try {
          data = await clonedResponse.json();
        } catch {
          data = null;
        }

        if (data?.error?.toLowerCase().includes("token expired")) {
          handleLogout();
        }

        return response;
      } catch (error) {
        return Promise.reject(error);
      }
    };

    function handleLogout() {
      localStorage.clear();
      window.location.href = "/login";
    }
  }, []);
  return (
    <html lang="en" style={{ overflow: "hidden" }}>
      <head>
        <title>Invertio.us – Invertio Taxation Company</title>
        <meta
          name="description"
          content="Professional taxation management platform with comprehensive document handling, payment processing, and business management solutions"
        />
        <meta name="keywords" content="taxation, business management, document handling, payment processing, tax returns, Invertio" />
        <meta name="author" content="Invertio Taxation Company" />
      </head>
      <link rel="icon" type="image/x-icon" href="/favicon.svg" />
      <body width="device-width" initial-scale="1">
        <AuthProvider>
        {/* <DashboardLayout> */}

          {children}
        {/* </DashboardLayout> */}

        </AuthProvider>
      </body>
    </html>
  )
}