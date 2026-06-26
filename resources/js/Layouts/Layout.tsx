import { Head } from "@inertiajs/react";
import { useState, type ReactNode } from "react";
import { usePage, router } from "@inertiajs/react";

import { SidebarProvider, SidebarTrigger, useSidebar } from "@/Components/ui/sidebar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/Components/ui/sheet";
import { toast } from "sonner";
import { Toaster } from "@/Components/ui/sonner";

import AppSidebar from "@/Components/AppSidebar";
import AuthComponent from "@/Components/Auth/AuthComponent";
import { TooltipProvider } from "@/Components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import type { SharedProps } from "@/Types/types";

type LayoutProps = {
  title?: string;
  children: ReactNode;
}

export default function Layout({ title, children }: LayoutProps) {
  const [isAuthSheetOpen, setIsAuthSheetOpen] = useState(false);
  const isDesktop = !useIsMobile();
  const { sidebar } = usePage<SharedProps>().props;
  const [isSidebarOpen, setIsSidebarOpen] = useState(sidebar.state);
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const handleLogout = () => {
    router.post('/logout', {}, {
      onSuccess: () => {
        toast.success('Logged out successfully');
      },
      onError: (error) => {
        toast.error('Logout failed');
      }
    });
  }

  const handleLoginSuccess = () => {
    setIsAuthSheetOpen(false);
    const msg = mode === 'login' ? 'Logged in successfully' : 'Registered successfully, welcome aboard!';
    toast.success(msg);
  }

  const handleAuthSheetOpen = () => {
    // Dismiss the sidebar when the auth sheet is opened
    if (!isAuthSheetOpen && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
    setIsAuthSheetOpen(true);
  }

  const authComponent = <AuthComponent onSuccess={handleLoginSuccess} onModeChange={setMode} />;

  return (
    <>
      <Head title={title ?? "Where2Buy"} />
      <TooltipProvider>
        <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen} >
          <AppSidebar onLoginClick={handleAuthSheetOpen} onLogoutClick={handleLogout} />
          <main className="root bg-muted flex flex-col w-screen h-screen">
            {/* Full-width header with sidebar trigger and app title */}
            <div className="h-16 bg-white shadow-sm flex items-center px-4 shrink-0">
              <SidebarTrigger variant="outline" />
              <h1 className="text-xl font-bold ml-4">Where2Buy</h1>
            </div>
            <section className="flex-1 min-h-0 p-0 overflow-y-auto">{children}</section>
            <Toaster />
          </main>
        </SidebarProvider>
      </TooltipProvider>
      {/* Bottom sheet if mobile, center dialog box if desktop */}
      {isDesktop
        ? ( // Dialog
          <Dialog open={isAuthSheetOpen} onOpenChange={setIsAuthSheetOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="py-2 border-b-2 border-black/10">
                  {mode === 'login' ? 'Login' : 'Register'}
                </DialogTitle>
              </DialogHeader>
              {authComponent}
            </DialogContent>
          </Dialog>
        )
        : ( // Bottom Sheet
          <Sheet open={isAuthSheetOpen} onOpenChange={setIsAuthSheetOpen}>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>
                  {mode === 'login' ? 'Login' : 'Register'}
                </SheetTitle>
              </SheetHeader>
              {authComponent}
            </SheetContent>
          </Sheet>
        )}
    </>
  );
}
