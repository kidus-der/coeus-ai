"use client";
import Link from "next/link";
import Image from "next/image";
import { SunIcon, MoonIcon } from "@/components/Icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const { setTheme, theme } = useTheme(); //For dark mode

  const toggleTheme = () => {
    //For dark mode
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo and App Name (Left) */}
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Image
            src="/coeus-logo-noname.svg"
            alt="Coeus AI Logo"
            width={40}
            height={40}
            className="rounded-full" // Make it a circle
          />
          <span className="font-bold text-lg">Coeus</span>
        </Link>

        {/* Navigation Links and Toggle (Center) */}
        <nav className="flex items-center justify-center flex-1">
          <ul className="flex items-center space-x-4 border rounded-full py-2 px-4">
            <li>
                <Link
                  href="/"
                  className="text-foreground transition-all hover:scale-115 duration-500 ease px-1 py-1 transform-origin-center"
                >
                  Home
                </Link>
            </li>
            <li>
                <Link
                  href="/about"
                  className="text-foreground transition-all hover:scale-115 duration-500 ease px-1 py-1 transform-origin-center"
                >
                  About
                </Link>
            </li>
            <li>
                <Link
                  href="/contact"
                  className="text-foreground transition-all hover:scale-115 duration-500 ease px-1 py-1 transform-origin-center"
                >
                  Contact
                </Link>
            </li>
            <li>
              {/* Dark Mode Toggle (Moved Here) */}
              <Button
                size="icon"
                onClick={toggleTheme}
                className="hover:scale-115 transition-all duration-300 ease"
              >
                {theme === "dark" ? (
                  <SunIcon className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
