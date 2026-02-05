import { useState, useEffect } from 'react';
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
    const [loading, setLoading] = useState(false);

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
            case 'Staff': return <span className="badge badge-warning">Staff</span>;
            default: return <span className="badge badge-success">Customer</span>;
        }
    };

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading users...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>User Management</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Manage system administrators, staff, and customers</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditingUser(null); setShowModal(true); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                    Add User
                </button>
            </div>

            <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="input"
                            style={{ paddingLeft: '44px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ width: '200px' }}>
                        <select
                            className="select"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Staff">Staff</option>
                            <option value="Customer">Customer</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="glass-card table-container" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ background: '#f8fafc' }}>User</th>
                            <th style={{ background: '#f8fafc' }}>Contact Info</th>
                            <th style={{ background: '#f8fafc' }}>Role</th>
                            <th style={{ background: '#f8fafc' }}>Location</th>
                            <th style={{ background: '#f8fafc' }}>Joined Date</th>
                            <th style={{ textAlign: 'right', background: '#f8fafc' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.user_id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '14px' }}>
                                            {user.full_name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, color: '#334155' }}>{user.full_name}</p>
                                            <p style={{ color: '#94a3b8', fontSize: '12px' }}>ID: USER-{user.user_id.toString().padStart(4, '0')}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <p style={{ color: '#475569', fontSize: '13px' }}>{user.email}</p>
                                    <p style={{ color: '#94a3b8', fontSize: '12px' }}>{user.phone_number}</p>
                                </td>
                                <td>{getRoleBadge(user.role)}</td>
                                <td><span style={{ color: '#64748b' }}>{user.city || 'N/A'}</span></td>
                                <td><span style={{ color: '#64748b' }}>{new Date(user.created_at).toLocaleDateString()}</span></td>
                                <td>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        <button className="btn btn-secondary btn-sm" onClick={() => { setEditingUser(user); setShowModal(true); }}>Edit</button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            style={{ padding: '6px' }}
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
                    <div className="modal-content glass-card" style={{ width: '600px', background: '#fff', padding: '32px' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginBottom: '24px' }}>
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
