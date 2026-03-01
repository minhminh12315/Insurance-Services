import { Link } from 'react-router-dom';
import carousel12 from '../assets/carousel-12.jpg';

interface PageHeaderProps {
    title: string;
    currentPage: string;
    parentPage?: string;
}

const PageHeader = ({ title, currentPage, parentPage = 'Pages' }: PageHeaderProps) => {
    return (
        <section
            className="bg-cover bg-center py-[100px_0_100px] text-[#0a1628] relative h-[400px] flex flex-col justify-center border-b border-[#eee]"
            style={{ backgroundImage: `url(${carousel12})` }}
        >
            <div className="ml-5 md:ml-[10%] lg:ml-[20%] px-5">
                <h1 className="text-[48px] font-bold mb-5">{title}</h1>
                <nav className="flex items-center gap-2.5 text-[15px]">
                    <Link to="/home" className="text-[#0a1628]/80 no-underline hover:text-[#015fc9]">
                        Home
                    </Link>
                    <span className="text-[#0a1628]/50">/</span>
                    <span className="text-[#0a1628]/50">{parentPage}</span>
                    <span className="text-[#0a1628]/50">/</span>
                    <span className="text-[#015fc9] font-semibold">{currentPage}</span>
                </nav>
            </div>
        </section>
    );
};

export default PageHeader;
