import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const About = () => {
    const stats = [
        { number: '1234', label: 'Happy Clients', textColor: 'text-[#015fc9]' },
        { number: '1234', label: 'Projects Succeed', textColor: 'text-[#ff6b6b]' },
        { number: '1234', label: 'Awards Achieved', textColor: 'text-[#015fc9]' },
        { number: '1234', label: 'Team Members', textColor: 'text-[#ff6b6b]' },
    ];

    const team = [
        { name: 'John Smith', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop' },
        { name: 'Sarah Johnson', role: 'Insurance Advisor', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' },
        { name: 'Michael Brown', role: 'Claims Manager', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },
        { name: 'Emily Davis', role: 'Customer Support', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop' },
    ];

    return (
        <div>
            {/* Page Header */}
            <PageHeader title="About Us" currentPage="About" />

            {/* About Section with 25 Years Experience */}
            <section className="py-[100px] bg-white">
                <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                    {/* Left side with image and badge */}
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=600&h=500&fit=crop"
                            alt="Happy family"
                            className="w-full h-[500px] object-cover rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
                        />
                        <div className="absolute top-[30px] -left-[30px] bg-gradient-to-br from-[#015fc9] to-[#007bff] text-white p-[30px_25px] rounded-[15px] text-center shadow-[0_10px_40px_rgba(1,95,201,0.4)]">
                            <div className="text-[48px] font-bold leading-none">25</div>
                            <div className="text-[18px] font-medium mt-[5px]">Years</div>
                            <div className="text-[12px] opacity-90 mt-[5px]">Experience</div>
                        </div>
                    </div>

                    {/* Right side content */}
                    <div>
                        <h2 className="text-[42px] font-bold text-[#0a1628] mb-[25px] leading-[1.3]">
                            We're Here To Assist You With Exploring Protection
                        </h2>
                        <p className="text-[#666] leading-[1.8] mb-[35px] text-base">
                            With over 25 years of experience in the insurance industry, we provide comprehensive coverage solutions
                            tailored to meet your unique needs. Our expert team is dedicated to protecting what matters most to you.
                        </p>

                        {/* Feature boxes */}
                        <div className="grid grid-cols-2 gap-5 mb-[35px]">
                            <div className="bg-[#f8f9fa] p-[25px] rounded-[15px] flex items-center gap-[15px]">
                                <div className="w-[50px] h-[50px] bg-[#015fc9] rounded-full flex items-center justify-center text-2xl text-white">
                                    ✓
                                </div>
                                <span className="font-semibold text-[#0a1628]">Flexible Insurance Plans</span>
                            </div>
                            <div className="bg-[#f8f9fa] p-[25px] rounded-[15px] flex items-center gap-[15px]">
                                <div className="w-[50px] h-[50px] bg-[#015fc9] rounded-full flex items-center justify-center text-2xl text-white">
                                    💰
                                </div>
                                <span className="font-semibold text-[#0a1628]">Money Back Guarantee</span>
                            </div>
                        </div>

                        <p className="text-[#666] leading-[1.8] mb-[25px] text-[15px]">
                            We understand the importance of securing your future. Our dedicated team works tirelessly to provide
                            you with the best insurance solutions that offer peace of mind and financial security.
                        </p>

                        {/* Call to action */}
                        <div className="flex items-center gap-5 px-[25px] py-5 bg-blue-50/50 rounded-[15px] border-l-4 border-[#015fc9]">
                            <div className="w-[60px] h-[60px] bg-[#015fc9] rounded-full flex items-center justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm text-[#666]">Call Us Anytime</div>
                                <div className="text-[24px] font-bold text-[#015fc9]">+84 123 456 789</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section with Blue Background */}
            <section className="bg-gradient-to-br from-[#015fc9] to-[#0047ab] py-[100px]">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        {/* Left content */}
                        <div className="text-white">
                            <h2 className="text-[42px] font-bold mb-[25px] leading-[1.3]">
                                For Individuals And Organisations
                            </h2>
                            <p className="opacity-90 leading-[1.8] mb-[30px]">
                                We provide tailored insurance solutions for both individuals and businesses.
                                Our comprehensive coverage options ensure complete protection for all your needs.
                            </p>
                            <Link
                                to="/services"
                                className="inline-block bg-white text-[#015fc9] px-[35px] py-4 rounded-[50px] no-underline font-semibold"
                            >
                                More Details
                            </Link>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 gap-5">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-[35px_25px] rounded-[20px] text-center transition-transform duration-300 hover:-translate-y-[10px]"
                                >
                                    <div
                                        className={`text-[48px] font-bold mb-2.5 ${stat.textColor}`}
                                    >
                                        {stat.number}
                                    </div>
                                    <div className="text-[#666] text-[15px] font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-[100px] bg-white">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="text-center mb-[60px]">
                        <h2 className="text-[42px] font-bold text-[#0a1628] mb-5">
                            Meet Our Professional Team Members
                        </h2>
                        <p className="text-[#666] max-w-[700px] mx-auto leading-[1.8]">
                            Our dedicated team of professionals is here to guide you through every step of your insurance journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[30px]">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-[20px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-[10px] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] group"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Social overlay */}
                                    <div className="absolute bottom-[15px] left-1/2 -translate-x-1/2 flex gap-[10px]">
                                        {['facebook', 'twitter', 'linkedin'].map((social) => (
                                            <a
                                                key={social}
                                                href="#"
                                                className="w-10 h-10 bg-[#015fc9] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#0047ab] hover:scale-110"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                                    {social === 'facebook' && (
                                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                                    )}
                                                    {social === 'twitter' && (
                                                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                                                    )}
                                                    {social === 'linkedin' && (
                                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                                                    )}
                                                </svg>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-[25px] text-center">
                                    <h4 className="text-xl font-semibold text-[#0a1628] mb-2">
                                        {member.name}
                                    </h4>
                                    <p className="text-[#666] text-sm">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
