import { useState } from 'react';
import { fakePolicies, insuranceSchemes, fakeUsers } from '../../data/fakeData';
// import api from '../../services/api';
import type { Policy, PolicyStatus, User, InsuranceScheme } from '../../types';
import PolicyForm from './PolicyForm';

const PolicyList = () => {
    const [policies, setPolicies] = useState<Policy[]>(fakePolicies);
    const [users] = useState<User[]>(fakeUsers);
    const [schemes] = useState<InsuranceScheme[]>(insuranceSchemes);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [loading] = useState(false);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const [policiesRes, usersRes, schemesRes] = await Promise.all([
    //                 api.get('/policies'),
    //                 api.get('/users'),
    //                 api.get('/schemes')
    //             ]);
    //             setPolicies(policiesRes.data);
    //             setUsers(usersRes.data);
    //             setSchemes(schemesRes.data);
    //         } catch (error) {
    //             console.error('Failed to fetch data:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchData();
    // }, []);

    const filteredPolicies = policies.filter((p) => {
        const matchesSearch = p.policy_number.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || p.policy_status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getUserName = (id: number) => {
        return users.find(u => u.user_id === id)?.full_name || 'Unknown User';
    };

    const getSchemeName = (id: number) => {
        return schemes.find(s => s.scheme_id === id)?.scheme_name || 'Unknown Scheme';
    };

    const getStatusBadge = (status: PolicyStatus) => {
        switch (status) {
            case 'Active': return <span className="badge badge-success">Active</span>;
            case 'Pending': return <span className="badge badge-warning">Pending</span>;
            case 'Lapsed': return <span className="badge badge-secondary">Lapsed</span>;
            case 'Cancelled': return <span className="badge badge-danger">Cancelled</span>;
            case 'Claimed': return <span className="badge badge-primary">Claimed</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to cancel this policy?')) {
            setPolicies(policies.filter(p => p.policy_id !== id));
        }
    };

    const handleFormSubmit = (policyData: Partial<Policy>) => {
        if (editingPolicy) {
            setPolicies(policies.map(p => p.policy_id === editingPolicy.policy_id ? { ...p, ...policyData } as Policy : p));
        } else {
            const newPolicy = {
                ...policyData,
                policy_id: policies.length > 0 ? Math.max(...policies.map(p => p.policy_id)) + 1 : 1,
                user_id: policyData.user_id || 0,
                scheme_id: policyData.scheme_id || 0,
                sum_assured: policyData.sum_assured || 0,
                premium_amount: policyData.premium_amount || 0,
                start_date: policyData.start_date || new Date().toISOString(),
                maturity_date: policyData.maturity_date || new Date().toISOString(),
                policy_status: 'Pending'
            } as Policy;
            setPolicies([...policies, newPolicy]);
        }
        setShowModal(false);
    };

    if (loading) {
        return <div className="p-5 text-center">Loading policies...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-[28px] font-extrabold text-slate-800 mb-2">Policy Management</h1>
                    <p className="text-slate-500 text-[15px]">View and manage customer policies, coverage, and terms</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditingPolicy(null); setShowModal(true); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                    Issue New Policy
                </button>
            </div>

            <div className="glass-card p-5 mb-6 bg-white border border-slate-200">
                <div className="flex gap-4 flex-wrap">
                    <div className="flex-1 min-w-[300px] relative">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by policy number..."
                            className="input pl-11"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-[200px]">
                        <select
                            className="select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Lapsed">Lapsed</option>
                            <option value="Claimed">Claimed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="glass-card table-container bg-white border border-slate-200">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="bg-slate-50">Policy Number</th>
                            <th className="bg-slate-50">Customer</th>
                            <th className="bg-slate-50">Scheme</th>
                            <th className="bg-slate-50">Premium</th>
                            <th className="bg-slate-50">Status</th>
                            <th className="bg-slate-50">Expiry</th>
                            <th className="text-right bg-slate-50">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPolicies.map((policy) => (
                            <tr key={policy.policy_id}>
                                <td><span className="font-bold text-blue-600">{policy.policy_number}</span></td>
                                <td>
                                    <p className="font-semibold text-slate-700">{getUserName(policy.user_id)}</p>
                                    <p className="text-slate-400 text-[11px]">ID: USER-{policy.user_id}</p>
                                </td>
                                <td>
                                    <p className="font-medium text-slate-600">{getSchemeName(policy.scheme_id)}</p>
                                    <p className="text-slate-400 text-[11px]">{policy.payment_frequency}</p>
                                </td>
                                <td>
                                    <p className="font-bold text-slate-800">${policy.premium_amount}</p>
                                    <p className="text-slate-400 text-[11px]">Coverage: ${policy.sum_assured.toLocaleString()}</p>
                                </td>
                                <td>{getStatusBadge(policy.policy_status)}</td>
                                <td>{policy.maturity_date ? <span className="text-slate-500 text-[13px]">{new Date(policy.maturity_date).toLocaleDateString()}</span> : '-'}</td>
                                <td>
                                    <div className="flex justify-end gap-2">
                                        <button className="btn btn-secondary btn-sm" onClick={() => { setEditingPolicy(policy); setShowModal(true); }}>Edit</button>
                                        <button className="btn btn-danger btn-sm p-1.5" onClick={() => handleDelete(policy.policy_id)}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content glass-card w-[800px] bg-white p-8" onClick={e => e.stopPropagation()}>
                        <h2 className="text-[22px] font-extrabold text-slate-800 mb-6">
                            {editingPolicy ? 'Edit Policy' : 'Issue New Policy'}
                        </h2>
                        <PolicyForm
                            policy={editingPolicy}
                            users={users}
                            schemes={schemes}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setShowModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PolicyList;
