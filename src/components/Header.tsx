"use client";
import Link from "next/link";
import Image from "next/image";
import { SunIcon, MoonIcon } from "@/components/Icons";
import { useTheme } from "next-themes";

export function Header() {
  const { setTheme, theme } = useTheme(); //For dark mode

  const toggleTheme = () => {
    //For dark mode
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo and App Name (Left) */}
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Image
            src="/coeus-logo-dark-mode.svg"
            alt="Coeus AI Logo"
            width={50}
            height={50}
            className="rounded-full" // Make it a circle
          />
          <span className="font-bold text-lg">Coeus</span>
        </Link>

        {/* Navigation Links and Toggle (Center) */}
        <nav
          className="flex items-center justify-center flex-1 border border-solid border-dark rounded-full py-2 px-8 
      font-medium capitalize fixed top-1 bottom-1 right-1/2 translate-x-1/2
      bg-light/80 backdrop-blur-xs z-50"
        >
          <Link
            href="/"
            className="mr-2 text-foreground transition-transform hover:scale-110 duration-300 ease-in-out px-1 py-1"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="mr-2 ml-2 text-foreground transition-transform hover:scale-110 duration-300 ease-in-out px-1 py-1"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="mx-2 ml-2 text-foreground transition-transform hover:scale-110 duration-300 ease-in-out px-1 py-1"
          >
            Contact
          </Link>
          {/* Dark Mode Toggle (Moved Here) */}
          <button
            onClick={toggleTheme}
            className="text-foreground transition-transform hover:scale-110 duration-300 ease-in-out p-1"
          >
            {theme === "dark" ? (
              <SunIcon className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
