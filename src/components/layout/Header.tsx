"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

import NavItem from "./NavItem";
import type { NavItemType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Menu,
  UserPlusIcon,
  ListChecks,
  LayoutDashboard,
  LogInIcon,
  StoreIcon,
  UsersIcon,
  Banknote,
  UserCircle,
  LogOutIcon,
  Wand2,
  LayoutGrid,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import NotificationBell from "./NotificationBell";

const navItems: NavItemType[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/checklist", label: "Checklist", icon: ListChecks },
  { href: "/vendors", label: "Vendors", icon: StoreIcon },
  { href: "/budget", label: "Budget", icon: Banknote },
  { href: "/guests", label: "Guests", icon: UsersIcon },
  { href: "/floorplan/editor", label: "Floorplan", icon: LayoutGrid },
  { href: "/moodboard", label: "Moodboard", icon: Wand2 },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export default function Header() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLogout = () => {
    // In demo mode, redirecting to login is enough.
    // The AuthProvider handles the user state based on the path.
    router.push("/login");
  };

  if (loading) {
    // Return a minimal, static header or skeleton during auth loading to prevent flicker
    return (
      <header className="bg-card/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-3xl font-headline text-primary">
            Tangelo
          </Link>
        </div>
      </header>
    );
  }

  // Unified header for all public-facing pages
  if (!user) {
    return (
      <header className="bg-card/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-3xl font-headline text-primary">
            Tangelo
          </Link>
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login">
                <LogInIcon className="mr-2 h-4 w-4" />
                Log In
              </Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                <UserPlusIcon className="mr-2 h-4 w-4" />
                Sign Up
              </Link>
            </Button>
          </nav>
        </div>
      </header>
    );
  }

  // Main application header for authenticated users on internal pages
  if (user) {
    return (
      <header className="bg-card shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link
            href="/dashboard"
            className="text-3xl font-headline text-primary"
          >
            Tangelo
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </nav>

          {/* Desktop Actions & Mobile Trigger */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <NotificationBell />
              <Button onClick={handleLogout} variant="ghost" size="sm">
                <LogOutIcon className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-card p-0">
                  <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-lg font-semibold font-headline pl-2">
                      Menu
                    </h2>
                    <div className="flex items-center gap-2">
                      <NotificationBell />
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Menu className="h-5 w-5" />
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                  <nav className="flex flex-col space-y-2 p-4">
                    {navItems.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className="text-lg font-medium text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md flex items-center"
                        >
                          {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                    <SheetClose asChild>
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start text-lg font-medium px-3 py-2"
                      >
                        <LogOutIcon className="mr-3 h-5 w-5" /> Logout
                      </Button>
                    </SheetClose>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Fallback for non-user on a page that is not public (should be handled by AuthProvider redirect)
  return null;
}
