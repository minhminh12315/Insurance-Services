import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
            <Sidebar />
            <div style={{ flex: 1, marginLeft: '260px' }}>
                <Header />
                <main style={{ padding: '32px', minHeight: 'calc(100vh - 70px)', maxWidth: '1600px', margin: '0 auto' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
