// import { useState } from "react";

// export function useTheme() {
//   const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
//     const saved = localStorage.getItem("theme");
//     return saved === "light" || saved === "dark" ? saved : "system";
//   });

//   const applyTheme = (value: "light" | "dark" | "system") => {
//     const root = document.documentElement;

//     if (value === "dark") {
//       root.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else if (value === "light") {
//       root.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     } else {
//       // system
//       localStorage.removeItem("theme");
//       root.classList.toggle(
//         "dark",
//         window.matchMedia("(prefers-color-scheme: dark)").matches
//       );
//     }

//     setTheme(value);
//   };

//   return {
//     theme,
//     setLight: () => applyTheme("light"),
//     set () => applyTheme("dark"),
//     setSystem: () => applyTheme("system"),
//   };
// }
