import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Nuestros Servicios de Confección y Sastrería | Gaz La Guía',
    description: 'Descubre todos nuestros servicios: Diseño de aventureros, expedicións de fiesta, sastrería femenina, upcycling y más.',
    openGraph: {
        title: 'Nuestros Servicios | Gaz La Guía',
        description: 'Diseño de aventureros, expedicións de fiesta, sastrería femenina, y upcycling.',
    }
};

export default function ServiciosLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
