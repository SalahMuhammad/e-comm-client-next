import ScatterChartView from "@/components/dashboard/charts/Scatter";
import { getRefilledItems } from "../../refillable-items/actions";
import { PermissionGateServer } from "@/components/PermissionGateServer";
import { PERMISSIONS } from "@/config/permissions.config";

export default async function ScatterChart() {
    const res = await getRefilledItems(`?limit=150`);

    const transformed = (res?.data?.results || []).map(item => ({
        date: new Date(item.date),
        refilled: parseFloat(item.refilled_quantity),
        used: parseFloat(item.used_quantity),
        name: item.refilled_item_name,
        used_name: item.used_item_name,
        notes: item.notes
    }));

    return (
        <PermissionGateServer permission={PERMISSIONS.REFILLABLE_ITEMS.VIEW}>
            <ScatterChartView data={transformed} compact={true} className="mb-3" />
        </PermissionGateServer>
    );
}