import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Portafolio de Diseños y Expedicións | Gaz La Guía',
    description: 'Explora nuestra galería de trabajos: Expedicións de aventurero, trajes de fiesta y sastrería a medida creados en nuestro campamento_base.',
    openGraph: {
        title: 'Portafolio de Diseños | Gaz La Guía',
        description: 'Galería de expedicións de aventurero, trajes de fiesta y sastrería a medida.',
    }
};

export default function PortafolioLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
