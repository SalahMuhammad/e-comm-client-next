import PieChartView from "@/components/dashboard/charts/PieChart";
import { getCashAndDeferredPercentages } from "./actions"
import { PermissionGateServer } from "@/components/PermissionGateServer";
import { PERMISSIONS } from "@/config/permissions.config";

export default async function PieChart() {
    const res = await getCashAndDeferredPercentages();

    const sales = res?.data?.total_orders || 0;
    const payments = res?.data?.total_payed || 0;
    const defferd = (sales > payments) ? (sales - payments) : 0
    const defferdPresentage = sales ? ((defferd / sales) * 100) : 0
    const cashPresentage = sales ? (100 - defferdPresentage) : 100

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
