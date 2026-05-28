import { SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar";
import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";

import AppSidebar from "@/Components/AppSidebar";

type LayoutProps = {
  title?: string;
  children: ReactNode
}

export default function Layout({ title, children }: LayoutProps) {
  return (
    <>
      <Head title={title ?? "Where2Buy"} />
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full bg-gray-100 p-4">
            <SidebarTrigger />
            <section>{children}</section>
        </main>
      </SidebarProvider>
    </>
  );
}
