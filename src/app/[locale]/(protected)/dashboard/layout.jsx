export default function DashboardLayout({ children, ScatterChart }) {
    return (
        <>
            <div>{ScatterChart}</div>
            <div>{children}</div>
        </>
    );
}