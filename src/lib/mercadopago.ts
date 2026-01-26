import MercadoPagoConfig, { PreApproval, PaymentRefund } from "mercadopago";

export const getMercadoPagoClient = () => {
    if (!process.env.MP_ACCESS_TOKEN) {
        throw new Error("MP_ACCESS_TOKEN is missing");
    }
    return new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
};

export const cancelSubscription = async (id: string) => {
    try {
        const client = getMercadoPagoClient();
        const preApproval = new PreApproval(client);
        await preApproval.update({
            id: id,
            body: { status: 'cancelled' }
        });
        console.log(`[MP] Subscription ${id} cancelled successfully.`);
        return true;
    } catch (error) {
        console.error(`[MP] Error cancelling subscription ${id}:`, error);
        return false;
    }
};

export const refundPayment = async (paymentId: string) => {
    try {
        const client = getMercadoPagoClient();
        const refund = new PaymentRefund(client);
        await refund.create({ payment_id: paymentId });
        console.log(`[MP] Payment ${paymentId} refunded successfully.`);
        return true;
    } catch (error) {
        console.error(`[MP] Error refunding payment ${paymentId}:`, error);
        return false;
    }
};
