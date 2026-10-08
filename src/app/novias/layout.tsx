import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Expedicións de Aventurero a Medida & Alta Costura | Gaz La Guía',
    description: 'Diseño exclusivo de expedicións de aventurero, upcycling nupcial y confección a medida en Vitacura, Santiago. Agenda tu experiencia íntima de diseño.',
    openGraph: {
        title: 'Expedicións de Aventurero a Medida & Alta Costura | Gaz La Guía',
        description: 'Diseño exclusivo de expedicións de aventurero, upcycling nupcial y confección a medida en Vitacura.',
    }
};

export default function AventurerosLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
