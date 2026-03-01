import { useState } from 'react';
import { fakeClaims, fakePolicies, fakeUsers } from '../../data/fakeData';
// import api from '../../services/api';
import type { Claim, ClaimStatus, Policy, User } from '../../types';

const ClaimList = () => {
    const [claims, setClaims] = useState<Claim[]>(fakeClaims);
    const [policies] = useState<Policy[]>(fakePolicies);
    const [users] = useState<User[]>(fakeUsers);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [loading] = useState(false);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const [claimsRes, policiesRes, usersRes] = await Promise.all([
    //                 api.get('/claims'),
    //                 api.get('/policies'),
    //                 api.get('/users')
    //             ]);
    //             setClaims(claimsRes.data);
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

    const filteredClaims = claims.filter(c => !statusFilter || c.status === statusFilter);

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to remove this claim?')) {
            setClaims(claims.filter(c => c.claim_id !== id));
        }
    };

    const handleUpdateStatus = (id: number, newStatus: ClaimStatus) => {
        if (window.confirm(`Are you sure you want to mark this claim as ${newStatus}?`)) {
            setClaims(claims.map(c => c.claim_id === id ? { ...c, status: newStatus } : c));
        }
    };

    const getStatusBadge = (status: ClaimStatus) => {
        switch (status) {
            case 'Approved': return <span className="badge badge-success">Approved</span>;
            case 'Under Review': return <span className="badge badge-warning">Reviewing</span>;
            case 'Rejected': return <span className="badge badge-danger">Rejected</span>;
            case 'Submitted': return <span className="badge badge-primary">Submitted</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    const getUserName = (id: number) => users.find(u => u.user_id === id)?.full_name || 'Unknown';
    const getPolicyNum = (id: number) => policies.find(p => p.policy_id === id)?.policy_number || 'Unknown';

    if (loading) {
        return <div className="p-5 text-center">Loading claims...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-[28px] font-extrabold text-slate-800 mb-2">Claims Management</h1>
                    <p className="text-slate-500 text-[15px]">Process and review insurance claims submitted by customers</p>
                </div>
            </div>

            <div className="glass-card p-5 mb-6 bg-white border border-slate-200">
                <select className="select w-[200px]" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            <div className="glass-card table-container bg-white border border-slate-200">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="bg-slate-50">Claim ID</th>
                            <th className="bg-slate-50">Policy</th>
                            <th className="bg-slate-50">Customer</th>
                            <th className="bg-slate-50">Amount</th>
                            <th className="bg-slate-50">Reason</th>
                            <th className="bg-slate-50">Date</th>
                            <th className="bg-slate-50">Status</th>
                            <th className="text-right bg-slate-50">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClaims.map((c) => (
                            <tr key={c.claim_id}>
                                <td><span className="font-semibold text-slate-600">#CLM-{c.claim_id.toString().padStart(4, '0')}</span></td>
                                <td><span className="font-bold text-blue-600">{getPolicyNum(c.policy_id)}</span></td>
                                <td>{getUserName(c.user_id)}</td>
                                <td className="font-bold text-slate-800">${c.claim_amount.toLocaleString()}</td>
                                <td className="text-[13px] max-w-[200px] truncate">{c.reason}</td>
                                <td>{new Date(c.claim_date).toLocaleDateString()}</td>
                                <td>{getStatusBadge(c.status)}</td>
                                <td>
                                    <div className="flex justify-end gap-2">
                                        {c.status === 'Submitted' && (
                                            <button className="btn btn-warning btn-sm" onClick={() => handleUpdateStatus(c.claim_id, 'Under Review')}>Review</button>
                                        )}
                                        {(c.status === 'Submitted' || c.status === 'Under Review') && (
                                            <>
                                                <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(c.claim_id, 'Approved')}>Approve</button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleUpdateStatus(c.claim_id, 'Rejected')}>Reject</button>
                                            </>
                                        )}
                                        <button className="btn btn-danger btn-sm p-1.5" onClick={() => handleDelete(c.claim_id)}>
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

export default ClaimList;
