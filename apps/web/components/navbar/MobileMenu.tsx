"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { signOut, type UserProfile } from "@/lib/api";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Badge,
} from "@uwdsc/ui";

interface NavLink {
  href: string;
  label: string;
}

interface AdminLink {
  href: string;
  title: string;
  adminOnly?: boolean;
}

interface MobileMenuProps {
  navLinks: NavLink[];
  profile: UserProfile | null;
  isAdminOrExec: boolean;
  adminLabel: string;
  visibleAdminLinks: AdminLink[];
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

export function MobileMenu({
  navLinks,
  profile,
  isAdminOrExec,
  adminLabel,
  visibleAdminLinks,
}: Readonly<MobileMenuProps>) {
  const router = useRouter();
  const { mutate } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  const faculty = `${profile?.faculty?.charAt(0).toUpperCase()}${profile?.faculty?.slice(1)}`;

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
                {navLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-lg py-3 px-4 h-auto font-semibold hover:bg-accent/50 transition-colors rounded-lg"
                      asChild
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </Button>
                  </SheetClose>
                ))}
              </nav>
            </div>

            {/* Admin/Exec Dropdown */}
            {isAdminOrExec && (
              <div className="px-6 py-1">
                <Separator className="mb-2" />
                <Collapsible
                  open={isAdminDropdownOpen}
                  onOpenChange={setIsAdminDropdownOpen}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-lg py-3 px-4 h-auto font-semibold hover:bg-accent/50 transition-colors rounded-lg"
                    >
                      {adminLabel}
                      {isAdminDropdownOpen ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 mt-1">
                    {visibleAdminLinks.map((link) => (
                      <SheetClose key={link.href} asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-base py-2 px-6 h-auto hover:bg-accent/50 transition-colors rounded-lg"
                          asChild
                        >
                          <Link href={link.href}>{link.title}</Link>
                        </Button>
                      </SheetClose>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}

            {/* User Section */}
            {profile ? (
              <div className="mt-auto border-t bg-muted/30">
                <div className="px-6 py-4">
                  <div className="mb-3 mx-4">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-lg text-foreground">
                        {profile.first_name} {profile.last_name}
                      </p>

                      <Badge variant="default" className="text-xs px-2">
                        {faculty}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-1">
                      {profile.email}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      WatIAM: {profile.wat_iam}
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
