import { Link } from 'react-router-dom';

const PublicFooter = () => {
    const quickLinks = [
        { name: 'About Us', path: '/about' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'Our Services', path: '/services' },
        { name: 'Terms & Condition', path: '/terms' },
        { name: 'Support', path: '/support' },
    ];

    const services = [
        { name: 'Life Insurance', path: '/services/life' },
        { name: 'Health Insurance', path: '/services/health' },
        { name: 'Home Insurance', path: '/services/home' },
        { name: 'Vehicle Insurance', path: '/services/vehicle' },
    ];

    return (
        <footer className="bg-gradient-to-b from-[#0a1628] to-[#0d1f3c] text-white pt-20">
            <div className="max-w-[1200px] mx-auto px-5">
                {/* Main Footer Content */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-10 pb-[60px]">
                    {/* Company Info */}
                    <div>
                        <Link
                            to="/home"
                            className="flex items-center no-underline gap-2.5 mb-[25px]"
                        >
                            <div className="w-[45px] h-[45px] bg-gradient-to-br from-[#015fc9] to-[#007bff] rounded-lg flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold text-white">
                                INSLIFE
                            </span>
                        </Link>
                        <p className="text-white/70 leading-[1.8] mb-[25px] text-sm">
                            Protecting your future with comprehensive insurance solutions. We provide reliable coverage for all your insurance needs.
                        </p>
                        {/* Social Icons */}
                        <div className="flex gap-3">
                            {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                                <a
                                    key={social}
                                    href={`https://${social}.com`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 ease hover:bg-[#015fc9] hover:-translate-y-[3px]"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                        {social === 'facebook' && (
                                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                        )}
                                        {social === 'twitter' && (
                                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                                        )}
                                        {social === 'instagram' && (
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" />
                                        )}
                                        {social === 'linkedin' && (
                                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                                        )}
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <h4 className="text-xl font-semibold mb-[25px] relative pb-[15px]">
                            Address
                            <span className="absolute bottom-0 left-0 w-[50px] h-[3px] bg-[#015fc9] rounded-[2px]" />
                        </h4>
                        <div className="flex flex-col gap-5">
                            <div className="flex gap-[15px] items-start">
                                <div className="w-10 h-10 rounded-full bg-[#015fc9]/20 flex items-center justify-center shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#015fc9">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" fill="white" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white/70 text-sm leading-[1.6]">
                                        123 Street, District 1<br />
                                        Ho Chi Minh City, Vietnam
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-[15px] items-center">
                                <div className="w-10 h-10 rounded-full bg-[#015fc9]/20 flex items-center justify-center shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#015fc9">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <p className="text-white/70 text-sm">
                                    +84 123 456 789
                                </p>
                            </div>
                            <div className="flex gap-[15px] items-center">
                                <div className="w-10 h-10 rounded-full bg-[#015fc9]/20 flex items-center justify-center shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#015fc9">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" stroke="white" strokeWidth="2" fill="none" />
                                    </svg>
                                </div>
                                <p className="text-white/70 text-sm">
                                    info@inslife.com
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xl font-semibold mb-[25px] relative pb-[15px]">
                            Quick Links
                            <span className="absolute bottom-0 left-0 w-[50px] h-[3px] bg-[#015fc9] rounded-[2px]" />
                        </h4>
                        <ul className="list-none p-0 m-0">
                            {quickLinks.map((link) => (
                                <li key={link.path} className="mb-3">
                                    <Link
                                        to={link.path}
                                        className="text-white/70 no-underline text-sm flex items-center gap-2.5 transition-all duration-300 ease hover:text-[#015fc9] hover:pl-2.5"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-xl font-semibold mb-[25px] relative pb-[15px]">
                            Our Services
                            <span className="absolute bottom-0 left-0 w-[50px] h-[3px] bg-[#015fc9] rounded-[2px]" />
                        </h4>
                        <ul className="list-none p-0 m-0">
                            {services.map((service) => (
                                <li key={service.path} className="mb-3">
                                    <Link
                                        to={service.path}
                                        className="text-white/70 no-underline text-sm flex items-center gap-2.5 transition-all duration-300 ease hover:text-[#015fc9] hover:pl-2.5"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                        {service.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="border-t border-b border-white/10 py-10 flex flex-wrap justify-between items-center gap-5">
                    <div>
                        <h4 className="text-xl font-semibold mb-2">
                            Subscribe to Our Newsletter
                        </h4>
                        <p className="text-white/70 text-sm">
                            Get the latest updates and offers directly in your inbox
                        </p>
                    </div>
                    <div className="flex gap-2.5">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="py-[15px] px-5 rounded-[50px] border-none bg-white/10 text-white text-sm min-w-[280px] outline-none placeholder:text-white/50"
                        />
                        <button
                            className="bg-gradient-to-br from-[#015fc9] to-[#007bff] text-white py-[15px] px-[30px] rounded-[50px] border-none font-semibold text-sm cursor-pointer transition-all duration-300 ease hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(1,95,201,0.5)]"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* Copyright */}
                <div className="py-[25px] flex flex-wrap justify-between items-center gap-[15px]">
                    <p className="text-white/60 text-sm">
                        © 2024 <span className="text-[#015fc9]">INSLIFE</span>. All Rights Reserved.
                    </p>
                    <div className="flex gap-5">
                        <Link
                            to="/privacy"
                            className="text-white/60 no-underline text-sm hover:text-white transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/terms"
                            className="text-white/60 no-underline text-sm hover:text-white transition-colors"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
