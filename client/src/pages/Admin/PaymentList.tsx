import { useState, useEffect } from 'react';
import { fakePayments, fakePolicies, fakeUsers } from '../../data/fakeData';
// import api from '../../services/api';
import type { PremiumPayment, PaymentStatus, Policy, User } from '../../types';

const PaymentList = () => {
    const [payments, setPayments] = useState<PremiumPayment[]>(fakePayments);
    const [policies, setPolicies] = useState<Policy[]>(fakePolicies);
    const [users, setUsers] = useState<User[]>(fakeUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

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
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading payments...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Premium Payments</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Track and manage all customer premium transactions</p>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <input
                    type="text"
                    placeholder="Search by Transaction Ref or Policy ID..."
                    className="input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="glass-card table-container" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ background: '#f8fafc' }}>Transaction Ref</th>
                            <th style={{ background: '#f8fafc' }}>Policy</th>
                            <th style={{ background: '#f8fafc' }}>Customer</th>
                            <th style={{ background: '#f8fafc' }}>Amount</th>
                            <th style={{ background: '#f8fafc' }}>Date</th>
                            <th style={{ background: '#f8fafc' }}>Method</th>
                            <th style={{ background: '#f8fafc' }}>Status</th>
                            <th style={{ textAlign: 'right', background: '#f8fafc' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.map((p) => (
                            <tr key={p.payment_id}>
                                <td><span style={{ fontWeight: 600, color: '#475569' }}>{p.transaction_reference}</span></td>
                                <td><span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{getPolicyNum(p.policy_id)}</span></td>
                                <td><span style={{ fontWeight: 500, color: '#334155' }}>{getUserName(p.user_id)}</span></td>
                                <td style={{ fontWeight: 700, color: '#1e293b' }}>${p.amount_paid.toLocaleString()}</td>
                                <td style={{ color: '#64748b' }}>{new Date(p.payment_date).toLocaleDateString()}</td>
                                <td><span style={{ fontSize: '12px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>{p.payment_method}</span></td>
                                <td>{getStatusBadge(p.status)}</td>
                                <td style={{ textAlign: 'right' }}>
                                    <button className="btn btn-danger btn-sm" style={{ padding: '6px' }} onClick={() => handleDelete(p.payment_id)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                    </button>
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
