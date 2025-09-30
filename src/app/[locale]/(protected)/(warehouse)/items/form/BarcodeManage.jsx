import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { TextInput } from '@/components/inputs';


export default function BarcodeManager({ defaultBarcodes = [], onChange = () => { } }) {
    const [barcodes, setBarcodes] = useState(
        defaultBarcodes.map(b => ({
            id: b.id,
            barcode: b.barcode,
            tempId: b.id || crypto.randomUUID()
        }))
    );

    const addBarcode = () => {
        const newBarcode = { 
            barcode: '', 
            tempId: crypto.randomUUID()
        };
        const newBarcodes = [...barcodes, newBarcode];
        setBarcodes(newBarcodes);
        onChange(newBarcodes);
    };

    const updateBarcode = (tempId, value) => {
        const newBarcodes = barcodes.map((b) => {
            if (b.tempId === tempId) {
                return { ...b, barcode: value };
            }
            return b;
        });
        setBarcodes(newBarcodes);
        onChange(newBarcodes);
    };

    const removeBarcode = (tempId) => {
        const newBarcodes = barcodes.filter((b) => b.tempId !== tempId);
        setBarcodes(newBarcodes);
        onChange(newBarcodes);
    };

    return (
        <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-800 dark:text-white">
                    Barcodes
                </span>
                <button
                    type="button"
                    onClick={addBarcode}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 
                             hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-md transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add Barcode
                </button>
            </div>

            <div className="space-y-2">
                {barcodes.map((item, index) => (
                    <div key={item?.id || item.tempId} className="flex items-center gap-2">
                        <input type="hidden" name={`barcodes[${index}].id`} value={item.id || ''} />
                        <div className="flex-1">
                            <TextInput
                                name={`barcodes[${index}].barcode`}
                                defaultValue={item.barcode}
                                onChange={(e) => updateBarcode(item.tempId, e.target.value)}
                                placeholder="Enter barcode"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeBarcode(item.tempId)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}