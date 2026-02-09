import { useState } from 'react';
import { fakeUsers } from '../../data/fakeData';
import type { User, UserRole } from '../../types';
import UserForm from './UserForm';
import '../../assets/styles/layout.css';
import '../../assets/styles/table.css';
import '../../assets/styles/modal.css';

const UserList = () => {
    const [users, setUsers] = useState<User[]>(fakeUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [loading] = useState(false);

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
            setUsers(users.map(u => u.user_id === editingUser.user_id ? { ...u, ...userData } as User : u));
        } else {
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
        return <div className="loading-container">Loading users...</div>;
    }

    return (
        <div>
            <div className="page-header">
                <div className="page-header-content">
                    <h1>User Management</h1>
                    <p>Manage system administrators, staff, and customers</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditingUser(null); setShowModal(true); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                    Add User
                </button>
            </div>

            <div className="glass-card filter-bar">
                <div className="filter-controls">
                    <div className="search-wrapper">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-select">
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

            <div className="glass-card table-container table-card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Contact Info</th>
                            <th>Role</th>
                            <th>Location</th>
                            <th>Joined Date</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.user_id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar">
                                            {user.full_name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="user-info">
                                            <p>{user.full_name}</p>
                                            <p>ID: USER-{user.user_id.toString().padStart(4, '0')}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="contact-cell">
                                        <p>{user.email}</p>
                                        <p>{user.phone_number}</p>
                                    </div>
                                </td>
                                <td>{getRoleBadge(user.role)}</td>
                                <td><span className="text-muted">{user.city || 'N/A'}</span></td>
                                <td><span className="text-muted">{new Date(user.created_at).toLocaleDateString()}</span></td>
                                <td>
                                    <div className="action-cell">
                                        <button className="btn btn-secondary btn-sm" onClick={() => { setEditingUser(user); setShowModal(true); }}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.user_id)}>
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
                    <div className="modal-dialog glass-card" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                        </div>
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
