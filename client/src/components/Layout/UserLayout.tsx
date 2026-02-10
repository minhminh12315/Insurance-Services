import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/user', label: 'Dashboard', icon: '📊', end: true },
        { to: '/user/policies', label: 'My Policies', icon: '📋', end: false },
        { to: '/user/claims', label: 'My Claims', icon: '📝', end: false },
        { to: '/user/payments', label: 'My Payments', icon: '💳', end: false },
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
            {/* Top Navigation Bar */}
            <header style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                color: 'white',
                padding: '0 32px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', fontWeight: 700, color: 'white',
                        boxShadow: '0 2px 8px rgba(59,130,246,0.4)',
                    }}>
                        IS
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.3px' }}>
                        Insurance Services
                    </span>
                </div>

                <nav style={{ display: 'flex', gap: '4px', height: '100%' }}>
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            style={({ isActive }) => ({
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '0 16px', height: '100%',
                                color: isActive ? '#ffffff' : '#94a3b8',
                                textDecoration: 'none', fontSize: '14px', fontWeight: 500,
                                borderBottom: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                                transition: 'all 0.2s ease',
                            })}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '14px', color: '#94a3b8' }}>
                        Welcome, <strong style={{ color: '#e2e8f0' }}>{user?.full_name}</strong>
                    </span>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '8px 16px', borderRadius: '8px', border: '1px solid #475569',
                            background: 'transparent', color: '#e2e8f0', cursor: 'pointer',
                            fontSize: '13px', fontWeight: 500, transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#475569'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '32px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
                <Outlet />
            </main>

            {/* Simple Footer */}
            <footer style={{
                textAlign: 'center', padding: '20px 32px',
                color: '#94a3b8', fontSize: '13px',
                borderTop: '1px solid #e2e8f0',
            }}>
                © 2024 Insurance Services. All rights reserved.
            </footer>
        </div>
    );
};

export default UserLayout;
