import RefillableCostAnalysis from "./RefillableItemsCostAnalysis";
import { getData, getItemTransformerList, getOreItems } from "./actions";


export default async function ScatterChart({ searchParams }) {
    const params = await searchParams
    const res = await getData(
Object.keys(params).length ? `?from=${params['RCA-date-range-from'] || ''}
&to=${params['RCA-date-range-to'] || ''}
&refilled=${params['RCA-refilled'] || ''}
&used=${params['RCA-used'] || ''}` 
: ''
    );
    const res2 = await getItemTransformerList()
    const oreItems = await getOreItems()

    return <RefillableCostAnalysis 
            data={res?.data || []} 
            itemTransformar={res2.data}
            oreItems={oreItems.data}
            compact={true} 
            className="mb-3" 
        />;
}