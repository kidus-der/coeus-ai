"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // Ensure hydration completes before rendering to avoid mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Only render children after first client-side render to avoid hydration mismatch
  return (
    <NextThemesProvider {...props}>
      {mounted ? children : null}
    </NextThemesProvider>
  );
}
