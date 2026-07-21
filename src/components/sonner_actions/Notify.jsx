'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

/**
 * Automatically triggers a toast notification on mount.
 * * <Notify 
 * message="Changes saved successfully" 
 * variant="success" 
 * />
 */
export default function Notify({
    message,
    variant = 'success', // 'success' | 'error' | 'info' | 'warning'
}) {
    useEffect(() => {
        if (message) {
            toast[variant](message);
        }
    }, [message, variant]);

    // This component renders nothing to the UI
    return null;
}
