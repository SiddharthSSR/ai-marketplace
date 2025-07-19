"use client"

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme : "light";

  return (
    <div className={currentTheme === "dark" ? "dark" : "light"}>
      {children}
    </div>
  );
}