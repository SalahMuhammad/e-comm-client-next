import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { URLQueryParameterSetter } from '@/components/inputs/index';
import PaginationControls from '@/components/PaginationControls';
import ErrorLoading from '@/components/ErrorLoading';
import ToolTip from '@/components/ToolTip';

/**
 * GenericDataTable — Universal List Page Server Component
 *
 * One component for ALL list pages. Update styles here → propagates everywhere.
 *
 * @param {Object}   props.searchParams      - Next.js page searchParams
 * @param {Function} props.fetchFn           - async (queryString) => { data: {results, count, next, previous, err}, status }
 * @param {Array}    props.queryParams        - URL params to read, e.g:
 *                                             [{ key: 'limit', default: 12 },
 *                                              { key: 's', default: '', searchLabel: 'Name', inputType: 'text', selectOptions: [] }]
 *                                             Any entry with `searchLabel` appears in the search bar.
 * @param {Array}    props.columns           - Table column definitions:
 *                                             [{ label: 'Name', render: (row) => row.name, hideHeader?: bool }]
 * @param {string}   props.emptyStateKey     - i18n namespace for ErrorLoading empty state
 * @param {React.ReactNode} props.headerSlot - Optional content above the table (e.g. create button)
 * @param {boolean}  props.showTooltip       - If true, auto-appends a ToolTip column (default: true)
 * @param {Function} props.renderList        - Optional override: ({ data, rows }) => JSX. When provided,
 *                                             replaces the built-in table. Still handles fetch/redirect/search/pagination.
 */
export default async function GenericDataTable({
    searchParams,
    fetchFn,
    queryParams = [],
    columns = [],
    emptyStateKey = 'global.errors',
    headerSlot = null,
    showTooltip = true,
    renderList = null,
    queryStringMapper = null,
}) {
    // 1. Read search params
    const params = await searchParams;
    const resolvedParams = {};
    for (const qp of queryParams) {
        resolvedParams[qp.key] = params[qp.key] ?? qp.default ?? '';
    }

    // 2. Build query string
    const parts = [];
    for (const [key, value] of Object.entries(resolvedParams)) {
        if (value !== '' && value !== null && value !== undefined) {
            parts.push(`${key}=${value}`);
        }
    }
    let queryString = `?${parts.join('&')}`;

    if (queryStringMapper) {
        // Allow the component to rewrite the URL query before hitting fetchFn
        queryString = queryStringMapper(queryString);
    }

    // 3. Fetch data
    const res = await fetchFn(queryString);

    // 4. Handle 403/JWT expiry
    if (res?.status === 403 && res.data?.detail?.includes('jwt')) {
        const originalUrl = (await headers()).get('x-original-url') || '';
        redirect(`/auth/logout?nexturl=${originalUrl}`, 'replace');
    }

    const data = res?.data;

    // 5. Build search bar options (only params that have searchLabel)
    const searchParamOptions = queryParams
        .filter(qp => qp.searchLabel)
        .map(qp => ({
            label: qp.searchLabel,
            value: qp.key,
            inputType: qp.inputType,
            selectOptions: qp.selectOptions,
        }));

    // 6. Render
    if (data?.err) {
        return <ErrorLoading name={emptyStateKey} message={data.err} />;
    }

    const rows = data?.results ?? [];

    return (
        <div>
            {/* Search bar */}
            {searchParamOptions.length > 0 && (
                <URLQueryParameterSetter paramOptions={searchParamOptions} />
            )}

            {/* Optional header slot (e.g. "Add" button) */}
            {headerSlot}

            {/* Custom list renderer (e.g. card grid, custom client table) */}
            {renderList ? (
                renderList({ data, rows })
            ) : (
                /* Default table — update styles here, all pages update */
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        {/* thead — update styles here, all pages update */}
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {columns.map((col, i) =>
                                    col.hideHeader ? (
                                        <th key={i} scope="col" className="px-6 py-3" />
                                    ) : (
                                        <th key={i} scope="col" className="px-6 py-3 whitespace-nowrap">
                                            {col.label}
                                        </th>
                                    )
                                )}
                                {showTooltip && <th scope="col" className="px-6 py-3" />}
                            </tr>
                        </thead>

                        {/* tbody — update row styles here, all pages update */}
                        <tbody>
                            {rows.map((row, rowIdx) => (
                                <tr
                                    key={row.id ?? rowIdx}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    {columns.map((col, colIdx) => (
                                        colIdx === 0 ? (
                                            <th
                                                key={colIdx}
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {col.render(row)}
                                            </th>
                                        ) : (
                                            <td key={colIdx} className="px-6 py-4">
                                                {col.render(row)}
                                            </td>
                                        )
                                    ))}
                                    {showTooltip && (
                                        <td className="px-6 py-4">
                                            <ToolTip obj={row} />
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Empty state */}
            {rows.length === 0 && (
                <ErrorLoading
                    name={emptyStateKey}
                    err="nothing"
                    className="w-full transform-translate-x-1/2 flex justify-center items-center bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 p-5 mt-3 rounded"
                />
            )}

            {/* Pagination */}
            <PaginationControls
                resCount={data?.count}
                hasNext={data?.next}
                hasPrev={data?.previous}
            />
        </div>
    );
}
