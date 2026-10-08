import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
    title: "Portal Campamento Base | ELENA La Guía",
    description: "Portal interno para las guías del atelier. Consulta tu agenda, fichas técnicas y entregas pendientes.",
    robots: { index: false, follow: false },
};

export const viewport: Viewport = {
    themeColor: '#1A1A1A',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export default function Campamento BaseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans antialiased selection:bg-[#C17F5F]/20 selection:text-[#1A1A1A]">
            {children}
        </div>
    );
}
