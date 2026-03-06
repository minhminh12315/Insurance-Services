import { useState } from 'react';
import { fakeUsers } from '../../data/fakeData';
// import api from '../../services/api';
import type { User, UserRole } from '../../types';
import UserForm from './UserForm';
import ConfirmationModal from '../../components/ConfirmationModal';

const UserList = () => {
    const [users, setUsers] = useState<User[]>(fakeUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [loading] = useState(false);

    // Deletion states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');

    // useEffect(() => {
    //     fetchUsers();
    // }, []);

    // const fetchUsers = async () => {
    //     try {
    //         const response = await api.get('/users');
    //         setUsers(response.data);
    //     } catch (error) {
    //         console.error('Failed to fetch users:', error);
    //         // Could add toast error here
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const filteredUsers = users.filter((u) => {
        const matchesSearch = u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = !roleFilter || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleDeleteClick = (id: number) => {
        setDeletingId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (deletingId) {
            setUsers(users.filter(u => u.user_id !== deletingId));
            setSuccessMessage('User deleted successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
        setShowDeleteModal(false);
        setDeletingId(null);
    };

    const handleFormSubmit = (userData: Partial<User>) => {
        if (editingUser) {
            // Update existing user
            setUsers(users.map(u => u.user_id === editingUser.user_id ? { ...u, ...userData } as User : u));
        } else {
            // Add new user
            const newUser = {
                ...userData,
                user_id: users.length > 0 ? Math.max(...users.map(u => u.user_id)) + 1 : 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            } as User;
            setUsers([...users, newUser]);
        }
        setShowModal(false);
    };

    const getRoleBadge = (role: UserRole) => {
        const baseClass = "px-2.5 py-0.5 rounded-full text-xs font-semibold";
        switch (role) {
            case 'Admin': return <span className={`${baseClass} bg-red-100 text-red-600`}>Admin</span>;
            case 'Employee': return <span className={`${baseClass} bg-amber-100 text-amber-600`}>Employee</span>;
            case 'Staff': return <span className={`${baseClass} bg-amber-100 text-amber-600`}>Staff</span>;
            default: return <span className={`${baseClass} bg-emerald-100 text-emerald-600`}>Customer</span>;
        }
    };

    if (loading) {
        return <div className="p-5 text-center">Loading users...</div>;
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
                    <h1 className="text-[28px] font-extrabold text-slate-800 mb-2">User Management</h1>
                    <p className="text-slate-500 text-[15px]">Manage system administrators, staff, and customers</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm" onClick={() => { setEditingUser(null); setShowModal(true); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                    Add User
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
                            placeholder="Search by name or email..."
                            className="w-full px-4 py-2 pl-11 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-[200px]">
                        <select
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Employee">Employee</option>
                            <option value="Staff">Staff</option>
                            <option value="Customer">Customer</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
                <table className="w-full text-left border-collapse text-[14px]">
                    <thead>
                        <tr>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">User</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Contact Info</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Role</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Location</th>
                            <th className="bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Joined Date</th>
                            <th className="text-right bg-slate-50 p-4 font-semibold text-slate-700 border-b border-slate-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.user_id}>
                                <td className="p-4 border-b border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                                            {user.full_name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-700">{user.full_name}</p>
                                            <p className="text-slate-400 text-xs text-opacity-80">ID: USER-{user.user_id.toString().padStart(4, '0')}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-50">
                                    <p className="text-slate-600 text-[13px]">{user.email}</p>
                                    <p className="text-slate-400 text-xs">{user.phone_number}</p>
                                </td>
                                <td className="p-4 border-b border-slate-50">{getRoleBadge(user.role)}</td>
                                <td className="p-4 border-b border-slate-50"><span className="text-slate-500">{user.city || 'N/A'}</span></td>
                                <td className="p-4 border-b border-slate-50"><span className="text-slate-500">{new Date(user.created_at).toLocaleDateString()}</span></td>
                                <td className="p-4 border-b border-slate-50">
                                    <div className="flex justify-end gap-2">
                                        <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium" onClick={() => { setEditingUser(user); setShowModal(true); }}>Edit</button>
                                        <button
                                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                            onClick={() => handleDeleteClick(user.user_id)}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-[600px] p-8" onClick={e => e.stopPropagation()}>
                        <h2 className="text-[22px] font-extrabold text-slate-800 mb-6">
                            {editingUser ? 'Edit User' : 'Add New User'}
                        </h2>
                        <UserForm
                            user={editingUser}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setShowModal(false)}
                        />
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={showDeleteModal}
                title="Delete User"
                message="Are you sure you want to delete this user? This will remove their access to the system and all associated data. This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
                confirmLabel="Delete User"
                isDanger={true}
            />
        </div>
    );
};

export default UserList;
