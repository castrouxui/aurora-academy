/**
 * Utility for handling refund eligibility based on the strict 24-hour policy.
 */

export function isEligibleForRefund(purchaseDate: Date | string): boolean {
    const purchase = new Date(purchaseDate);
    const now = new Date();

    // Calculate difference in hours
    const diffInMs = now.getTime() - purchase.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    return diffInHours <= 24;
}

/**
 * Calculates the amount to be refunded.
 * For Mercado Pago, usually we refund the total amount of the transaction.
 */
export function calculateRefundAmount(totalPaid: number): number {
    return totalPaid;
}
