import { useState } from 'react';
import { fakePolicies, insuranceSchemes, fakeUsers } from '../../data/fakeData';
// import api from '../../services/api';
import type { Policy, PolicyStatus, User, InsuranceScheme } from '../../types';
import PolicyForm from './PolicyForm';
import DeleteConfirm from '../../components/DeleteConfirm';

const PolicyList = () => {
    const [policies, setPolicies] = useState<Policy[]>(fakePolicies);
    const [users] = useState<User[]>(fakeUsers);
    const [schemes] = useState<InsuranceScheme[]>(insuranceSchemes);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [loading] = useState(false);

    // Deletion/Cancellation states
    const [successMessage, setSuccessMessage] = useState<string>('');

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
        const baseClass = "px-2.5 py-0.5 rounded-full text-xs font-semibold";
        switch (status) {
            case 'Active': return <span className={`${baseClass} bg-emerald-100 text-emerald-600`}>Active</span>;
            case 'Pending': return <span className={`${baseClass} bg-amber-100 text-amber-600`}>Pending</span>;
            case 'Lapsed': return <span className={`${baseClass} bg-slate-100 text-slate-600`}>Lapsed</span>;
            case 'Cancelled': return <span className={`${baseClass} bg-red-100 text-red-600`}>Cancelled</span>;
            case 'Claimed': return <span className={`${baseClass} bg-blue-100 text-blue-600`}>Claimed</span>;
            default: return <span className={`${baseClass} bg-slate-100 text-slate-600`}>{status}</span>;
        }
    };


    const confirmCancel = (id: number) => {
        setPolicies(policies.filter(p => p.policy_id !== id));
        setSuccessMessage('Policy cancelled successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
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
                    <h1 className="text-[28px] font-extrabold text-slate-800 mb-2">Policy Management</h1>
                    <p className="text-slate-500 text-[15px]">View and manage customer policies, coverage, and terms</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm" onClick={() => { setEditingPolicy(null); setShowModal(true); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                    Issue New Policy
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 mb-6">
                <div className="flex gap-4 flex-wrap">
                    <div className="flex-1 min-w-[300px] relative">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by policy number..."
                            className="w-full px-4 py-2 pl-11 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-[200px]">
                        <select
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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

            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
                <table className="w-full text-left border-collapse text-[14px]">
                    <thead>
                        <tr>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Policy Number</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Customer</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Scheme</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Premium</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Status</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Expiry</th>
                            <th className="text-right bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPolicies.map((policy) => (
                            <tr key={policy.policy_id}>
                                <td className="p-4 border-b border-slate-50"><span className="font-bold text-blue-600">{policy.policy_number}</span></td>
                                <td className="p-4 border-b border-slate-50">
                                    <p className="font-semibold text-slate-700">{getUserName(policy.user_id)}</p>
                                    <p className="text-slate-400 text-[11px]">ID: USER-{policy.user_id}</p>
                                </td>
                                <td className="p-4 border-b border-slate-50">
                                    <p className="font-medium text-slate-600">{getSchemeName(policy.scheme_id)}</p>
                                    <p className="text-slate-400 text-[11px]">{policy.payment_frequency}</p>
                                </td>
                                <td className="p-4 border-b border-slate-50">
                                    <p className="font-bold text-slate-800">${policy.premium_amount}</p>
                                    <p className="text-slate-400 text-[11px]">Coverage: ${policy.sum_assured.toLocaleString()}</p>
                                </td>
                                <td className="p-4 border-b border-slate-50">{getStatusBadge(policy.policy_status)}</td>
                                <td className="p-4 border-b border-slate-50">{policy.maturity_date ? <span className="text-slate-500 text-[13px]">{new Date(policy.maturity_date).toLocaleDateString()}</span> : '-'}</td>
                                <td className="p-4 border-b border-slate-50">
                                    <div className="flex justify-end gap-2">
                                        <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium" onClick={() => { setEditingPolicy(policy); setShowModal(true); }}>Edit</button>
                                        <DeleteConfirm
                                            onConfirm={() => confirmCancel(policy.policy_id)}
                                            title="Cancel Policy?"
                                            message="Are you sure? This may have financial implications."
                                            confirmLabel="Cancel Policy"
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

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-[800px] p-8" onClick={e => e.stopPropagation()}>
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
