import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Club VIP & Beneficios Exclusivos | Gaz La Guía',
    description: 'Accede a beneficios exclusivos, invitaciones a eventos privados y atención prioritaria al unirte a nuestro Club VIP.',
    openGraph: {
        title: 'Club VIP & Beneficios Exclusivos | Gaz La Guía',
        description: 'Accede a beneficios exclusivos y atención prioritaria.',
    }
};

export default function VipLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
