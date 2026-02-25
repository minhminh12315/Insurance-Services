import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const Features = () => {
    const features = [
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M9 15l2 2 4-4" />
                </svg>
            ),
            title: 'Easy Process',
            description: 'Simple and streamlined insurance application process. Get covered in minutes, not days.',
        },
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5">
                    <rect x="1" y="3" width="15" height="13" rx="2" />
                    <path d="M16 8h4l3 3v5a2 2 0 0 1-2 2h-1" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
            ),
            title: 'Fast Delivery',
            description: 'Quick policy issuance and claims settlement. We value your time and ensure rapid service.',
        },
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                </svg>
            ),
            title: 'Policy Controlling',
            description: 'Full control over your insurance policies. Manage, modify, and monitor all your plans in one place.',
        },
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            ),
            title: 'Money Saving',
            description: 'Competitive premiums and maximum benefits. Save money while getting comprehensive coverage.',
        },
    ];

    return (
        <div>
            {/* Page Header */}
            <PageHeader title="Our Features" currentPage="Our Features" />

            {/* Features Section */}
            <section className="py-[100px] bg-white">
                <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-[60px] items-center">
                    {/* Left Content */}
                    <div>
                        <h2 className="text-[42px] font-bold text-[#0a1628] mb-[25px] leading-[1.3]">
                            Few Reasons Why People Choosing Us!
                        </h2>
                        <p className="text-[#666] leading-[1.8] mb-10 text-base">
                            Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et
                            eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore
                            erat amet
                        </p>

                        {/* Feature Cards Grid */}
                        <div className="grid grid-cols-2 gap-5">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white border-2 border-[#e8edf2] rounded-[15px] p-[30px_20px] text-center transition-all duration-300 cursor-pointer hover:border-[#015fc9] hover:-translate-y-1.25 hover:shadow-[0_10px_30px_rgba(1,95,201,0.15)]"
                                >
                                    <div className="w-20 h-20 mx-auto mb-[15px] bg-[rgba(1,95,201,0.08)] rounded-[15px] flex items-center justify-center">
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-lg font-semibold text-[#0a1628]">
                                        {feature.title}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=700&fit=crop"
                            alt="Insurance professional"
                            className="w-full h-[650px] object-cover rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
                        />
                    </div>
                </div>
            </section>

            {/* Why Choose Us Detail Section */}
            <section className="py-[100px] bg-[#f8f9fa]">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="text-center mb-[60px]">
                        <h2 className="text-[42px] font-bold text-[#0a1628] mb-5">
                            What Makes Us Different
                        </h2>
                        <p className="text-[#666] max-w-[700px] mx-auto leading-[1.8]">
                            We combine technology with personal touch to deliver an insurance experience that's truly exceptional.
                        </p>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-[30px]">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-[20px] p-[40px_30px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-all duration-300 border-t-4 border-t-transparent hover:-translate-y-2.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:border-t-[#015fc9]"
                            >
                                <div className="w-[70px] h-[70px] bg-[linear-gradient(135deg,#015fc9_0%,#007bff_100%)] rounded-[15px] flex items-center justify-center mb-[25px] shadow-[0_8px_25px_rgba(1,95,201,0.3)]">
                                    <div className="text-white">
                                        {/* Re-render icon in white */}
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                                            {index === 0 && (
                                                <>
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                    <polyline points="14 2 14 8 20 8" />
                                                    <path d="M9 15l2 2 4-4" />
                                                </>
                                            )}
                                            {index === 1 && (
                                                <>
                                                    <rect x="1" y="3" width="15" height="13" rx="2" />
                                                    <path d="M16 8h4l3 3v5a2 2 0 0 1-2 2h-1" />
                                                    <circle cx="5.5" cy="18.5" r="2.5" />
                                                    <circle cx="18.5" cy="18.5" r="2.5" />
                                                </>
                                            )}
                                            {index === 2 && (
                                                <>
                                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                                    <path d="M9 12l2 2 4-4" />
                                                </>
                                            )}
                                            {index === 3 && (
                                                <>
                                                    <line x1="12" y1="1" x2="12" y2="23" />
                                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                                </>
                                            )}
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-[22px] font-semibold text-[#0a1628] mb-[15px]">
                                    {feature.title}
                                </h3>
                                <p className="text-[#666] leading-[1.8] text-[15px]">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-[linear-gradient(135deg,#015fc9_0%,#0047ab_100%)] py-20">
                <div className="max-w-[1200px] mx-auto px-5 text-center text-white">
                    <h2 className="text-[38px] font-bold mb-5">
                        Ready to Get Started?
                    </h2>
                    <p className="text-lg opacity-90 mb-[35px] max-w-[600px] mx-auto text-white">
                        Experience the difference with our premium insurance services. Get a free quote today.
                    </p>
                    <div className="flex gap-[15px] justify-center">
                        <Link
                            to="/contact"
                            className="inline-block bg-white text-[#015fc9] px-10 py-4 rounded-[50px] no-underline font-semibold text-base transition-all duration-300 hover:bg-[#f8f9fa] hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
                        >
                            Get A Quote
                        </Link>
                        <Link
                            to="/services"
                            className="inline-block bg-transparent text-white px-10 py-4 rounded-[50px] no-underline font-semibold text-base border-2 border-white/30 transition-all duration-300 hover:bg-white hover:text-[#015fc9] hover:border-white"
                        >
                            Our Services
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Features;
