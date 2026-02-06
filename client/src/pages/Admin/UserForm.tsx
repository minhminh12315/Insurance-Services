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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Full Name *</label>
                    <input
                        type="text"
                        name="full_name"
                        className="input"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Thanh Nguyen"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Email Address *</label>
                    <input
                        type="email"
                        name="email"
                        className="input"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="thanh@example.com"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Phone Number</label>
                    <input
                        type="text"
                        name="phone_number"
                        className="input"
                        value={formData.phone_number || ''}
                        onChange={handleChange}
                        placeholder="0901234567"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Role</label>
                    <select
                        name="role"
                        className="select"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="Customer">Customer</option>
                        <option value="Staff">Staff</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Gender</label>
                    <select
                        name="gender"
                        className="select"
                        value={formData.gender || ''}
                        onChange={handleChange}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Date of Birth</label>
                    <input
                        type="date"
                        name="date_of_birth"
                        className="input"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>City</label>
                    <input
                        type="text"
                        name="city"
                        className="input"
                        value={formData.city || ''}
                        onChange={handleChange}
                        placeholder="e.g. Ho Chi Minh"
                    />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Address</label>
                    <textarea
                        name="address"
                        className="input"
                        style={{ height: '80px', resize: 'none' }}
                        value={formData.address || ''}
                        onChange={handleChange}
                        placeholder="Street address, apartment, etc."
                    />
                </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                    {user ? 'Update User' : 'Create User'}
                </button>
            </div>
        </form>
    );
};

export default UserForm;
