/**
 * Logic for handling plan Upgrades and Downgrades with proration.
 */

interface MigrationCalculation {
    remainingValueCurrent: number;
    valueNewPlanProrated: number;
    chargeAmount: number;
    isUpgrade: boolean;
}

export function calculateSubscriptionMigration(params: {
    currentPlanPrice: number;
    newPlanPrice: number;
    startDate: Date | string;
    isAnnual: boolean;
}): MigrationCalculation {
    const start = new Date(params.startDate);
    const now = new Date();

    const totalDays = params.isAnnual ? 365 : 30;

    // Calculate days used
    const diffInMs = now.getTime() - start.getTime();
    const daysUsed = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // Safety check: if daysUsed > totalDays, consider it fully used
    const safeDaysUsed = Math.min(daysUsed, totalDays);
    const daysRemaining = Math.max(0, totalDays - safeDaysUsed);

    // Calculate remaining value of the current plan
    const remainingValueCurrent = (params.currentPlanPrice / totalDays) * daysRemaining;

    // Calculate the value of the new plan for the remaining time
    const valueNewPlanProrated = (params.newPlanPrice / totalDays) * daysRemaining;

    const isUpgrade = params.newPlanPrice > params.currentPlanPrice;

    // If it's an upgrade, the charge is the difference between the prorated new price and the remaining current value
    const chargeAmount = Math.max(0, valueNewPlanProrated - remainingValueCurrent);

    return {
        remainingValueCurrent: Math.round(remainingValueCurrent),
        valueNewPlanProrated: Math.round(valueNewPlanProrated),
        chargeAmount: Math.round(chargeAmount),
        isUpgrade
    };
}

/**
 * Business Rule: Check if migration is allowed.
 * Downgrades are not allowed mid-cycle for installment plans.
 */
export function isMigrationAllowed(params: {
    isUpgrade: boolean;
    hasActiveInstallments: boolean;
}): boolean {
    if (!params.isUpgrade && params.hasActiveInstallments) {
        return false; // Downgrade not allowed with active installments
    }
    return true;
}
