import { useEffect } from 'react';

export function useBodyScrollLock(isLocked: boolean) {
    useEffect(() => {
        if (!isLocked) return;

        // Save original overflow
        const originalStyle = window.getComputedStyle(document.body).overflow;

        // Prevent scrolling
        document.body.style.overflow = 'hidden';

        return () => {
            // Restore original overflow
            document.body.style.overflow = originalStyle;
        };
    }, [isLocked]);
}
