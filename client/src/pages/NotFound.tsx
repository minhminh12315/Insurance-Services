import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div>
            {/* Hero Banner */}
            <section
                className="bg-[linear-gradient(rgba(0,31,63,0.85),rgba(0,31,63,0.85)),url(https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=600&fit=crop)] bg-cover bg-center py-[180px_0_100px] text-white"
            >
                <div className="max-w-[1200px] mx-auto px-5">
                    <h1 className="text-[48px] font-bold mb-5">404 Error</h1>
                    <nav className="flex items-center gap-2.5 text-[15px]">
                        <Link to="/home" className="text-white/80 no-underline hover:text-[#015fc9]">Home</Link>
                        <span className="text-white/50">/</span>
                        <span className="text-white/50">Pages</span>
                        <span className="text-white/50">/</span>
                        <span className="text-[#015fc9]">404 Error</span>
                    </nav>
                </div>
            </section>

            {/* 404 Content */}
            <section className="py-[100px] bg-white">
                <div className="max-w-[700px] mx-auto px-5 text-center">
                    {/* Warning Icon */}
                    <div className="mb-[30px]">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5" className="mx-auto">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </div>

                    <h2 className="text-[120px] font-bold text-[#0a1628] leading-none mb-[15px]">
                        404
                    </h2>
                    <h3 className="text-[32px] font-bold text-[#0a1628] mb-5">
                        Page Not Found
                    </h3>
                    <p className="text-[#666] leading-[1.8] text-base mb-[35px]">
                        We're sorry, the page you have looked for does not exist in our website! Maybe go to our
                        home page or try to use a search?
                    </p>
                    <Link
                        to="/home"
                        className="inline-block bg-[linear-gradient(135deg,#015fc9_0%,#007bff_100%)] text-white px-10 py-4 rounded-[50px] no-underline font-semibold text-base shadow-[0_4px_15px_rgba(1,95,201,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(1,95,201,0.5)]"
                    >
                        Go Back To Home
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default NotFound;
