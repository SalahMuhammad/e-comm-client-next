import PieChartView from "@/components/dashboard/charts/PieChart";
import { getPayments, getSales } from "./actions"
export default async function PieChart() {
    const salesRes = await getSales();
    const paymentsRes = await getPayments();
    const sales = salesRes.data.total;
    const payments = paymentsRes.data.total;
    const defferd = (sales > payments) ? (sales - payments) : 0
    const defferdPresentage = (defferd / sales) * 100
    const cashPresentage = 100 - defferdPresentage
    console.log(defferdPresentage, cashPresentage)

    const transformed = [
        { name: 'Defferd', value: defferdPresentage },
        { name: 'Cash', value: cashPresentage }
    ];

    return <PieChartView chartData={transformed} className="w-full border rounded-md mb-3" />;
}