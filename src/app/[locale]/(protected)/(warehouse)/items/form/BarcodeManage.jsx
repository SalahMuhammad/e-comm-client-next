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
<div className="mt-6 mb-6">
  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    {/* Header */}
    <div className="flex items-center justify-between px-5 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Barcodes
      </h3>
      <button
        type="button"
        onClick={addBarcode}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm hover:shadow"
      >
        <PlusIcon className="w-4 h-4" />
        Add Barcode
      </button>
    </div>

    {/* Barcode List */}
    <div className="p-5 pt-3 space-y-3">
      {barcodes.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No barcodes added yet. Click "Add Barcode" to get started.</p>
        </div>
      ) : (
        barcodes.map((item, index) => (
          <div 
            key={item?.id || item.tempId} 
            className="flex items-center gap-1 transition-colors"
          >
            <input type="hidden" name={`barcodes[${index}].id`} value={item.id || ''} />
            
            <div className="flex-1">
              <TextInput
                name={`barcodes[${index}].barcode`}
                defaultValue={item.barcode}
                onChange={(e) => updateBarcode(item.tempId, e.target.value)}
                placeholder="Enter barcode"
                className="w-full"
              />
            </div>
            
            <button
              type="button"
              onClick={() => removeBarcode(item.tempId)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-300"
              aria-label="Remove barcode"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        ))
      )}
    </div>
  </div>
</div>
    );
}