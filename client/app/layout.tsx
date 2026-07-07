// // // import type { Metadata } from "next";
// // // import { Inter } from "next/font/google";
// // // import { Toaster } from "sonner";
// // // import "./globals.css";

// // // import { ThemeProvider } from "@/components/ThemeProvider";

// // // const inter = Inter({ subsets: ["latin"] });

// // // export const metadata: Metadata = {
// // //     title: "Resumen - Build Your Professional Resume",
// // //     description: "Create stunning resumes in minutes with our AI-powered builder.",
// // // };

// // // export default function RootLayout({
// // //     children,
// // // }: Readonly<{
// // //     children: React.ReactNode;
// // // }>) {
// // //     return (
// // //         <html lang="en" suppressHydrationWarning>
// // //             <body className={inter.className}>
// // //                 <ThemeProvider>
// // //                     {children}
// // //                     <Toaster position="top-center" richColors />
// // //                 </ThemeProvider>
// // //             </body>
// // //         </html>
// // //     );
// // // }


// // import type { Metadata } from "next";
// // import { Inter } from "next/font/google";
// // import "./globals.css";
// // import { Providers } from "@/components/providers";

// // const inter = Inter({ subsets: ["latin"] });

// // export const metadata: Metadata = {
// //     title: "Resumen - Build Your Professional Resume",
// //     description: "Create stunning resumes in minutes with our AI-powered builder.",
// // };

// // export default function RootLayout({
// //     children,
// // }: {
// //     children: React.ReactNode;
// // }) {
// //     return (
// //         <html lang="en" suppressHydrationWarning>
// //             <body className={inter.className}>
// //                 <Providers>{children}</Providers>
// //             </body>
// //         </html>
// //     );
// // }


// ///////
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { Providers } from "@/components/providers";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//     title: "Resumen - Build Your Professional Resume",
//     description: "Create stunning resumes in minutes with our AI-powered builder.",
// };

// export default function RootLayout({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     return (
//         <html lang="en" suppressHydrationWarning>
//             <body className={`${inter.className} bg-background text-foreground`}>
//                 <Providers>
//                     <div className="min-h-screen">
//                         {children}
//                     </div>
//                 </Providers>
//             </body>
//         </html>
//     );
// }


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Resumen - Build Your Professional Resume",
    description: "Create stunning resumes in minutes with our AI-powered builder.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* ✅ CRITICAL FIX: apply theme BEFORE render */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
(function() {
  try {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark"); // default
    }
  } catch (e) {}
})();
                        `,
                    }}
                />
            </head>

            <body className={`${inter.className} bg-background text-foreground`}>
                <Providers>
                    <div className="min-h-screen">
                        {children}
                    </div>
                </Providers>
            </body>
        </html>
    );
}