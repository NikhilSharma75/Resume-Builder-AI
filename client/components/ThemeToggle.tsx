// "use client";

// import { Sun, Moon } from "lucide-react";
// import { useTheme } from "./ThemeProvider";
// import { motion } from "framer-motion";



// export function ThemeToggle() {
//     const { theme, toggleTheme } = useTheme();

//     return (
//         <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={toggleTheme}
//             className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/50 border border-border text-foreground transition-colors hover:bg-secondary"
//             aria-label="Toggle theme"
//         >
//             <motion.div
//                 initial={false}
//                 animate={{
//                     rotate: theme === "dark" ? 0 : 180,
//                     scale: theme === "dark" ? 1 : 0,
//                     opacity: theme === "dark" ? 1 : 0,
//                 }}
//                 className="absolute"
//             >
//                 <Moon size={20} />
//             </motion.div>
//             <motion.div
//                 initial={false}
//                 animate={{
//                     rotate: theme === "light" ? 0 : -180,
//                     scale: theme === "light" ? 1 : 0,
//                     opacity: theme === "light" ? 1 : 0,
//                 }}
//                 className="absolute"
//             >
//                 <Sun size={20} />
//             </motion.div>
//         </motion.button>
//     );
// }

///////////////
"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/50 border border-border text-foreground transition-colors hover:bg-secondary"
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: theme === "dark" ? 0 : 180,
                    scale: theme === "dark" ? 1 : 0,
                    opacity: theme === "dark" ? 1 : 0,
                }}
                className="absolute"
            >
                <Moon size={20} />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    rotate: theme === "light" ? 0 : -180,
                    scale: theme === "light" ? 1 : 0,
                    opacity: theme === "light" ? 1 : 0,
                }}
                className="absolute"
            >
                <Sun size={20} />
            </motion.div>
        </motion.button>
    );
}