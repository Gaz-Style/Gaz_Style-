import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Costuras, Arreglos y Modificaciones | Gaz La Guía',
    description: 'Arreglos de ropa, bastas, entalles y modificaciones de prendas. Resultados perfectos con terminaciones de calidad.',
    openGraph: {
        title: 'Costuras y Arreglos de Ropa | Gaz La Guía',
        description: 'Bastas, entalles y modificaciones de prendas con calidad garantizada.',
    }
};

export default function CosturasLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
