import PieChartView from "@/components/dashboard/charts/PieChart";
import { getCashAndDeferredPercentages } from "./actions"
import { PermissionGateServer } from "@/components/PermissionGateServer";
import { PERMISSIONS } from "@/config/permissions.config";

export default async function PieChart() {
    const res = await getCashAndDeferredPercentages();

    const ordersTotalAmount = res?.data?.total_orders || 0;
    const totalRemaining = res?.data?.total_remaining || 0;

    const defferdPresentage = ordersTotalAmount
    ? (totalRemaining / ordersTotalAmount) * 100
    : 0;

    const cashPresentage = ordersTotalAmount
    ? 100 - defferdPresentage
    : 100;


    const transformed = [
        { name: 'Defferd', value: defferdPresentage },
        { name: 'Cash', value: cashPresentage }
    ];

    return (
        <PermissionGateServer permission={PERMISSIONS.SALES_INVOICES.VIEW}>
            <PieChartView chartData={transformed} className="w-full border rounded-md mb-3" />
        </PermissionGateServer>
    );
}
