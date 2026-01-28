import { useState } from 'react';
import { apiRequest } from '@/utils/api';
import { toast } from 'sonner';

export default function useBarcodeScanner({
    tScanner,
    handleGenericErrors,
    onConfirm
}) {
    const [barcodeItem, setBarcodeItem] = useState(null);
    const [showBarcodeConfirm, setShowBarcodeConfirm] = useState(false);
    const [barcodeLoading, setBarcodeLoading] = useState(false);
    const [barcodeError, setBarcodeError] = useState(null);

    const handleBarcodeScan = async (barcode) => {
        setBarcodeLoading(true);
        setBarcodeError(null);
        setShowBarcodeConfirm(true);
        setBarcodeItem(null);

        try {
            // Encode the barcode to ensure special characters don't break the URL
            const res = await apiRequest(`/api/items/?barcode=${encodeURIComponent(barcode)}`, {
                method: 'GET'
            });

            setBarcodeLoading(false);

            const noItemMsg = tScanner
                ? `${tScanner('noItemFound')}: ${barcode}`
                : `No item found with barcode: ${barcode}`;

            // Check using the provided error handler
            if (handleGenericErrors && handleGenericErrors(res)) {
                setBarcodeError(noItemMsg);
                return;
            }

            // Fallback check if generic error handler passes or isn't provided but results are empty
            if (!res.data?.results || res.data.results.length === 0) {
                setBarcodeError(noItemMsg);
                return;
            }

            const item = res.data.results[0];
            const formattedItem = {
                value: item.id,
                label: item.name,
                p4: item.price4,
                images: item.images || [],
            };

            setBarcodeItem(formattedItem);
        } catch (error) {
            // console.error("Barcode scan error:", error);
            setBarcodeLoading(false);
            setBarcodeError(tScanner ? tScanner('scanError') : (error.message || 'Error occurred during scan'));
        }
    };

    const handleBarcodeConfirm = () => {
        if (barcodeItem) {
            onConfirm(barcodeItem);
            setShowBarcodeConfirm(false);
            setBarcodeItem(null);

            const successMsg = tScanner ? tScanner('itemSelected') : 'Item selected';
            toast.success(successMsg);
        }
    };

    const handleBarcodeCancel = () => {
        setShowBarcodeConfirm(false);
        setBarcodeItem(null);
        setBarcodeError(null);
    };

    const handleManualSelect = (item) => {
        if (item) {
            setBarcodeItem(item);
            setShowBarcodeConfirm(true);
            setBarcodeError(null);
        }
    };

    return {
        barcodeItem,
        setBarcodeItem,
        showBarcodeConfirm,
        setShowBarcodeConfirm,
        barcodeLoading,
        barcodeError,
        setBarcodeError,
        handleBarcodeScan,
        handleBarcodeConfirm,
        handleBarcodeCancel,
        handleManualSelect
    };
}
