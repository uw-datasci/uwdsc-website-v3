"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/lib/api";
import { Profile } from "@uwdsc/common/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
  Separator,
  Badge,
} from "@uwdsc/ui";

interface NavLink {
  href: string;
  label: string;
  target?: string;
}

interface MobileMenuProps {
  navLinks: NavLink[];
  user: Profile | null;
}

function HamburgerIcon() {
  return (
    <div className="ml-auto flex flex-col gap-1.25 lg:hidden hover:cursor-pointer hover:scale-105 transition-all duration-200">
      <div className="h-0.75 w-5.5 rounded-full bg-white" />
      <div className="h-0.75 w-8 rounded-full bg-white" />
      <div className="h-0.75 w-5.5 translate-x-2.5 rounded-full bg-white" />
    </div>
  );
}

export function MobileMenu({ navLinks, user }: Readonly<MobileMenuProps>) {
  const router = useRouter();
  const { mutate } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const faculty = `${user?.faculty?.charAt(0).toUpperCase()}${user?.faculty?.slice(1)}`;

  const handleSignOut = async () => {
    try {
      await signOut();
      await mutate();
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger>
        <HamburgerIcon />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-sm p-0 [&>button]:hidden"
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="text-left border-b bg-muted/30 px-6 py-4 relative">
            <SheetTitle className="flex items-center gap-3">
              <SheetClose asChild>
                <Link
                  href="/"
                  className="relative w-10 h-10 transition-transform hover:scale-105"
                >
                  <Image
                    src="/logos/dsc.svg"
                    alt="uwdsc logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </Link>
              </SheetClose>
              <span className="text-xl font-semibold">Navigation</span>
            </SheetTitle>
            <SheetDescription />
            {/* Custom Close Button */}
            <SheetClose asChild>
              <div className="absolute top-6 right-6 w-6 h-6 flex items-center justify-center hover:bg-accent/20 rounded transition-colors">
                {/* <div className="ml-auto flex flex-col gap-[5px] lg:hidden hover:cursor-pointer hover:scale-105 transition-all duration-200">
                  <div className="h-[3px] w-[22px] rounded-full bg-white" />
                  <div className="h-[3px] w-8 rounded-full bg-white" />
                  <div className="h-[3px] w-[22px] translate-x-[10px] rounded-full bg-white" />
                </div> */}
                <HamburgerIcon />
              </div>
            </SheetClose>
          </SheetHeader>

          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* Main Navigation Links */}
            <div className="px-6 py-2">
              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const linkComponent = (
                    <Link
                      href={link.href}
                      target={link.target}
                      rel={
                        link.target === "_blank"
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {link.label}
                    </Link>
                  );

                  // Don't close sheet for external links (target="_blank")
                  if (link.target === "_blank") {
                    return (
                      <Button
                        key={link.href}
                        variant="ghost"
                        className="w-full justify-start text-lg py-3 px-4 h-auto font-semibold hover:bg-accent/50 transition-colors rounded-lg"
                        asChild
                      >
                        {linkComponent}
                      </Button>
                    );
                  }

                  return (
                    <SheetClose key={link.href} asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-lg py-3 px-4 h-auto font-semibold hover:bg-accent/50 transition-colors rounded-lg"
                        asChild
                      >
                        {linkComponent}
                      </Button>
                    </SheetClose>
                  );
                })}
              </nav>
            </div>

            {/* User Section */}
            {user ? (
              <div className="mt-auto border-t bg-muted/30">
                <div className="px-6 py-4">
                  <div className="mb-3 mx-4">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-lg text-foreground">
                        {user.first_name} {user.last_name}
                      </p>

                      <Badge variant="default" className="text-xs px-2">
                        {faculty}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-1">
                      {user?.email}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      WatIAM: {user.wat_iam}
                    </p>
                  </div>

                  <nav className="space-y-1">
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-base py-2 px-4 h-auto font-medium hover:bg-accent/50 transition-colors rounded-lg"
                        asChild
                      >
                        <Link href="/passport">My Passport</Link>
                      </Button>
                    </SheetClose>
                    <Separator className="my-1" />
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-base py-2 px-4 h-auto font-medium text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors rounded-lg"
                      onClick={handleSignOut}
                    >
                      Log Out
                    </Button>
                  </nav>
                </div>
              </div>
            ) : (
              <div className="mt-auto border-t bg-muted/30">
                <div className="px-6 py-3">
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="w-full text-base py-2 h-auto font-medium rounded-lg"
                      asChild
                    >
                      <Link href="/login">Log In</Link>
                    </Button>
                  </SheetClose>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
