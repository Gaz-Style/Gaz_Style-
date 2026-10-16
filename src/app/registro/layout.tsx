import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Registro de Aventureros | Santiago Hiking by Gaz_Style',
    description: 'Únete a nuestra comunidad de montaña. Obtén acceso prioritario a expediciones, salidas al atardecer y grandes desafíos andinos.',
    openGraph: {
        title: 'Registro de Aventureros | Santiago Hiking by Gaz_Style',
        description: 'Únete a la comunidad de Santiago Hiking para acceso prioritario a expediciones de montaña.',
    }
};

export default function RegistroLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
