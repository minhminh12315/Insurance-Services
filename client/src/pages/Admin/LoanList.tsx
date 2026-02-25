import { useState } from 'react';
import { fakeLoans, fakePolicies, fakeUsers } from '../../data/fakeData';
// import api from '../../services/api';
import type { PolicyLoan, LoanStatus, Policy, User } from '../../types';

const LoanList = () => {
    const [loans, setLoans] = useState<PolicyLoan[]>(fakeLoans);
    const [policies] = useState<Policy[]>(fakePolicies);
    const [users] = useState<User[]>(fakeUsers);
    const [loading] = useState(false);

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
        return <div className="p-5 text-center">Loading loans...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-[28px] font-extrabold text-slate-800 mb-2">Policy Loans</h1>
                    <p className="text-slate-500 text-[15px]">Manage loan requests and repayments secured by active policies</p>
                </div>
            </div>

            <div className="glass-card table-container bg-white border border-slate-200">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="bg-slate-50">Loan ID</th>
                            <th className="bg-slate-50">Policy</th>
                            <th className="bg-slate-50">Customer</th>
                            <th className="bg-slate-50">Loan Amount</th>
                            <th className="bg-slate-50">Interest</th>
                            <th className="bg-slate-50">Applied</th>
                            <th className="bg-slate-50">Status</th>
                            <th className="text-right bg-slate-50">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((l) => (
                            <tr key={l.loan_id}>
                                <td><span className="font-semibold text-slate-600">#LN-{l.loan_id.toString().padStart(4, '0')}</span></td>
                                <td><span className="font-bold text-blue-600">{getPolicyNum(l.policy_id)}</span></td>
                                <td>{getUserName(l.user_id)}</td>
                                <td className="font-bold text-slate-800">${l.loan_amount.toLocaleString()}</td>
                                <td>{l.interest_rate}%</td>
                                <td>{new Date(l.application_date).toLocaleDateString()}</td>
                                <td>{getStatusBadge(l.loan_status)}</td>
                                <td>
                                    <div className="flex justify-end gap-2">
                                        {l.loan_status === 'Requested' && (
                                            <>
                                                <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(l.loan_id, 'Approved')}>Approve</button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleUpdateStatus(l.loan_id, 'Rejected')}>Reject</button>
                                            </>
                                        )}
                                        {l.loan_status === 'Approved' && (
                                            <button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(l.loan_id, 'Repaid')}>Mark Repaid</button>
                                        )}
                                        <button className="btn btn-danger btn-sm p-1.5" onClick={() => handleDelete(l.loan_id)}>
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
