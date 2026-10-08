'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPagar = pathname?.startsWith('/pagar');
    const isPortal = pathname?.startsWith('/portal-aventureros') || pathname?.startsWith('/portal-fiesta');
    const isAdmin = pathname?.startsWith('/admin');
    const isOpiniones = pathname?.startsWith('/opiniones');
    const isCampamento Base = pathname?.startsWith('/campamento_base');
    const hideNavFooter = isPagar || isPortal || isAdmin || isOpiniones || isCampamento Base;

    return (
        <>
            {!hideNavFooter && }
            <main className={!hideNavFooter ? "pt-20 flex-grow" : "flex-grow"}>
                {children}
            </main>
            {!hideNavFooter && <Footer />}
        </>
    );
}
