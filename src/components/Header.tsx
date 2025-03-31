"use client";
import Link from "next/link";
import Image from "next/image";
import { SunIcon, MoonIcon } from "@/components/Icons";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

export function Header() {
  const { setTheme, theme } = useTheme(); //For dark mode
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const toggleTheme = () => {
    //For dark mode
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and App Name (Left) */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/coeus-logo-dark-mode.svg"
            alt="Coeus AI Logo"
            width={50}
            height={50}
            className="rounded-full" // Make it a circle
          />
          <span className="font-bold text-lg">Coeus</span>
        </Link>

        {/* Navigation Links (Center) */}
        <nav
          className="flex items-center justify-center border border-solid border-dark rounded-full py-2 px-8 
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
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="text-foreground transition-transform hover:scale-110 duration-300 ease-in-out p-1 ml-2"
          >
            {theme === "dark" ? (
              <SunIcon className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </button>
        </nav>
        
        {/* User Authentication Dropdown (Right) */}
        <div className="flex items-center">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {session?.user?.name || session?.user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/auth/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
