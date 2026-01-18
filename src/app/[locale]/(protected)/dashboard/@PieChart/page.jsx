import PieChartView from "@/components/dashboard/charts/PieChart";
import { getCashAndDeferredPercentages } from "./actions"
export default async function PieChart() {
    const res = await getCashAndDeferredPercentages();

    const sales = res.data.total_orders;
    const payments = res.data.total_payed;
    const defferd = (sales > payments) ? (sales - payments) : 0
    const defferdPresentage = (defferd / sales) * 100
    const cashPresentage = 100 - defferdPresentage

    const transformed = [
        { name: 'Defferd', value: defferdPresentage },
        { name: 'Cash', value: cashPresentage }
    ];

    return <PieChartView chartData={transformed} className="w-full border rounded-md mb-3" />;
}
