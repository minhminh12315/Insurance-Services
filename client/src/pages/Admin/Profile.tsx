import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../services/insuranceApi';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'edit'>('overview');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        date_of_birth: user?.date_of_birth ? user.date_of_birth.split('T')[0] : '',
        gender: user?.gender || '',
        address: user?.address || '',
        city: user?.city || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (successMessage) setSuccessMessage('');
        if (errorMessage) setErrorMessage('');
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const updated = await userApi.updateProfile({
                fullName: formData.full_name,
                phoneNumber: formData.phone_number,
                dateOfBirth: formData.date_of_birth,
                gender: formData.gender,
                address: formData.address,
                city: formData.city,
            });
            updateUser(updated);
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => {
                setActiveTab('overview');
                setSuccessMessage('');
            }, 2000);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Failed to update profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">My Profile</h1>
                <p className="text-slate-500 text-base font-medium">
                    View and manage your account details
                </p>
            </div>


            {/* Profile Card */}
            <div className="bg-gradient-to-br from-[#015fc9] to-[#007bff] rounded-[24px] p-10 flex flex-col md:flex-row items-center gap-8 mb-10 text-white relative overflow-hidden shadow-xl shadow-blue-200">
                {/* Decorative circles */}
                <div className="absolute top-[-30px] right-[-30px] w-48 h-48 rounded-full bg-white/10 blur-xl" />
                <div className="absolute bottom-[-50px] left-[20%] w-64 h-64 rounded-full bg-white/5 blur-2xl" />

                {/* Avatar */}
                <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center text-4xl font-bold shrink-0 border-4 border-white/30 backdrop-blur-sm z-10">
                    {initials}
                </div>

                {/* Info */}
                <div className="relative z-10 text-center md:text-left">
                    <h2 className="text-3xl font-bold mb-2">
                        {user?.full_name || 'Admin User'}
                    </h2>
                    <p className="text-white/80 text-lg mb-4">
                        {user?.email || ''}
                    </p>
                    <span className="inline-block px-5 py-1.5 rounded-full bg-white/20 text-sm font-bold backdrop-blur-sm uppercase tracking-wider">
                        {user?.role || 'Admin'}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-8 bg-slate-100 p-1 rounded-xl w-fit">
                {(['overview', 'edit'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab === 'overview' ? 'Overview' : 'Edit Profile'}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeTab === 'overview' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                    {/* Personal Information */}
                    <div className="bg-white rounded-[20px] border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="2.5">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            Personal Information
                        </h3>
                        <div className="space-y-1">
                            {[
                                { label: 'Full Name', value: user?.full_name },
                                { label: 'Email', value: user?.email },
                                { label: 'Phone', value: user?.phone_number || 'Not provided' },
                                { label: 'Date of Birth', value: user?.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'Not provided' },
                                { label: 'Gender', value: user?.gender || 'Not provided' },
                            ].map((item, i) => (
                                <div key={i} className={`flex justify-between py-4 ${i < 4 ? 'border-b border-slate-50' : ''}`}>
                                    <span className="text-slate-500 text-sm font-medium">{item.label}</span>
                                    <span className="text-slate-900 text-sm font-bold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Address & Account Info */}
                    <div className="flex flex-col gap-8 text-left">
                        <div className="bg-white rounded-[20px] border border-slate-200 p-8 shadow-sm text-left">
                            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="2.5">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </div>
                                Address
                            </h3>
                            <div className="space-y-1">
                                {[
                                    { label: 'Address', value: user?.address || 'Not provided' },
                                    { label: 'City', value: user?.city || 'Not provided' },
                                ].map((item, i) => (
                                    <div key={i} className={`flex justify-between py-4 ${i < 1 ? 'border-b border-slate-50' : ''}`}>
                                        <span className="text-slate-500 text-sm font-medium">{item.label}</span>
                                        <span className="text-slate-900 text-sm font-bold">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-[20px] border border-slate-200 p-8 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="2.5">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                                Account Status
                            </h3>
                            <div className="space-y-1">
                                {[
                                    { label: 'Role', value: user?.role },
                                    { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A' },
                                ].map((item, i) => (
                                    <div key={i} className={`flex justify-between py-4 ${i < 1 ? 'border-b border-slate-50' : ''}`}>
                                        <span className="text-slate-500 text-sm font-medium">{item.label}</span>
                                        <span className="text-slate-900 text-sm font-bold">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Edit Profile Form */
                <div className="bg-white rounded-[20px] border border-slate-200 p-10 shadow-sm max-w-4xl text-left">
                    <form onSubmit={handleSave} className="space-y-8">
                   
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 text-left">Full Name</label>
                                <input
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-[#015fc9] focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-700 font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 text-left">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-[#015fc9] focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-700 font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 text-left">Phone Number</label>
                                <input
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-[#015fc9] focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-700 font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 text-left">Date of Birth</label>
                                <input
                                    name="date_of_birth"
                                    type="date"
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-[#015fc9] focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-700 font-medium"
                                />
                            </div>
                            <div className="space-y-1.5 text-left">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 text-left">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-[#015fc9] focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-700 font-medium cursor-pointer"
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 text-left">City</label>
                                <input
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-[#015fc9] focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-700 font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 text-left">Full Address</label>
                            <input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-[#015fc9] focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-700 font-medium"
                            />
                        </div>
                             {/* Notification Messages inside Form */}
                        {errorMessage ? (
                            <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-red-600 text-sm font-medium animate-in fade-in zoom-in-95 duration-300">
                                <div className="flex items-center gap-2 text-left">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    {errorMessage}
                                </div>
                            </div>
                        ) : null}
                        {successMessage ? (
                            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600 text-sm font-medium animate-in fade-in zoom-in-95 duration-300">
                                <div className="flex items-center gap-2 text-left">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                    {successMessage}
                                </div>
                            </div>
                        ) : null}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-4 bg-gradient-to-r from-[#015fc9] to-[#007bff] text-white rounded-xl font-bold text-base shadow-lg shadow-blue-200 hover:opacity-90 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => setActiveTab('overview')}
                                className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-xl font-bold text-base border border-slate-200 hover:bg-slate-100 transition-all disabled:opacity-50"
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
