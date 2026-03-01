import { useAuth } from '../../context/AuthContext';
import { fakePayments, fakePolicies } from '../../data/fakeData';

const MyPayments = () => {
    const { user } = useAuth();
    const myPayments = fakePayments.filter(p => p.user_id === user?.user_id);

    const statusColors: Record<string, string> = {
        'Success': 'bg-emerald-100 text-emerald-700',
        'Failed': 'bg-red-100 text-red-700',
        'Pending': 'bg-amber-100 text-amber-700',
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                💳 My Payments
            </h1>

            {myPayments.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center border border-slate-200 shadow-sm">
                    <p className="text-5xl mb-4">💸</p>
                    <p className="text-slate-500 text-lg font-medium">No payment history found.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b-2 border-slate-100">
                                    {['Policy', 'Date', 'Amount', 'Method', 'Reference', 'Status'].map(h => (
                                        <th key={h} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {myPayments.map(payment => {
                                    const policy = fakePolicies.find(p => p.policy_id === payment.policy_id);
                                    const statusClass = statusColors[payment.status] || 'bg-slate-100 text-slate-600';
                                    return (
                                        <tr key={payment.payment_id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-900">{policy?.policy_number || 'N/A'}</td>
                                            <td className="px-6 py-4 text-slate-600">{payment.payment_date}</td>
                                            <td className="px-6 py-4 font-bold text-slate-900">${payment.amount_paid}</td>
                                            <td className="px-6 py-4 text-slate-600">{payment.payment_method || 'N/A'}</td>
                                            <td className="px-6 py-4 text-slate-400 font-mono text-xs">{payment.transaction_reference || '—'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${statusClass}`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPayments;
