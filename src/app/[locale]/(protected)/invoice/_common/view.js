import numberFormatter from "@/utils/NumberFormatter";
import Link from 'next/link';
import style from './view.module.css'
import { getCreditBalance, getInv } from "./actions";
import { formatDate } from "@/utils/dateFormatter";
import RepositoryPermitButton from "./RepositoryPermitButton";
import DeleteButton from "./DeleteButton";
import CompanyDetailsHead from "@/components/CompanyDetailsHead";
import EventNotFound from "@/components/NotFound";


const InvoicePrintableView = async ({ id, type }) => {
    const invoice = (await getInv(type, id, 'from view')).data
    const ownerData = (await getCreditBalance(invoice.owner, invoice.issue_date, 'from view')).data;
    const typePrefix = type.includes('sales') ? 's_invoice_items' : 'p_invoice_items';
    const isRefund = type.split('/')[1] || false;


    if (! invoice?.id) return <EventNotFound eventId={id} />


    // Get status text
    const getStatusText = (statusCode) => {
        const statuses = {
            1: "Draft",
            3: "UnPaid",
            9: "Refund"
        };
        return statuses[statusCode] || "Unknown";
    };

    // Get status class
    const getStatusClass = (statusCode) => {
        const classes = {
            1: "status-draft",
            3: "status-unpaid",
            9: "status-refund"
        };
        return classes[statusCode] || "status-draft";
    };

    
    const tax = invoice[`${typePrefix}`]?.reduce((acc, item) => parseFloat(acc) + parseFloat(item.tax_rate), 0);
    const discount = invoice[typePrefix]?.reduce((acc, item) => parseFloat(acc) + parseFloat(item.discount), 0);
    let credit = ownerData.credit && ownerData.credit > 0 ? parseFloat(ownerData.credit) : 0
    credit -= Number(invoice.total_amount)
    credit += ownerData?.paid || 0 
    const subTotal = invoice[typePrefix]?.reduce((acc, item) => parseFloat(acc) + (parseFloat(item.unit_price) * parseFloat(item.quantity)), 0);

    return (
        <div id="printarea" className={`p-4 ${style['invoice-container']}`}>
            {/* Controls - Only visible on screen */}
            <div className={`pr-4 pb-4 shadow-[8px_8px_8px_-5px_rgba(0,0,0,0.3)] print-custom-shadow`}>
                {! isRefund && (
                    <div className={`${style['invoice-controls']} none-printable`}>
                        <Link href={`/invoice/${type}/form/${invoice.hashed_id}`} className={`${style['edit-link']}`}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                            Edit Invoice
                        </Link>
                        <Link href={`/invoice/${type}/refund/form/${invoice.hashed_id}`} className={`${style['edit-link']}`}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                            Refund Invoice
                        </Link>
                
                        <RepositoryPermitButton id={invoice.id} type={type} permitValue={invoice.repository_permit} />
                        <DeleteButton type={type} hashed_id={invoice.hashed_id} isDeleteFromView={true} />
                    </div>
                )}
                {/* Header */}
                <CompanyDetailsHead>
                    <div className="mx-auto text-base text-black">
                        <h1 className={`text-xl font-bold font-serif`}>{type.includes('sales') ? isRefund ? `SALES REFUND INVOICE` : 'ORDER' : 'PURCHASE INVOICE'}</h1>
                        <Link href={`/customer-supplier/view/${invoice.owner}`}>
                            <p className={`text-sm font-serif wrap-break-word break-all whitespace-normal max-w-57`}>Receiver: <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm text-blue-600 hover:text-blue-500 group transition-colors dark:text-blue-400 dark:hover:text-blue-300 text-xs">{invoice.owner_name}</span></p>
                        </Link>
                        {ownerData?.address && <p className={`text-sm font-serif pl-1 wrap-break-word break-all whitespace-normal max-w-57`}><span className="text-xs text-gray-500">{ownerData?.addressDetails + ownerData?.address}</span></p>}
                        <p className={`text-sm font-serif`}>{isRefund ? 'Refund': 'Order'} No: <span className="text-xs text-gray-500">#{invoice.hashed_id}</span></p>
                        <p className={`text-sm font-serif none-printable`}>Created by: <span className="text-xs text-gray-500">{invoice.by_username}</span></p>
                        <p className={`text-sm font-serif`}>Issued: <span className="text-xs text-gray-500">{formatDate(invoice.issue_date)}</span></p>
                        <p className={`text-sm font-serif`}>Total Amount: <span className="text-xs text-gray-500">{invoice.total_amount}</span></p>
                        <div className={`${style['invoice-status']} ${style[getStatusClass(invoice.status)]} none-printable`}>
                            {getStatusText(invoice.status)}
                        </div>
                    </div>
                </CompanyDetailsHead>
                
                {/* Items Table */}
                <table className={`${style['invoice-table']}`}>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Qty</th>
                            <th>unit_price</th>
                            {/* <th>Tax<!--Rate--></th> */}
                            <th>Tax</th>
                            <th>Discount</th>
                            <th>Line total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice[typePrefix]?.map((item, index) => (
                            <tr key={item.id || index}>
                                <td>
                                    <div className={`${style['item-name']}`}>{item.item_name?.split('##')[0]}</div>
                                    {item.description && <div className={`${style['item-description']}`}>{item.description}</div>}
                                </td>
                                <td>{numberFormatter(item.quantity)}</td>
                                <td>{numberFormatter(item.unit_price)}</td>
                                <td>{numberFormatter(item.tax_rate)}</td>
                                <td>{numberFormatter(item.discount)}</td>
                                <td>{numberFormatter(item.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Summary */}
                <div className={`${style['invoice-summary']}`}>
                    <div className={`${style['summary-container']}`}>
                        <div className={`${style['summary-row']}`}>
                            <span className={`${style['summary-label']}`}>Subtotal:</span>
                            <span className={`${style['summary-value']}`}>{numberFormatter(subTotal * (isRefund ? -1 : 1))}</span>
                        </div>
                        {tax > 0 && (
                            <div className={`${style['summary-row']}`}>
                                <span className={`${style['summary-label']}`}>Tax:</span>
                                <span className={`${style['summary-value']}`}>{numberFormatter(tax)}</span>
                            </div>
                        )}
                        {discount > 0 && (
                            <div className={`${style['summary-row']}`}>
                                <span className={`${style['summary-label']}`}>Discount:</span>
                                <span className={`${style['summary-value']}`}>-{numberFormatter(discount)}</span>
                            </div>
                        )}
                        {credit !== 0 && (
                            <div className={`${style['summary-row']}`}>
                                <span className={`${style['summary-label']}`}>Old Credit Balance:</span>
                                <span className={`${style['summary-value']}`}>{numberFormatter(credit)}</span>
                            </div>
                        )}
                        {ownerData?.paid !== 0 && (
                            <div className={`${style['summary-row']}`}>
                                <span className={`${style['summary-label']}`}>Paid:</span>
                                <span className={`${style['summary-value']}`}>-{numberFormatter(ownerData?.paid)}</span>
                            </div>
                        )}
                        <div className={`${style['summary-row']} ${style['summary-total']}`}>
                            <span>Remaining Credit Balance:</span>
                            <span>{numberFormatter(parseFloat(invoice.total_amount * (isRefund ? -1 : 1)) + credit - ownerData?.paid)}</span>
                        </div>
                        {/* <div className={`${style['summary-row summary-amount-due']}`}>
                            <span>Amount due</span>
                            <span className={`${style['summary-value']}`}>{invoice.remaining_balance || invoice.total_amount}</span>
                        </div> */}
                    </div>
                </div>
                {invoice.notes && (
                    <div className={`${style['notes-section']}`}>
                        <h3 className={`${style['notes-title']}`}>Notes:</h3>
                        <pre className={`${style['notes-content']}`}>{invoice.notes}</pre>
                    </div>
                )}
                {/* Payment Info */}
                <div className={`${style['payment-info']}`}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="font-serif">Please pay within 3 days of receiving this order.</span>
                </div>
                
                {/* Footer */}
                <div className={`${style['invoice-footer']} font-serif`}>
                    <p>Thank you for your business!</p>
                    <p>Generated on {new Date(invoice.created_at).toString().split(' GMT')[0]}</p>
                </div>
            </div>
        </div>
    );
};

export default InvoicePrintableView;