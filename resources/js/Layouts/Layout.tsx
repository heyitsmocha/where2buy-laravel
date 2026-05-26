import type { ReactNode } from "react";

type LayoutProps = {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (
        <main className="min-h-screen bg-gray-100 p-4">
            <section>{children}</section>
        </main>
    );
}
