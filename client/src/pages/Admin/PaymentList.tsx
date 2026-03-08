import { useState } from 'react';
import { fakePayments, fakePolicies, fakeUsers } from '../../data/fakeData';
// import api from '../../services/api';
import type { PremiumPayment, PaymentStatus, Policy, User } from '../../types';
import DeleteConfirm from '../../components/DeleteConfirm';

const PaymentList = () => {
    const [payments, setPayments] = useState<PremiumPayment[]>(fakePayments);
    const [policies] = useState<Policy[]>(fakePolicies);
    const [users] = useState<User[]>(fakeUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading] = useState(false);

    // Deletion states
    const [successMessage, setSuccessMessage] = useState<string>('');

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const [paymentsRes, policiesRes, usersRes] = await Promise.all([
    //                 api.get('/premiumpayments'),
    //                 api.get('/policies'),
    //                 api.get('/users')
    //             ]);
    //             setPayments(paymentsRes.data);
    //             setPolicies(policiesRes.data);
    //             setUsers(usersRes.data);
    //         } catch (error) {
    //             console.error('Failed to fetch data:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchData();
    // }, []);


    const confirmDelete = (id: number) => {
        setPayments(payments.filter(p => p.payment_id !== id));
        setSuccessMessage('Payment record removed successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const filteredPayments = payments.filter((p) =>
        p.transaction_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.policy_id.toString().includes(searchTerm)
    );

    const getStatusBadge = (status: PaymentStatus) => {
        const baseClass = "px-2.5 py-0.5 rounded-full text-xs font-semibold";
        switch (status) {
            case 'Success': return <span className={`${baseClass} bg-emerald-100 text-emerald-600`}>Success</span>;
            case 'Pending': return <span className={`${baseClass} bg-amber-100 text-amber-600`}>Pending</span>;
            case 'Failed': return <span className={`${baseClass} bg-red-100 text-red-600`}>Failed</span>;
            default: return <span className={`${baseClass} bg-slate-100 text-slate-600`}>{status}</span>;
        }
    };

    const getUserName = (id: number) => users.find(u => u.user_id === id)?.full_name || 'Unknown';
    const getPolicyNum = (id: number) => policies.find(p => p.policy_id === id)?.policy_number || 'Unknown';

    if (loading) {
        return <div className="p-5 text-center">Loading payments...</div>;
    }

    return (
        <div className="relative">
            {/* Global Notification Banner */}
            <div className="fixed top-24 right-6 z-[110] flex flex-col gap-3 min-w-[320px] max-w-md pointer-events-none">
                {successMessage && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-xl shadow-emerald-500/10 flex items-center gap-3 text-emerald-600 animate-in slide-in-from-right duration-500 pointer-events-auto">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold">{successMessage}</p>
                    </div>
                )}
            </div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-[28px] font-extrabold text-slate-800 mb-2">Premium Payments</h1>
                    <p className="text-slate-500 text-[15px]">Track and manage all customer premium transactions</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 mb-6">
                <input
                    type="text"
                    placeholder="Search by Transaction Ref or Policy ID..."
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
                <table className="w-full text-left border-collapse text-[14px]">
                    <thead>
                        <tr>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100 text-left">Transaction Ref</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100 text-left">Policy</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100 text-left">Customer</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100 text-left">Amount</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100 text-left">Date</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100 text-left">Method</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100 text-left">Status</th>
                            <th className="text-right bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.map((p) => (
                            <tr key={p.payment_id}>
                                <td className="p-4 border-b border-slate-50"><span className="font-semibold text-slate-600 text-left">{p.transaction_reference}</span></td>
                                <td className="p-4 border-b border-slate-50"><span className="font-bold text-blue-600 text-left">{getPolicyNum(p.policy_id)}</span></td>
                                <td className="p-4 border-b border-slate-50"><span className="font-medium text-slate-700 text-left">{getUserName(p.user_id)}</span></td>
                                <td className="p-4 border-b border-slate-50 font-bold text-slate-800 text-left">${p.amount_paid.toLocaleString()}</td>
                                <td className="p-4 border-b border-slate-50 text-slate-500 text-left">{new Date(p.payment_date).toLocaleDateString()}</td>
                                <td className="p-4 border-b border-slate-50"><span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 text-left">{p.payment_method}</span></td>
                                <td className="p-4 border-b border-slate-50 text-left">{getStatusBadge(p.status)}</td>
                                <td className="p-4 border-b border-slate-50 text-left">
                                    <div className="flex justify-end">
                                        <DeleteConfirm
                                            onConfirm={() => confirmDelete(p.payment_id)}
                                            title="Delete Record?"
                                            message="Are you sure? This will permanentely remove the transaction history."
                                        >
                                            <button className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                            </button>
                                        </DeleteConfirm>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentList;
