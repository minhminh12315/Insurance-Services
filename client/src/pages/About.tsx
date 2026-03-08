import { Link } from 'react-router-dom';
import { PageHeader } from '../components/Header';
import icon03 from '../assets/icon-03-primary.png';
import icon04 from '../assets/icon-04-primary.png';
import carousel2 from '../assets/carousel-2.jpg';
import carousel12 from '../assets/carousel-12.jpg';
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
            <section className="py-16 md:py-[100px] bg-white">
                <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-[60px] items-center">
                    {/* Left side with image and badge */}
                    <div className="relative mb-8 md:mb-0">
                        <img
                            src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=600&h=500&fit=crop"
                            alt="Happy family"
                            className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
                        />
                        <div className="absolute top-6 -left-4 sm:-left-8 bg-gradient-to-br from-[#015fc9] to-[#007bff] text-white px-6 py-6 sm:p-[30px_25px] rounded-[15px] text-center shadow-[0_10px_40px_rgba(1,95,201,0.4)]">
                            <div className="text-[36px] sm:text-[48px] font-bold leading-none">25</div>
                            <div className="text-base sm:text-[18px] font-medium mt-1">Years</div>
                            <div className="text-[10px] sm:text-[12px] opacity-90 mt-1">Experience</div>
                        </div>
                    </div>

                    {/* Right side content */}
                    <div>
                        <h2 className="text-[32px] sm:text-[42px] font-bold text-[#0a1628] mb-6 md:mb-[25px] leading-[1.3]">
                            We're Here To Assist You With Exploring Protection
                        </h2>
                        <p className="text-[#015fc9] leading-[1.8] mb-8 md:mb-[35px] text-base sm:text-[18px]">
                            Aliqu diam amet diam et eos. Clita erat ipsum et lorem sed stet
                            lorem sit clita duo justo erat amet
                        </p>

                        {/* Feature boxes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 md:mb-[35px]">
                            <div className="flex items-center gap-4 sm:gap-[15px]">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#015fc9] rounded-[10px] flex items-center justify-center shrink-0">
                                    <img src={icon03} alt="Flexible Insurance Plans" className="w-7 h-7 sm:w-9 sm:h-9 object-contain brightness-0 invert" />
                                </div>
                                <span className="text-lg sm:text-[20px] font-bold text-[#0a1628] leading-tight">Flexible Insurance Plans</span>
                            </div>
                            <div className="flex items-center gap-4 sm:gap-[15px]">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#015fc9] rounded-[10px] flex items-center justify-center shrink-0">
                                    <img src={icon04} alt="Money Back Guarantee" className="w-7 h-7 sm:w-9 sm:h-9 object-contain brightness-0 invert" />
                                </div>
                                <span className="text-lg sm:text-[20px] font-bold text-[#0a1628] leading-tight">Money Back Guarantee</span>
                            </div>
                        </div>

                        <p className="text-[#666] leading-[1.8] mb-6 sm:mb-[25px] text-base sm:text-[18px]">
                            Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et
                            eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore
                            erat amet
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

            {/* Statistics Section with Dual-Pane Background */}
            <section className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left Side: Blue Background with Image Overlay */}
                <div className="relative bg-[#015fc9] py-16 md:py-[100px] px-5 flex justify-center lg:justify-end overflow-hidden">
                    {/* Background City Image Overlay */}
                    <div
                        className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center"
                        style={{ backgroundImage: `url(${carousel12})` }}
                    />
                    <div className="relative max-w-[500px] text-white lg:mr-10 text-center lg:text-left">
                        <h2 className="text-[32px] sm:text-[42px] font-bold mb-6 md:mb-[25px] leading-[1.3]">
                            For Individuals And Organisations
                        </h2>
                        <p className="opacity-90 leading-[1.8] mb-10 text-sm sm:text-base">
                            Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet
                        </p>
                        <Link
                            to="/about"
                            className="inline-block bg-[#00d8ff] text-[#0a1628] px-8 sm:px-[40px] py-3.5 sm:py-4 rounded-[10px] no-underline font-semibold shadow-lg hover:bg-white transition-all duration-300"
                        >
                            More Details
                        </Link>
                    </div>
                </div>

                {/* Right Side: White Background with Family Image Overlay */}
                <div className="relative bg-white py-16 md:py-[100px] px-5 flex justify-center lg:justify-start overflow-hidden border-t lg:border-t-0 lg:border-l border-[#eee]">
                    {/* Background Family Image Overlay */}
                    <div
                        className="absolute inset-0 opacity-10 pointer-events-none bg-cover bg-center"
                        style={{ backgroundImage: `url(${carousel2})` }}
                    />
                    <div className="relative max-w-[500px] w-full lg:ml-20">
                        <div className="grid grid-cols-2 gap-y-10 sm:gap-y-12 gap-x-8 sm:gap-x-10">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-left">
                                    <div className="text-[36px] sm:text-[45px] md:text-[55px] font-bold text-[#0a1628] leading-none mb-3">
                                        {stat.number}
                                    </div>
                                    <div className="text-[#015fc9] text-base sm:text-[18px] font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* Team Section */}
            <section className="py-16 md:py-[100px] bg-white">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="text-center mb-10 md:mb-[60px]">
                        <h2 className="text-[32px] sm:text-[42px] font-bold text-[#0a1628] mb-4 sm:mb-5">
                            Meet Our Professional Team Members
                        </h2>
                        <p className="text-[#666] max-w-[700px] mx-auto leading-[1.8] text-sm sm:text-base">
                            Our dedicated team of professionals is here to guide you through every step of your insurance journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px]">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-[20px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-[10px] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] group"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-[280px] sm:h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Social overlay */}
                                    <div className="absolute bottom-[15px] left-1/2 -translate-x-1/2 flex gap-[10px]">
                                        {['facebook', 'twitter', 'linkedin'].map((social) => (
                                            <a
                                                key={social}
                                                href="#"
                                                className="w-9 h-9 sm:w-10 sm:h-10 bg-[#015fc9] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#0047ab] hover:scale-110"
                                            >
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="white">
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
                                <div className="p-5 sm:p-[25px] text-center">
                                    <h4 className="text-lg sm:text-xl font-semibold text-[#0a1628] mb-1.5 sm:mb-2">
                                        {member.name}
                                    </h4>
                                    <p className="text-[#666] text-xs sm:text-sm">{member.role}</p>
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
