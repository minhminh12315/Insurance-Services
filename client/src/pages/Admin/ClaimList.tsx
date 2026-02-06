import { useState, useEffect } from 'react';
import { fakeClaims, fakePolicies, fakeUsers } from '../../data/fakeData';
// import api from '../../services/api';
import type { Claim, ClaimStatus, Policy, User } from '../../types';

const ClaimList = () => {
    const [claims, setClaims] = useState<Claim[]>(fakeClaims);
    const [policies, setPolicies] = useState<Policy[]>(fakePolicies);
    const [users, setUsers] = useState<User[]>(fakeUsers);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [loading, setLoading] = useState(false);

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
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading claims...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Claims Management</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Process and review insurance claims submitted by customers</p>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <select className="select" style={{ width: '200px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            <div className="glass-card table-container" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ background: '#f8fafc' }}>Claim ID</th>
                            <th style={{ background: '#f8fafc' }}>Policy</th>
                            <th style={{ background: '#f8fafc' }}>Customer</th>
                            <th style={{ background: '#f8fafc' }}>Amount</th>
                            <th style={{ background: '#f8fafc' }}>Reason</th>
                            <th style={{ background: '#f8fafc' }}>Date</th>
                            <th style={{ background: '#f8fafc' }}>Status</th>
                            <th style={{ textAlign: 'right', background: '#f8fafc' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClaims.map((c) => (
                            <tr key={c.claim_id}>
                                <td><span style={{ fontWeight: 600, color: '#475569' }}>#CLM-{c.claim_id.toString().padStart(4, '0')}</span></td>
                                <td><span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{getPolicyNum(c.policy_id)}</span></td>
                                <td>{getUserName(c.user_id)}</td>
                                <td style={{ fontWeight: 700, color: '#1e293b' }}>${c.claim_amount.toLocaleString()}</td>
                                <td style={{ fontSize: '13px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.reason}</td>
                                <td>{new Date(c.claim_date).toLocaleDateString()}</td>
                                <td>{getStatusBadge(c.status)}</td>
                                <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        {c.status === 'Submitted' && (
                                            <button className="btn btn-warning btn-sm" onClick={() => handleUpdateStatus(c.claim_id, 'Under Review')}>Review</button>
                                        )}
                                        {(c.status === 'Submitted' || c.status === 'Under Review') && (
                                            <>
                                                <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(c.claim_id, 'Approved')}>Approve</button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleUpdateStatus(c.claim_id, 'Rejected')}>Reject</button>
                                            </>
                                        )}
                                        <button className="btn btn-danger btn-sm" style={{ padding: '6px' }} onClick={() => handleDelete(c.claim_id)}>
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
