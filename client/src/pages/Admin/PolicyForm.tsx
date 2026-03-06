import React, { useState, useEffect } from 'react';
// import { fakeUsers, insuranceSchemes } from '../../data/fakeData';
import type { Policy, User, InsuranceScheme } from '../../types';

interface PolicyFormProps {
    policy: Policy | null;
    users: User[];
    schemes: InsuranceScheme[];
    onSubmit: (policyData: Partial<Policy>) => void;
    onCancel: () => void;
}

const PolicyForm: React.FC<PolicyFormProps> = ({ policy, users, schemes, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Policy>>({
        user_id: users[0]?.user_id || 0,
        scheme_id: schemes[0]?.scheme_id || 0,
        policy_number: `POL-${Math.floor(100000 + Math.random() * 900000)}`,
        start_date: new Date().toISOString().split('T')[0],
        maturity_date: new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString().split('T')[0],
        term_years: 10,
        payment_frequency: 'Monthly',
        sum_assured: 100000,
        premium_amount: 100,
        policy_status: 'Pending',
    });

    useEffect(() => {
        if (policy) {
            setFormData({
                ...policy,
                start_date: policy.start_date ? new Date(policy.start_date).toISOString().split('T')[0] : '',
                maturity_date: policy.maturity_date ? new Date(policy.maturity_date).toISOString().split('T')[0] : '',
            });
        }
    }, [policy]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        let finalValue: any = value;
        if (type === 'number') finalValue = value === '' ? 0 : parseFloat(value);
        if (name === 'user_id' || name === 'scheme_id' || name === 'term_years') finalValue = value === '' ? 0 : parseInt(value);

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-5 mb-8">
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Policy Number *</label>
                    <input
                        type="text"
                        name="policy_number"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.policy_number || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Status</label>
                    <select
                        name="policy_status"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.policy_status}
                        onChange={handleChange}
                    >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Lapsed">Lapsed</option>
                        <option value="Claimed">Claimed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Customer *</label>
                    <select
                        name="user_id"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.user_id || ''}
                        onChange={handleChange}
                        required
                    >
                        {users.map(user => (
                            <option key={user.user_id} value={user.user_id}>{user.full_name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Insurance Scheme *</label>
                    <select
                        name="scheme_id"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.scheme_id || ''}
                        onChange={handleChange}
                        required
                    >
                        {schemes.map(scheme => (
                            <option key={scheme.scheme_id} value={scheme.scheme_id}>{scheme.scheme_name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Sum Assured ($)</label>
                    <input
                        type="number"
                        name="sum_assured"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.sum_assured ?? ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Premium Amount ($)</label>
                    <input
                        type="number"
                        name="premium_amount"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.premium_amount ?? ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Payment Frequency</label>
                    <select
                        name="payment_frequency"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.payment_frequency}
                        onChange={handleChange}
                    >
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                        <option value="OneTime">One-Time</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Term (Years)</label>
                    <input
                        type="number"
                        name="term_years"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.term_years ?? ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Start Date</label>
                    <input
                        type="date"
                        name="start_date"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.start_date || ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Maturity Date</label>
                    <input
                        type="date"
                        name="maturity_date"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.maturity_date || ''}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="flex gap-3 justify-end">
                <button type="button" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium shadow-sm" onClick={onCancel}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
                    {policy ? 'Update Policy' : 'Issue Policy'}
                </button>
            </div>
        </form>
    );
};

export default PolicyForm;
