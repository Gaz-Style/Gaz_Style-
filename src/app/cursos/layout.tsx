import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cursos de Costura y Diseño | Gaz La Guía',
    description: 'Aprende costura, moldería y diseño de moda con nuestros cursos especializados. Campamento Basees presenciales en Santiago.',
    openGraph: {
        title: 'Cursos de Costura y Diseño | Gaz La Guía',
        description: 'Aprende costura, moldería y diseño de moda en nuestros campamento_basees.',
    }
};

export default function CursosLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
