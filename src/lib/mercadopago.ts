import MercadoPagoConfig, { Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function createMercadoPagoPreference({
    title,
    unit_price,
    quantity,
    payer_email,
    external_reference,
    back_url_base,
}: {
    title: string;
    unit_price: number;
    quantity: number;
    payer_email: string;
    external_reference: string;
    back_url_base: string;
}) {
    const preference = new Preference(client);

    const result = await preference.create({
        body: {
            items: [
                {
                    id: external_reference,
                    title,
                    quantity,
                    unit_price,
                    currency_id: 'CLP',
                },
            ],
            payer: {
                email: payer_email,
            },
            external_reference,
            back_urls: {
                success: `${back_url_base}/reserva/confirmada`,
                failure: `${back_url_base}/reserva/error`,
                pending: `${back_url_base}/reserva/pendiente`,
            },
            notification_url: `${back_url_base}/api/webhooks/mercadopago`,
        },
    });

    return {
        id: result.id,
        init_point: result.init_point,           // Redirect URL (producción)
        sandbox_init_point: result.sandbox_init_point, // URL (sandbox/testing)
    };
}
