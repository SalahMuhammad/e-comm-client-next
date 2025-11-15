import { getVultsTotalBalance } from "./actions"



async function page() {
    const res = await getVultsTotalBalance()

    
    return (
        <FinancialDashboard data={res.data} />
    )
}

export default page


function FinancialDashboard({ data }) {

    const formatBalance = (balance) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(balance);
    };

    const getAccountIcon = (name) => {
        if (name.includes('mobile wallet')) return '📱';
        if (name.includes('bank')) return '🏦';
        return '💰';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">
                        Financial Overview
                    </h1>
                    {data.computed_from_transactions && (
                        <p className="text-slate-600 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                            Computed from transactions
                        </p>
                    )}
                </div>

                {/* Total Balance Card */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
                    <p className="text-blue-100 text-sm uppercase tracking-wide mb-2">
                        Total Balance
                    </p>
                    <p className="text-5xl font-bold">
                        {formatBalance(data.total_balance)}
                    </p>
                </div>

                {/* Accounts Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {data.accounts.map((account) => (
                        <div
                            key={account.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-slate-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-3xl">{getAccountIcon(account.name)}</span>
                                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                    ID: {account.id}
                                </span>
                            </div>

                            <h3 className="text-slate-800 font-semibold mb-3 capitalize">
                                {account.name}
                            </h3>

                            <div className="border-t border-slate-200 pt-3">
                                <p className="text-2xl font-bold text-slate-900">
                                    {formatBalance(account.balance)}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {((parseFloat(account.balance) / parseFloat(data.total_balance)) * 100).toFixed(1)}% of total
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Stats */}
                <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                Total Accounts
                            </p>
                            <p className="text-2xl font-bold text-slate-800">
                                {data.accounts.length}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                Active Accounts
                            </p>
                            <p className="text-2xl font-bold text-slate-800">
                                {data.accounts.filter(a => parseFloat(a.balance) > 0).length}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                Highest Balance
                            </p>
                            <p className="text-2xl font-bold text-slate-800">
                                {formatBalance(Math.max(...data.accounts.map(a => parseFloat(a.balance))))}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                Status
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                                {data.success ? '✓' : '✗'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
