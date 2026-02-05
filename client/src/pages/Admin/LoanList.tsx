import { useState, useEffect } from 'react';
import { fakeLoans, fakePolicies, fakeUsers } from '../../data/fakeData';
// import api from '../../services/api';
import type { PolicyLoan, LoanStatus, Policy, User } from '../../types';

const LoanList = () => {
    const [loans, setLoans] = useState<PolicyLoan[]>(fakeLoans);
    const [policies, setPolicies] = useState<Policy[]>(fakePolicies);
    const [users, setUsers] = useState<User[]>(fakeUsers);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const [loansRes, policiesRes, usersRes] = await Promise.all([
    //                 api.get('/policyloans'),
    //                 api.get('/policies'),
    //                 api.get('/users')
    //             ]);
    //             setLoans(loansRes.data);
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
        if (window.confirm('Cancel this loan request?')) {
            setLoans(loans.filter(l => l.loan_id !== id));
        }
    };

    const handleUpdateStatus = (id: number, newStatus: LoanStatus) => {
        if (window.confirm(`Mark this loan as ${newStatus}?`)) {
            setLoans(loans.map(l => l.loan_id === id ? { ...l, loan_status: newStatus } : l));
        }
    };

    const getStatusBadge = (status: LoanStatus) => {
        switch (status) {
            case 'Approved': return <span className="badge badge-success">Approved</span>;
            case 'Requested': return <span className="badge badge-warning">Requested</span>;
            case 'Rejected': return <span className="badge badge-danger">Rejected</span>;
            case 'Repaid': return <span className="badge badge-primary">Repaid</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    const getUserName = (id: number) => users.find(u => u.user_id === id)?.full_name || 'Unknown';
    const getPolicyNum = (id: number) => policies.find(p => p.policy_id === id)?.policy_number || 'Unknown';

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading loans...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Policy Loans</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Manage loan requests and repayments secured by active policies</p>
                </div>
            </div>

            <div className="glass-card table-container" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ background: '#f8fafc' }}>Loan ID</th>
                            <th style={{ background: '#f8fafc' }}>Policy</th>
                            <th style={{ background: '#f8fafc' }}>Customer</th>
                            <th style={{ background: '#f8fafc' }}>Loan Amount</th>
                            <th style={{ background: '#f8fafc' }}>Interest</th>
                            <th style={{ background: '#f8fafc' }}>Applied</th>
                            <th style={{ background: '#f8fafc' }}>Status</th>
                            <th style={{ textAlign: 'right', background: '#f8fafc' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((l) => (
                            <tr key={l.loan_id}>
                                <td><span style={{ fontWeight: 600, color: '#475569' }}>#LN-{l.loan_id.toString().padStart(4, '0')}</span></td>
                                <td><span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{getPolicyNum(l.policy_id)}</span></td>
                                <td>{getUserName(l.user_id)}</td>
                                <td style={{ fontWeight: 700, color: '#1e293b' }}>${l.loan_amount.toLocaleString()}</td>
                                <td>{l.interest_rate}%</td>
                                <td>{new Date(l.application_date).toLocaleDateString()}</td>
                                <td>{getStatusBadge(l.loan_status)}</td>
                                <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        {l.loan_status === 'Requested' && (
                                            <>
                                                <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(l.loan_id, 'Approved')}>Approve</button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleUpdateStatus(l.loan_id, 'Rejected')}>Reject</button>
                                            </>
                                        )}
                                        {l.loan_status === 'Approved' && (
                                            <button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(l.loan_id, 'Repaid')}>Mark Repaid</button>
                                        )}
                                        <button className="btn btn-danger btn-sm" style={{ padding: '6px' }} onClick={() => handleDelete(l.loan_id)}>
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

export default LoanList;
