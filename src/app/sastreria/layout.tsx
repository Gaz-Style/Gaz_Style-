import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sastrería a Medida & Bespoke en Santiago | Gaz La Guía',
    description: 'Sastrería tradicional de alta gama para hombre y mujer. Entalle arquitectónico, trajes a medida, deconstrucción y calce perfecto en nuestro Atelier de Vitacura.',
    openGraph: {
        title: 'Sastrería a Medida & Bespoke | Gaz Style',
        description: 'Sastrería tradicional de alta gama para hombre y mujer en Santiago.',
    }
};

export default function SastreriaLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
