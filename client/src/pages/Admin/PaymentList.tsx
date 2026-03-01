import { useState } from 'react';
import { fakePayments, fakePolicies, fakeUsers } from '../../data/fakeData';
// import api from '../../services/api';
import type { PremiumPayment, PaymentStatus, Policy, User } from '../../types';

const PaymentList = () => {
    const [payments, setPayments] = useState<PremiumPayment[]>(fakePayments);
    const [policies] = useState<Policy[]>(fakePolicies);
    const [users] = useState<User[]>(fakeUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading] = useState(false);

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

    const handleDelete = (id: number) => {
        if (window.confirm('Delete this payment record?')) {
            setPayments(payments.filter(p => p.payment_id !== id));
        }
    };

    const filteredPayments = payments.filter((p) =>
        p.transaction_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.policy_id.toString().includes(searchTerm)
    );

    const getStatusBadge = (status: PaymentStatus) => {
        switch (status) {
            case 'Success': return <span className="badge badge-success">Success</span>;
            case 'Pending': return <span className="badge badge-warning">Pending</span>;
            case 'Failed': return <span className="badge badge-danger">Failed</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    const getUserName = (id: number) => users.find(u => u.user_id === id)?.full_name || 'Unknown';
    const getPolicyNum = (id: number) => policies.find(p => p.policy_id === id)?.policy_number || 'Unknown';

    if (loading) {
        return <div className="p-5 text-center">Loading payments...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-[28px] font-extrabold text-slate-800 mb-2">Premium Payments</h1>
                    <p className="text-slate-500 text-[15px]">Track and manage all customer premium transactions</p>
                </div>
            </div>

            <div className="glass-card p-5 mb-6 bg-white border border-slate-200">
                <input
                    type="text"
                    placeholder="Search by Transaction Ref or Policy ID..."
                    className="input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="glass-card table-container bg-white border border-slate-200">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="bg-slate-50">Transaction Ref</th>
                            <th className="bg-slate-50">Policy</th>
                            <th className="bg-slate-50">Customer</th>
                            <th className="bg-slate-50">Amount</th>
                            <th className="bg-slate-50">Date</th>
                            <th className="bg-slate-50">Method</th>
                            <th className="bg-slate-50">Status</th>
                            <th className="text-right bg-slate-50">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.map((p) => (
                            <tr key={p.payment_id}>
                                <td><span className="font-semibold text-slate-600">{p.transaction_reference}</span></td>
                                <td><span className="font-bold text-blue-600">{getPolicyNum(p.policy_id)}</span></td>
                                <td><span className="font-medium text-slate-700">{getUserName(p.user_id)}</span></td>
                                <td className="font-bold text-slate-800">${p.amount_paid.toLocaleString()}</td>
                                <td className="text-slate-500">{new Date(p.payment_date).toLocaleDateString()}</td>
                                <td><span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{p.payment_method}</span></td>
                                <td>{getStatusBadge(p.status)}</td>
                                <td>
                                    <div className="flex justify-end">
                                        <button className="btn btn-danger btn-sm p-1.5" onClick={() => handleDelete(p.payment_id)}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                        </button>
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
