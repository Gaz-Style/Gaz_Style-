import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Preguntas Frecuentes | Gaz La Guía',
    description: 'Resuelve tus dudas sobre reservas, tiempos de confección, precios y modalidades de trabajo en Gaz La Guía.',
    openGraph: {
        title: 'Preguntas Frecuentes | Gaz La Guía',
        description: 'Resuelve tus dudas sobre reservas, tiempos de confección y modalidades de trabajo.',
    }
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
