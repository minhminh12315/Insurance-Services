import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const Services = () => {
    const services = [
        {
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
            ),
            title: 'Life Insurance',
            description: 'Protect your loved ones with comprehensive life insurance coverage that ensures financial security for your family\'s future.',
        },
        {
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
            ),
            title: 'Health Insurance',
            description: 'Access quality healthcare with our flexible health insurance plans tailored to meet your medical needs and budget.',
        },
        {
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            ),
            title: 'Home Insurance',
            description: 'Safeguard your home and belongings with our reliable home insurance solutions protecting against all risks.',
        },
        {
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#015fc9" strokeWidth="1.5">
                    <rect x="1" y="3" width="15" height="13" rx="2" />
                    <circle cx="8.5" cy="13.5" r="2.5" />
                    <circle cx="18.5" cy="13.5" r="2.5" />
                    <path d="M16 8h4l3 5v4h-7" />
                </svg>
            ),
            title: 'Vehicle Insurance',
            description: 'Drive with confidence knowing your vehicle is fully protected against accidents, theft, and all types of damages.',
        },
    ];

    return (
        <div>
            {/* Page Header */}
            <PageHeader title="Services" currentPage="Services" />

            {/* Services Section */}
            <section className="py-[100px] bg-white">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="text-center mb-[60px]">
                        <h2 className="text-[42px] font-bold text-[#0a1628] mb-5">
                            We Provide Professional Insurance Services
                        </h2>
                        <p className="text-[#666] max-w-[700px] mx-auto leading-[1.8]">
                            Explore our wide range of insurance products designed to protect you and your loved ones
                            with comprehensive coverage options.
                        </p>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-[30px]">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white p-[40px_35px] rounded-[20px] shadow-[0_5px_30px_rgba(0,0,0,0.08)] transition-all duration-300 border border-[#eee] hover:-translate-y-[10px] hover:shadow-[0_20px_60px_rgba(1,95,201,0.15)] hover:border-[#015fc9]"
                            >
                                <div className="flex items-start gap-[25px]">
                                    <div className="w-20 h-20 bg-[linear-gradient(135deg,rgba(1,95,201,0.1)_0%,rgba(0,123,255,0.1)_100%)] rounded-[15px] flex items-center justify-center shrink-0">
                                        {service.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-[22px] font-semibold text-[#0a1628] mb-[15px]">
                                            {service.title}
                                        </h4>
                                        <p className="text-[#666] text-[15px] leading-[1.7] mb-5">
                                            {service.description}
                                        </p>
                                        <Link
                                            to={`/services/${service.title.toLowerCase().replace(' ', '-')}`}
                                            className="inline-flex items-center gap-2 text-[#015fc9] no-underline font-semibold text-sm px-[25px] py-[10px] border-2 border-[#015fc9] rounded-[50px] transition-all duration-300 hover:bg-[#015fc9] hover:text-white"
                                        >
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
