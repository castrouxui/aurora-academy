import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, subMonths } from "date-fns";

export type PeriodType = "weekly" | "monthly" | "quarterly" | "semiannual" | "annual" | "historical";

export function getDateRange(period: PeriodType, date: Date = new Date()): { startDate: Date; endDate: Date } {
    switch (period) {
        case "weekly":
            return {
                startDate: startOfWeek(date, { weekStartsOn: 1 }), // Monday start
                endDate: endOfWeek(date, { weekStartsOn: 1 })
            };
        case "monthly":
            return {
                startDate: startOfMonth(date),
                endDate: endOfMonth(date)
            };
        case "quarterly":
            return {
                startDate: startOfQuarter(date),
                endDate: endOfQuarter(date)
            };
        case "semiannual":
            // 0-5 (Jan-Jun), 6-11 (Jul-Dec)
            const month = date.getMonth();
            const year = date.getFullYear();
            if (month < 6) {
                return {
                    startDate: new Date(year, 0, 1),
                    endDate: new Date(year, 5, 30, 23, 59, 59)
                };
            } else {
                return {
                    startDate: new Date(year, 6, 1),
                    endDate: new Date(year, 11, 31, 23, 59, 59)
                };
            }
        case "annual":
            return {
                startDate: startOfYear(date),
                endDate: endOfYear(date)
            };
        case "historical":
            return {
                startDate: new Date(2020, 0, 1), // Reasonably far back
                endDate: new Date()
            };
        default:
            return {
                startDate: startOfMonth(date),
                endDate: endOfMonth(date)
            };
    }
}
