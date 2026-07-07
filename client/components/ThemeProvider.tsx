// "use client";

// import React, { createContext, useContext, useEffect, useState } from "react";

// type Theme = "dark" | "light";

// interface ThemeContextType {
//     theme: Theme;
//     toggleTheme: () => void;
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//     const [theme, setTheme] = useState<Theme>("dark");
//     const [mounted, setMounted] = useState(false);

//     useEffect(() => {
//         const savedTheme = localStorage.getItem("theme") as Theme | null;
//         if (savedTheme) {
//             setTheme(savedTheme);
//             if (savedTheme === "dark") {
//                 document.documentElement.classList.add("dark");
//             } else {
//                 document.documentElement.classList.remove("dark");
//             }
//         } else {
//             // Default to dark
//             document.documentElement.classList.add("dark");
//         }
//         setMounted(true);
//     }, []);

//     const toggleTheme = () => {
//         const newTheme = theme === "dark" ? "light" : "dark";
//         setTheme(newTheme);
//         localStorage.setItem("theme", newTheme);
        
//         if (newTheme === "dark") {
//             document.documentElement.classList.add("dark");
//         } else {
//             document.documentElement.classList.remove("dark");
//         }
//     };

//     return (
//         <ThemeContext.Provider value={{ theme, toggleTheme }}>
//             <div style={{ visibility: mounted ? "visible" : "hidden" }}>
//                 {children}
//             </div>
//         </ThemeContext.Provider>
//     );
// }

// export function useTheme() {
//     const context = useContext(ThemeContext);
//     if (context === undefined) {
//         throw new Error("useTheme must be used within a ThemeProvider");
//     }
//     return context;
// }

"use client";
import { useTheme } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    );
}