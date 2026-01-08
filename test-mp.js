const { MercadoPagoConfig, Preference } = require('mercadopago');

// Credentials from .env.local (Manual copy for testing)
const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-8373811930653984-010810-efb88eab34e546d3138a4ea59cb736f1-3119301061'
});

async function testPreference() {
    console.log("Testing Mercado Pago Preference Creation (NO AUTO_RETURN)...");
    try {
        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: 'test-item',
                        title: 'Test Course',
                        unit_price: 100,
                        quantity: 1,
                    }
                ],
                back_urls: {
                    success: 'https://aurora-academy-test.com/success', // Mock HTTPS
                    failure: 'https://aurora-academy-test.com/failure',
                    pending: 'https://aurora-academy-test.com/pending',
                },
                // Removed auto_return to test if that's the blocker
            }
        });
        console.log("SUCCESS! Preference ID:", result.id);
        console.log("Init Point:", result.init_point);
    } catch (error) {
        console.error("FAILURE! Error creating preference:", error);
    }
}

testPreference();
