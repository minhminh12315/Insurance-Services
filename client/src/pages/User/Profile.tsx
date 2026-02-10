import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'edit'>('overview');
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        date_of_birth: user?.date_of_birth || '',
        gender: user?.gender || '',
        address: user?.address || '',
        city: user?.city || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Profile updated successfully!');
    };

    const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        fontSize: '14px',
        color: '#334155',
        outline: 'none',
        transition: 'border-color 0.2s',
        background: '#ffffff',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '13px',
        fontWeight: 600,
        color: '#475569',
        marginBottom: '6px',
    };

    return (
        <div style={{ padding: '32px' }}>
            {/* Page Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>My Profile</h1>
                <p style={{ color: '#64748b', fontSize: '15px', marginTop: '4px' }}>
                    View and manage your account details
                </p>
            </div>

            {/* Profile Card */}
            <div
                style={{
                    background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                    borderRadius: '20px',
                    padding: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '30px',
                    marginBottom: '32px',
                    color: '#ffffff',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ position: 'absolute', bottom: '-50px', right: '80px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

                {/* Avatar */}
                <div
                    style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '20px',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        fontWeight: 700,
                        flexShrink: 0,
                        border: '3px solid rgba(255,255,255,0.3)',
                    }}
                >
                    {initials}
                </div>

                {/* Info */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '4px' }}>
                        {user?.full_name || 'Admin User'}
                    </h2>
                    <p style={{ opacity: 0.85, fontSize: '15px', marginBottom: '8px' }}>
                        {user?.email || ''}
                    </p>
                    <span
                        style={{
                            display: 'inline-block',
                            padding: '4px 14px',
                            borderRadius: '20px',
                            background: 'rgba(255,255,255,0.2)',
                            fontSize: '13px',
                            fontWeight: 500,
                        }}
                    >
                        {user?.role || 'Admin'}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#f1f5f9', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
                {(['overview', 'edit'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            background: activeTab === tab ? '#ffffff' : 'transparent',
                            color: activeTab === tab ? '#0f172a' : '#64748b',
                            fontWeight: 600,
                            fontSize: '14px',
                            cursor: 'pointer',
                            boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s',
                            textTransform: 'capitalize',
                        }}
                    >
                        {tab === 'overview' ? 'Overview' : 'Edit Profile'}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeTab === 'overview' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Personal Information */}
                    <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Personal Information
                        </h3>
                        {[
                            { label: 'Full Name', value: user?.full_name },
                            { label: 'Email', value: user?.email },
                            { label: 'Phone', value: user?.phone_number || 'Not provided' },
                            { label: 'Date of Birth', value: user?.date_of_birth || 'Not provided' },
                            { label: 'Gender', value: user?.gender || 'Not provided' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none' }}>
                                <span style={{ color: '#64748b', fontSize: '14px' }}>{item.label}</span>
                                <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500 }}>{item.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Address & Account Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                Address
                            </h3>
                            {[
                                { label: 'Address', value: user?.address || 'Not provided' },
                                { label: 'City', value: user?.city || 'Not provided' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 1 ? '1px solid #f1f5f9' : 'none' }}>
                                    <span style={{ color: '#64748b', fontSize: '14px' }}>{item.label}</span>
                                    <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500 }}>{item.value}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                Account
                            </h3>
                            {[
                                { label: 'Role', value: user?.role },
                                { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 1 ? '1px solid #f1f5f9' : 'none' }}>
                                    <span style={{ color: '#64748b', fontSize: '14px' }}>{item.label}</span>
                                    <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500 }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* Edit Profile Form */
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', maxWidth: '800px' }}>
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <input name="full_name" value={formData.full_name} onChange={handleChange} style={inputStyle}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#015fc9'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Email</label>
                                <input name="email" type="email" value={formData.email} onChange={handleChange} style={inputStyle}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#015fc9'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Phone Number</label>
                                <input name="phone_number" value={formData.phone_number} onChange={handleChange} style={inputStyle}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#015fc9'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Date of Birth</label>
                                <input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} style={inputStyle}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#015fc9'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#015fc9'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>City</label>
                                <input name="city" value={formData.city} onChange={handleChange} style={inputStyle}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#015fc9'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={labelStyle}>Address</label>
                            <input name="address" value={formData.address} onChange={handleChange} style={inputStyle}
                                onFocus={e => { e.currentTarget.style.borderColor = '#015fc9'; }}
                                onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                type="submit"
                                style={{
                                    padding: '12px 32px',
                                    background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 12px rgba(1, 95, 201, 0.3)',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('overview')}
                                style={{
                                    padding: '12px 32px',
                                    background: 'transparent',
                                    color: '#64748b',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Profile;
