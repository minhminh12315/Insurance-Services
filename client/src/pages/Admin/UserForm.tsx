import React, { useState, useEffect } from 'react';
import type { User } from '../../types';

interface UserFormProps {
    user: User | null;
    onSubmit: (userData: Partial<User>) => void;
    onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Partial<User>>({
        full_name: '',
        email: '',
        phone_number: '',
        role: 'Customer',
        gender: 'Male',
        city: '',
        address: '',
        date_of_birth: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                ...user,
                // Ensure dates are formatted for input[type="date"]
                date_of_birth: user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : '',
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-5 mb-8">
                <div className="col-span-2">
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Full Name *</label>
                    <input
                        type="text"
                        name="full_name"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Thanh Nguyen"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Email Address *</label>
                    <input
                        type="email"
                        name="email"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="thanh@example.com"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Phone Number</label>
                    <input
                        type="text"
                        name="phone_number"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.phone_number || ''}
                        onChange={handleChange}
                        placeholder="0901234567"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Role</label>
                    <select
                        name="role"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="Customer">Customer</option>
                        <option value="Staff">Staff</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Gender</label>
                    <select
                        name="gender"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.gender || ''}
                        onChange={handleChange}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Date of Birth</label>
                    <input
                        type="date"
                        name="date_of_birth"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">City</label>
                    <input
                        type="text"
                        name="city"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.city || ''}
                        onChange={handleChange}
                        placeholder="e.g. Ho Chi Minh"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block mb-2 text-[13px] font-semibold text-slate-500 text-left">Address</label>
                    <textarea
                        name="address"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white h-20 resize-none px-4 py-2 border border-slate-200 rounded-lg"
                        value={formData.address || ''}
                        onChange={handleChange}
                        placeholder="Street address, apartment, etc."
                    />
                </div>
            </div>
            <div className="flex gap-3 justify-end">
                <button type="button" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium shadow-sm" onClick={onCancel}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
                    {user ? 'Update User' : 'Create User'}
                </button>
            </div>
        </form>
    );
};

export default UserForm;
