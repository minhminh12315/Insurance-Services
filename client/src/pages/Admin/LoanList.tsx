import { useState } from 'react';
import { fakeLoans, fakePolicies, fakeUsers } from '../../data/fakeData';
// import api from '../../services/api';
import type { PolicyLoan, LoanStatus, Policy, User } from '../../types';
import ConfirmationModal from '../../components/ConfirmationModal';

const LoanList = () => {
    const [loans, setLoans] = useState<PolicyLoan[]>(fakeLoans);
    const [policies] = useState<Policy[]>(fakePolicies);
    const [users] = useState<User[]>(fakeUsers);
    const [loading] = useState(false);

    // Confirmation states
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'status', id: number, status?: LoanStatus } | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');

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

    const handleDeleteClick = (id: number) => {
        setConfirmAction({ type: 'delete', id });
        setShowConfirmModal(true);
    };

    const handleStatusClick = (id: number, newStatus: LoanStatus) => {
        setConfirmAction({ type: 'status', id, status: newStatus });
        setShowConfirmModal(true);
    };

    const handleConfirm = () => {
        if (!confirmAction) return;

        if (confirmAction.type === 'delete') {
            setLoans(loans.filter(l => l.loan_id !== confirmAction.id));
            setSuccessMessage('Loan request cleared successfully');
        } else if (confirmAction.type === 'status' && confirmAction.status) {
            setLoans(loans.map(l => l.loan_id === confirmAction.id ? { ...l, loan_status: confirmAction.status! } : l));
            setSuccessMessage(`Loan marked as ${confirmAction.status}`);
        }

        setTimeout(() => setSuccessMessage(''), 3000);
        setShowConfirmModal(false);
        setConfirmAction(null);
    };

    const getStatusBadge = (status: LoanStatus) => {
        const baseClass = "px-2.5 py-0.5 rounded-full text-xs font-semibold text-center";
        switch (status) {
            case 'Approved': return <span className={`${baseClass} bg-emerald-100 text-emerald-600 font-semibold text-center`}>Approved</span>;
            case 'Requested': return <span className={`${baseClass} bg-amber-100 text-amber-600 font-semibold text-center`}>Requested</span>;
            case 'Rejected': return <span className={`${baseClass} bg-red-100 text-red-600 font-semibold text-center`}>Rejected</span>;
            case 'Repaid': return <span className={`${baseClass} bg-blue-100 text-blue-600 font-semibold text-center`}>Repaid</span>;
            default: return <span className={`${baseClass} bg-slate-100 text-slate-600 font-semibold text-center`}>{status}</span>;
        }
    };

    const getUserName = (id: number) => users.find(u => u.user_id === id)?.full_name || 'Unknown';
    const getPolicyNum = (id: number) => policies.find(p => p.policy_id === id)?.policy_number || 'Unknown';

    if (loading) {
        return <div className="p-5 text-center">Loading loans...</div>;
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
                    <h1 className="text-[28px] font-extrabold text-slate-800 mb-2">Policy Loans</h1>
                    <p className="text-slate-500 text-[15px]">Manage loan requests and repayments secured by active policies</p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
                <table className="w-full text-left border-collapse text-[14px]">
                    <thead>
                        <tr>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Loan ID</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Policy</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Customer</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Loan Amount</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Interest</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Applied</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Status</th>
                            <th className="text-right bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((l) => (
                            <tr key={l.loan_id}>
                                <td className="p-4 border-b border-slate-50"><span className="font-semibold text-slate-600">#LN-{l.loan_id.toString().padStart(4, '0')}</span></td>
                                <td className="p-4 border-b border-slate-50"><span className="font-bold text-blue-600">{getPolicyNum(l.policy_id)}</span></td>
                                <td className="p-4 border-b border-slate-50">{getUserName(l.user_id)}</td>
                                <td className="p-4 border-b border-slate-50 font-bold text-slate-800">${l.loan_amount.toLocaleString()}</td>
                                <td className="p-4 border-b border-slate-50">{l.interest_rate}%</td>
                                <td className="p-4 border-b border-slate-50">{new Date(l.application_date).toLocaleDateString()}</td>
                                <td className="p-4 border-b border-slate-50">{getStatusBadge(l.loan_status)}</td>
                                <td className="p-4 border-b border-slate-50">
                                    <div className="flex justify-end gap-2">
                                        {l.loan_status === 'Requested' && (
                                            <>
                                                <button className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium" onClick={() => handleStatusClick(l.loan_id, 'Approved')}>Approve</button>
                                                <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium" onClick={() => handleStatusClick(l.loan_id, 'Rejected')}>Reject</button>
                                            </>
                                        )}
                                        {l.loan_status === 'Approved' && (
                                            <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium" onClick={() => handleStatusClick(l.loan_id, 'Repaid')}>Mark Repaid</button>
                                        )}
                                        <button className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" onClick={() => handleDeleteClick(l.loan_id)}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ConfirmationModal
                isOpen={showConfirmModal}
                title={confirmAction?.type === 'delete' ? "Clear Loan Request" : "Update Status"}
                message={confirmAction?.type === 'delete'
                    ? "Are you sure you want to clear this loan request from the system? This action cannot be undone."
                    : `Are you sure you want to change this loan's status to ${confirmAction?.status}?`}
                onConfirm={handleConfirm}
                onCancel={() => setShowConfirmModal(false)}
                confirmLabel={confirmAction?.type === 'delete' ? "Clear Request" : "Update"}
                isDanger={confirmAction?.type === 'delete' || confirmAction?.status === 'Rejected'}
            />
        </div>
    );
};

export default LoanList;
