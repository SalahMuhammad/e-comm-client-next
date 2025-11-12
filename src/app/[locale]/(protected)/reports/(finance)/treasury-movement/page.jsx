import CompanyDetailsHead from '@/components/CompanyDetailsHead';
import getFinancialMovements from './actions';



async function FinancialMovementsReport() {
	const res = await getFinancialMovements()
    const data = res.data

    const summary = data?.summary

	const numberFormatter = (num) => {
		return new Intl.NumberFormat('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(num);
	};

	const getStatusBadge = (status) => {
		const statusMap = {
			'Completed': 'bg-green-100 text-green-800',
			'1': 'bg-yellow-100 text-yellow-800',
			'2': 'bg-blue-100 text-blue-800',
			'3': 'bg-red-100 text-red-800',
			'4': 'bg-purple-100 text-purple-800',
		};

		return statusMap[status] || 'bg-gray-100 text-gray-800';
	};

	const getStatusText = (value) => {
		switch (value) {
			case '1':
				return 'pending'
			case '2':
				return 'confirmed'
			case '3':
				return 'rejected'
			case '4':
				return 'reimbursed'
			case 'Completed':
				return value
			default:
				return value
		}
	}

	const fromDate = data?.[data?.length - 1]?.start_date || 'N/A';
	const toDate = data?.[data?.length - 1]?.end_date || 'N/A';

	return (
		<div id="printarea" className="min-w-2xl bg-white">
			<div className="overflow-x-auto shadow-[8px_8px_8px_-5px_rgba(0,0,0,0.3)]">
				<CompanyDetailsHead>
					<div className="mx-auto text-base text-white">
						<h1 className="text-xl font-bold font-serif">
							Financial Movements from {fromDate} to {toDate}
						</h1>
					</div>
				</CompanyDetailsHead>

				<div className="p-6">
					<table className="w-full border-collapse">
						<thead>
							<tr className="bg-gray-50 border-b border-gray-300">
								<th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Reference</th>
								<th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Date</th>
								<th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Type</th>
								<th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Account</th>
								<th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Party</th>
								<th className="text-right py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Amount In</th>
								<th className="text-right py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Amount Out</th>
								<th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Status</th>
								<th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Notes</th>
							</tr>
						</thead>
						<tbody className="bg-white">
							{data?.movements?.map((transaction, index) => (
								<tr
									key={transaction.id}
									className="border-b border-gray-100 odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors"
								>
									<td className="p-4 text-sm text-gray-900 font-mono">
										{transaction.reference}
									</td>
									<td className="p-4 text-sm text-gray-900">
										{transaction.date}
									</td>
									<td className="p-4 text-sm text-gray-900">
										{transaction.type_display}
									</td>
									<td className="p-4 text-sm text-gray-900 capitalize">
										{transaction.account_name}
									</td>
									<td className="p-4 w-[15rem] max-w-[15rem] text-sm text-gray-900">
										{transaction.party}
									</td>
									<td className="p-4 text-sm text-right font-medium text-green-600">
										{transaction.amount_in !== "0.00" ? numberFormatter(transaction.amount_in) : '-'}
									</td>
									<td className="p-4 text-sm text-right font-medium text-red-600">
										{transaction.amount_out !== "0.00" ? numberFormatter(transaction.amount_out) : '-'}
									</td>
									<td className="p-4 text-sm">
										<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(transaction.status)}`}>

											{getStatusText(transaction.status)}
										</span>
									</td>
									<td className="p-4 text-sm whitespace-pre text-gray-700">
										{transaction.notes || '-'}
									</td>
								</tr>
							))}
						</tbody>
						<tfoot className="bg-gray-50 border-t-2 border-gray-300">
							<tr className="font-bold">
								<td colSpan="5" className="p-4 text-sm text-right text-gray-700 uppercase">
									Totals:
								</td>
								<td className="p-4 text-sm text-right font-bold text-green-700">
									{numberFormatter(summary.total_in)}
								</td>
								<td className="p-4 text-sm text-right font-bold text-red-700">
									{numberFormatter(summary.total_out)}
								</td>
								<td colSpan="2" className="p-4 text-sm text-gray-700">
									<span className="font-normal">Net: </span>
									<span className="font-bold text-blue-700">
										{numberFormatter(summary.net_movement)}
									</span>
								</td>
							</tr>
						</tfoot>
					</table>

					<div className="mt-6 p-4 bg-blue-50 rounded-lg">
						<h3 className="font-semibold text-gray-700 mb-2">Summary</h3>
						<div className="grid grid-cols-4 gap-4 text-sm">
							<div>
								<span className="text-gray-600">Total Transactions:</span>
								<span className="ml-2 font-semibold">{summary.count}</span>
							</div>
							<div>
								<span className="text-gray-600">Total In:</span>
								<span className="ml-2 font-semibold text-green-700">{numberFormatter(summary.total_in)}</span>
							</div>
							<div>
								<span className="text-gray-600">Total Out:</span>
								<span className="ml-2 font-semibold text-red-700">{numberFormatter(summary.total_out)}</span>
							</div>
							<div>
								<span className="text-gray-600">Net Movement:</span>
								<span className="ml-2 font-semibold text-blue-700">{numberFormatter(summary.net_movement)}</span>
							</div>
						</div>
					</div>

					<div className="text-center mt-12 text-gray-500 text-xs pb-1">
						<p>Thank you for your business!</p>
						<p>Generated on {new Date().toString().split(' GMT')[0]}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FinancialMovementsReport;