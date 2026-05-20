import type { ReactNode } from "react";

type LayoutProps = {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (
        <main className="min-h-screen bg-gray-100 p-4">
            <header>

            </header>
            <article>{children}</article>
        </main>
    );
}
