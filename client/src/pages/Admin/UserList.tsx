import { useState } from 'react';
import { fakeUsers } from '../../data/fakeData';
// import api from '../../services/api';
import type { User, UserRole } from '../../types';
import UserForm from './UserForm';

const UserList = () => {
    const [users, setUsers] = useState<User[]>(fakeUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [loading] = useState(false);

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

    const handleDeleteUser = (id: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.user_id !== id));
        }
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
        switch (role) {
            case 'Admin': return <span className="badge badge-danger">Admin</span>;
            case 'Employee': return <span className="badge badge-warning">Employee</span>;
            case 'Staff': return <span className="badge badge-warning">Staff</span>;
            default: return <span className="badge badge-success">Customer</span>;
        }
    };

    if (loading) {
        return <div className="p-5 text-center">Loading users...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-[28px] font-extrabold text-slate-800 mb-2">User Management</h1>
                    <p className="text-slate-500 text-[15px]">Manage system administrators, staff, and customers</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditingUser(null); setShowModal(true); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                    Add User
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
                            placeholder="Search by name or email..."
                            className="input pl-11"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-[200px]">
                        <select
                            className="select"
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

            <div className="glass-card table-container bg-white border border-slate-200">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="bg-slate-50">User</th>
                            <th className="bg-slate-50">Contact Info</th>
                            <th className="bg-slate-50">Role</th>
                            <th className="bg-slate-50">Location</th>
                            <th className="bg-slate-50">Joined Date</th>
                            <th className="text-right bg-slate-50">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.user_id}>
                                <td>
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
                                <td>
                                    <p className="text-slate-600 text-[13px]">{user.email}</p>
                                    <p className="text-slate-400 text-xs">{user.phone_number}</p>
                                </td>
                                <td>{getRoleBadge(user.role)}</td>
                                <td><span className="text-slate-500">{user.city || 'N/A'}</span></td>
                                <td><span className="text-slate-500">{new Date(user.created_at).toLocaleDateString()}</span></td>
                                <td>
                                    <div className="flex justify-end gap-2">
                                        <button className="btn btn-secondary btn-sm" onClick={() => { setEditingUser(user); setShowModal(true); }}>Edit</button>
                                        <button
                                            className="btn btn-danger btn-sm p-1.5"
                                            onClick={() => handleDeleteUser(user.user_id)}
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
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content glass-card w-[600px] bg-white p-8" onClick={e => e.stopPropagation()}>
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
        </div>
    );
};

export default UserList;
