"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger, HamburgerIcon } from "@uwdsc/ui";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardSidebar } from "@/components/dashboard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { getApplication } from "@/lib/api/application";

interface DashboardLayoutProps {
  readonly children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<
    string | undefined
  >();

  // Fetch application status
  useEffect(() => {
    async function fetchApplicationStatus() {
      if (!user?.id) return;
      try {
        const data = await getApplication(user.id);
        setApplicationStatus(data?.status as string | undefined);
      } catch (error) {
        console.error("Error fetching application status:", error);
      }
    }
    fetchApplicationStatus();
  }, [user?.id]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/start");
  }, [isLoading, isAuthenticated, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Don't render until we know auth state
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-black cxc-app-font">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col border-r border-white/20 bg-black">
        <DashboardSidebar applicationStatus={applicationStatus} />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/20 bg-black">
        <div className="flex items-center justify-between h-full px-4">
          <span className="text-lg font-medium text-white uppercase tracking-wider">
            CxC Dashboard
          </span>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <button className="p-2 text-white hover:bg-white/10 transition-colors">
                <HamburgerIcon className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 p-0 bg-black border-white/20 rounded-none"
            >
              <DashboardSidebar
                applicationStatus={applicationStatus}
                onNavClick={() => setSidebarOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="pt-16 lg:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={
                globalThis.window === undefined
                  ? ""
                  : globalThis.location.pathname
              }
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-screen"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
