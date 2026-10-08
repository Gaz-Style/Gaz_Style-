import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Expedicións de Graduación a Medida | Gaz La Guía',
    description: 'Diseñamos y confeccionamos tu expedición de graduación soñado. Moldería única para que luzcas increíble en tu fiesta de gala.',
    openGraph: {
        title: 'Expedicións de Graduación a Medida | Gaz La Guía',
        description: 'Diseñamos y confeccionamos tu expedición de graduación soñado.',
    }
};

export default function GraduacionLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
