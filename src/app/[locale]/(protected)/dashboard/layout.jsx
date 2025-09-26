export default function DashboardLayout({ children, ScatterChart, PieChart }) {
    return (
        <>
            <div>{ScatterChart}</div>
            <div className="grid grid-cols-8 gap-1 w-full">
                <div className="col-span-8 md:col-span-4 row-span-4">{PieChart}</div>
            </div>
            <div>{children}</div>
        </>
    );
}