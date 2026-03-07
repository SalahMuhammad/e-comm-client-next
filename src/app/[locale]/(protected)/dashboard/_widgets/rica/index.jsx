import { getRICAItemTransformerList, getRICAOreItems } from './actions';
import RICAClient from './Client';

export default async function RefillableItemsCostAnalysisWidget() {
    const [transformerRes, oreRes] = await Promise.all([
        getRICAItemTransformerList(),
        getRICAOreItems(),
    ]);

    return (
        <RICAClient
            itemTransformar={transformerRes?.data}
            oreItems={oreRes?.data}
        />
    );
}
