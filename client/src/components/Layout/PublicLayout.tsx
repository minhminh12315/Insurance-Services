import { Outlet } from 'react-router-dom';
import Header from '../Header';
import PublicFooter from './PublicFooter';

const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <PublicFooter />
        </div>
    );
};

export default PublicLayout;
