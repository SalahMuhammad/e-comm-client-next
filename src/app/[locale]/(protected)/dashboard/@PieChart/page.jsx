import PieChartView from "@/components/dashboard/charts/PieChart";
import { getCashAndDeferredPercentages } from "./actions"
export default async function PieChart() {
    const res = await getCashAndDeferredPercentages();

    const ordersTotalAmount = res.data.total_orders;
    const totalRemaining = res.data.total_remaining;
    const defferdPresentage = (totalRemaining / ordersTotalAmount) * 100
    const cashPresentage = 100 - defferdPresentage

    const transformed = [
        { name: 'Defferd', value: defferdPresentage },
        { name: 'Cash', value: cashPresentage }
    ];

    return <PieChartView chartData={transformed} className="w-full border rounded-md mb-3" />;
}
