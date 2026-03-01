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

    const inputClasses = "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none transition-all bg-white focus:border-blue-600";
    const labelClasses = "block text-[13px] font-semibold text-slate-600 mb-1.5";

    return (
        <div className="p-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-[28px] font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-500 text-[15px] mt-1">
                    View and manage your account details
                </p>
            </div>

            {/* Profile Card */}
            <div className="bg-gradient-to-br from-[#015fc9] to-[#007bff] rounded-[20px] p-10 flex items-center gap-[30px] mb-8 text-white relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-[30px] -right-[30px] w-[150px] h-[150px] rounded-full bg-white/10" />
                <div className="absolute -bottom-[50px] right-[80px] w-[200px] h-[200px] rounded-full bg-white/5" />

                {/* Avatar */}
                <div className="w-[90px] h-[90px] rounded-[20px] bg-white/20 flex items-center justify-center text-[32px] font-bold shrink-0 border-[3px] border-white/30">
                    {initials}
                </div>

                {/* Info */}
                <div className="relative z-[1]">
                    <h2 className="text-[26px] font-bold mb-1">
                        {user?.full_name || 'Admin User'}
                    </h2>
                    <p className="opacity-85 text-[15px] mb-2">
                        {user?.email || ''}
                    </p>
                    <span className="inline-block px-[14px] py-1 rounded-full bg-white/20 text-[13px] font-medium">
                        {user?.role || 'Admin'}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
                {(['overview', 'edit'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-lg font-semibold text-sm cursor-pointer transition-all capitalize ${activeTab === tab
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'bg-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab === 'overview' ? 'Overview' : 'Edit Profile'}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeTab === 'overview' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-7">
                        <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2.5">
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
                            <div key={i} className={`flex justify-between py-3 ${i < 4 ? 'border-b border-slate-50' : ''}`}>
                                <span className="text-slate-500 text-sm">{item.label}</span>
                                <span className="text-slate-900 text-sm font-medium">{item.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Address & Account Info */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-7">
                            <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2.5">
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
                                <div key={i} className={`flex justify-between py-3 ${i < 1 ? 'border-b border-slate-50' : ''}`}>
                                    <span className="text-slate-500 text-sm">{item.label}</span>
                                    <span className="text-slate-900 text-sm font-medium">{item.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-7">
                            <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2.5">
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
                                <div key={i} className={`flex justify-between py-3 ${i < 1 ? 'border-b border-slate-50' : ''}`}>
                                    <span className="text-slate-500 text-sm">{item.label}</span>
                                    <span className="text-slate-900 text-sm font-medium">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* Edit Profile Form */
                <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-[800px]">
                    <form onSubmit={handleSave}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                            <div>
                                <label className={labelClasses}>Full Name</label>
                                <input name="full_name" value={formData.full_name} onChange={handleChange} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Email</label>
                                <input name="email" type="email" value={formData.email} onChange={handleChange} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Phone Number</label>
                                <input name="phone_number" value={formData.phone_number} onChange={handleChange} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Date of Birth</label>
                                <input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className={`${inputClasses} cursor-pointer`}>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>City</label>
                                <input name="city" value={formData.city} onChange={handleChange} className={inputClasses} />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className={labelClasses}>Address</label>
                            <input name="address" value={formData.address} onChange={handleChange} className={inputClasses} />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-gradient-to-br from-[#015fc9] to-[#007bff] text-white border-none rounded-xl font-semibold text-sm cursor-pointer transition-all shadow-lg shadow-blue-600/30 hover:-translate-y-0.5"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('overview')}
                                className="px-8 py-3 bg-transparent text-slate-500 border border-slate-200 rounded-xl font-semibold text-sm cursor-pointer transition-all hover:bg-slate-50"
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
