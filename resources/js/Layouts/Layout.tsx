import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";

type LayoutProps = {
  title?: string;
  children: ReactNode
}

export default function Layout({ title, children }: LayoutProps) {
  return (
    <>
      <Head title={title ?? "Where2Buy"} />
      <main className="min-h-screen bg-gray-100 p-4">
        <section>{children}</section>
      </main>
    </>
  );
}
