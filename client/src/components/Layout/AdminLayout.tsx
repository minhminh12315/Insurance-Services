import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import PublicHeader from './PublicHeader';
import { useState } from 'react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);



    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <div style={{ flex: 1, marginLeft: '260px' }}>
                <PublicHeader />
                <main style={{ padding: '32px', minHeight: 'calc(100vh - 70px)', maxWidth: '1600px', margin: '0 auto' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

