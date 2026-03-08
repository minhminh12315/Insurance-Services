import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi, newsApi, type InsuranceCategoryModel, type NewsModel } from '../services/insuranceApi';
import icon06 from '../assets/icon-06-primary.png';
import icon03 from '../assets/icon-03-primary.png';
import icon04 from '../assets/icon-04-primary.png';
import icon07 from '../assets/icon-07-primary.png';
import homeDoctor from '../assets/home_doctor.jpg';
import lifeIcon from '../assets/life_insurance.png';
import healthIcon from '../assets/health_insurance.png';
import homeIcon from '../assets/home_insurance.png';
import vehicleIcon from '../assets/vehicle_insurance.png';
import carousel2 from '../assets/carousel-2.jpg';
import carousel12 from '../assets/carousel-12.jpg';

const Home = () => {
    // Fallback data in case API fails or database is not seeded
    const fallbackCategories: InsuranceCategoryModel[] = [
        {
            categoryId: 1,
            categoryName: 'Bảo hiểm nhân thọ',
            description: 'Bảo vệ tài chính cho gia đình bạn với các gói bảo hiểm nhân thọ linh hoạt và quyền lợi cao.',
        },
        {
            categoryId: 2,
            categoryName: 'Bảo hiểm y tế',
            description: 'Chi trả chi phí khám chữa bệnh, phẫu thuật và nằm viện với mạng lưới bệnh viện rộng khắp.',
        },
        {
            categoryId: 3,
            categoryName: 'Bảo hiểm xe cơ giới',
            description: 'Bảo vệ phương tiện của bạn trước mọi rủi ro về tai nạn, mất cắp và hư hỏng.',
        },
        {
            categoryId: 4,
            categoryName: 'Bảo hiểm nhà ở',
            description: 'Bảo vệ ngôi nhà và tài sản của bạn trước thiên tai, hỏa hoạn và các rủi ro khác.',
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [categories, setCategories] = useState<InsuranceCategoryModel[]>([]);
    const [news, setNews] = useState<NewsModel[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isLoadingNews, setIsLoadingNews] = useState(true);

    const heroSlides = [
        {
            title: 'The Best Insurance Begins Here',
            subtitle: 'Protecting your future with comprehensive coverage plans designed to meet all your insurance needs.',
            image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&h=1080&fit=crop',
        },
        {
            title: 'Insurance Creates Wealth For Everyone',
            subtitle: 'Secure your family\'s future with our trusted insurance solutions and expert guidance.',
            image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&h=1080&fit=crop',
        },
    ];

    // Map category names to icons
    const getCategoryIcon = (categoryName: string) => {
        const name = categoryName.toLowerCase();
        if (name.includes('life') || name.includes('nhân thọ')) return lifeIcon;
        if (name.includes('health') || name.includes('y tế') || name.includes('sức khỏe')) return healthIcon;
        if (name.includes('home') || name.includes('nhà') || name.includes('căn hộ')) return homeIcon;
        if (name.includes('vehicle') || name.includes('motor') || name.includes('xe') || name.includes('ô tô')) return vehicleIcon;
        return lifeIcon; // default
    };

    // Fetch categories and news on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryApi.getAllCategories();
                // If API returns data, use it; otherwise use fallback
                if (data && data.length > 0) {
                    setCategories(data);
                } else {
                    console.log('No categories from API, using fallback data');
                    setCategories(fallbackCategories);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                // Use fallback data when API fails
                setCategories(fallbackCategories);
            } finally {
                setIsLoadingCategories(false);
            }
        };

        const fetchNews = async () => {
            try {
                const data = await newsApi.getAllNews();
                // Get latest 3 news items
                setNews(data.slice(0, 3));
            } catch (error) {
                console.error('Failed to fetch news:', error);
            } finally {
                setIsLoadingNews(false);
            }
        };

        fetchCategories();
        fetchNews();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroSlides.length]);

    const stats = [
        { number: '1234', label: 'Happy Clients', color: '#015fc9' },
        { number: '1234', label: 'Projects Succeed', color: '#ff6b6b' },
        { number: '1234', label: 'Awards Achieved', color: '#015fc9' },
        { number: '1234', label: 'Team Members', color: '#ff6b6b' },
    ];

    // Remove hardcoded services - now using dynamic categories
    // const services = [...];

    const features = [
        { icon: icon06, title: 'Easy Process', delay: '0.1s' },
        { icon: icon03, title: 'Fast Delivery', delay: '0.2s' },
        { icon: icon04, title: 'Policy Controlling', delay: '0.3s' },
        { icon: icon07, title: 'Money Saving', delay: '0.4s' },
    ];

    const team = [
        { name: 'John Smith', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop' },
        { name: 'Sarah Johnson', role: 'Insurance Advisor', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' },
        { name: 'Michael Brown', role: 'Claims Manager', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },
        { name: 'Emily Davis', role: 'Customer Support', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop' },
    ];

    const testimonials = [
        {
            text: 'Outstanding service! The team at INSLIFE made the entire insurance process seamless and stress-free. Highly recommended!',
            name: 'David Wilson',
            role: 'Business Owner',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        },
        {
            text: 'I\'ve been with INSLIFE for years and their customer service is exceptional. They truly care about their clients.',
            name: 'Jennifer Lee',
            role: 'Healthcare Professional',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        },
        {
            text: 'The claims process was quick and hassle-free. INSLIFE exceeded my expectations in every way.',
            name: 'Robert Chen',
            role: 'IT Consultant',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        },
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className="h-screen relative overflow-hidden">
                {heroSlides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 flex items-center`}
                        style={{
                            backgroundImage: `linear-gradient(rgba(0, 31, 63, 0.8), rgba(0, 31, 63, 0.8)), url(${slide.image})`,
                            opacity: currentSlide === index ? 1 : 0,
                        }}
                    >
                        <div className="max-w-[1200px] mx-auto px-5 text-white">
                            <h1 className="text-[clamp(36px,5vw,64px)] font-bold mb-5 leading-[1.2] max-w-[700px]">
                                {slide.title}
                            </h1>
                            <p className="text-lg mb-10 opacity-90 max-w-[600px] leading-[1.8]">
                                {slide.subtitle}
                            </p>
                            <Link
                                to="/services"
                                className="inline-block bg-[linear-gradient(135deg,#015fc9_0%,#007bff_100%)] text-white px-10 py-[18px] rounded-[50px] no-underline font-semibold text-lg transition-all duration-300 shadow-[0_4px_20px_rgba(1,95,201,0.4)]"
                            >
                                More Details
                            </Link>
                        </div>
                    </div>
                ))}
                {/* Slide indicators */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-3 rounded-[6px] border-none cursor-pointer transition-all duration-300 ${currentSlide === index ? 'w-10 bg-[#015fc9]' : 'w-3 bg-white/50'}`}
                        />
                    ))}
                </div>
            </section>

            {/* About Section with 25 Years Experience */}
            <section className="py-[100px] bg-white">
                <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-[60px] items-center">
                    {/* Left side with image and badge */}
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=600&h=500&fit=crop"
                            alt="Happy family"
                            className="w-full h-[500px] object-cover rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
                        />
                        {/* 25 Years Badge */}
                        <div className="absolute top-[30px] -left-[30px] bg-[linear-gradient(135deg,#015fc9_0%,#007bff_100%)] text-white px-[25px] py-[30px] rounded-[15px] text-center shadow-[0_10px_40px_rgba(1,95,201,0.4)]">
                            <div className="text-[48px] font-bold leading-none">25</div>
                            <div className="text-lg font-medium mt-1">Years</div>
                            <div className="text-[12px] opacity-90 mt-1">Experience</div>
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
                                <div className="w-12 h-12 bg-[#015fc9] rounded-[10px] flex items-center justify-center shrink-0">
                                    <img src={icon03} alt="Flexible Insurance Plans" className="w-8 h-8 object-contain brightness-0 invert" />
                                </div>
                                <span className="font-semibold text-[#0a1628]">Flexible Insurance Plans</span>
                            </div>
                            <div className="bg-[#f8f9fa] p-[25px] rounded-[15px] flex items-center gap-[15px]">
                                <div className="w-12 h-12 bg-[#015fc9] rounded-[10px] flex items-center justify-center shrink-0">
                                    <img src={icon04} alt="Money Back Guarantee" className="w-8 h-8 object-contain brightness-0 invert" />
                                </div>
                                <span className="font-semibold text-[#0a1628]">Money Back Guarantee</span>
                            </div>
                        </div>

                        {/* Call to action */}
                        <div className="flex items-center gap-5 px-[25px] py-5 bg-[linear-gradient(135deg,rgba(1,95,201,0.1)_0%,rgba(0,123,255,0.1)_100%)] rounded-[15px] border-l-4 border-[#015fc9]">
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
                <div className="relative bg-[#015fc9] py-[100px] px-5 flex justify-center lg:justify-end overflow-hidden">
                    {/* Background City Image Overlay */}
                    <div
                        className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center"
                        style={{ backgroundImage: `url(${carousel12})` }}
                    />
                    <div className="relative max-w-[500px] text-white lg:mr-10">
                        <h2 className="text-[42px] font-bold mb-[25px] leading-[1.3]">
                            For Individuals And Organisations
                        </h2>
                        <p className="opacity-90 leading-[1.8] mb-[40px]">
                            Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet
                        </p>
                        <Link
                            to="/about"
                            className="inline-block bg-[#00d8ff] text-[#0a1628] px-[40px] py-4 rounded-[10px] no-underline font-semibold shadow-lg hover:bg-white transition-all duration-300"
                        >
                            More Details
                        </Link>
                    </div>
                </div>

                {/* Right Side: White Background with Family Image Overlay */}
                <div className="relative bg-white py-[100px] px-5 flex justify-center lg:justify-start overflow-hidden border-t lg:border-t-0 lg:border-l border-[#eee]">
                    {/* Background Family Image Overlay */}
                    <div
                        className="absolute inset-0 opacity-10 pointer-events-none bg-cover bg-center"
                        style={{ backgroundImage: `url(${carousel2})` }}
                    />
                    <div className="relative max-w-[500px] w-full lg:ml-20">
                        <div className="grid grid-cols-2 gap-y-12 gap-x-10">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-left">
                                    <div className="text-[55px] font-bold text-[#0a1628] leading-none mb-3">
                                        {stat.number}
                                    </div>
                                    <div className="text-[#015fc9] text-[18px] font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-[100px] bg-white">
                <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-[42px] font-bold text-[#0a1628] mb-5 leading-tight">
                            Few Reasons Why People Choosing Us!
                        </h2>
                        <p className="text-[#666] mb-10 leading-[1.8]">
                            Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="wow fadeIn h-full"
                                    data-wow-delay={feature.delay}
                                    style={{ visibility: 'visible', animationDelay: feature.delay, animationName: 'fadeIn' }}
                                >
                                    <div className="bg-[#f0f7ff] rounded-[10px] h-full p-3">
                                        <div className="bg-white flex flex-col justify-center text-center rounded-[10px] h-full py-8 px-3">
                                            <img className="self-center mb-3 h-12 w-auto" src={feature.icon} alt={feature.title} />
                                            <h5 className="mb-0 text-lg font-semibold text-[#0a1628]">{feature.title}</h5>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="h-full min-h-[500px]">
                        <img
                            src={homeDoctor}
                            alt="Professional woman looking at tablet"
                            className="w-full h-full object-cover rounded-[20px]"
                        />
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-[100px] bg-white">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="text-center mb-[60px]">
                        <h2 className="text-[42px] font-bold text-[#0a1628] mb-5">
                            We Provide Professional Insurance Services
                        </h2>
                        <p className="text-[#666] max-w-[700px] mx-auto leading-[1.8]">
                            Explore our wide range of insurance products designed to protect you and your loved ones.
                        </p>
                    </div>

                    {isLoadingCategories ? (
                        <div className="text-center py-10">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#015fc9] border-t-transparent"></div>
                            <p className="mt-4 text-[#666]">Loading insurance services...</p>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-[#666]">No insurance services available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
                            {categories.map((category) => (
                                <div
                                    key={category.categoryId}
                                    className="bg-white p-8 rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] flex flex-col"
                                >
                                    <div className="flex items-center gap-5 mb-6">
                                        <div className="w-[60px] h-[60px] bg-[#015fc9] rounded-[10px] flex items-center justify-center shrink-0">
                                            <img
                                                src={getCategoryIcon(category.categoryName)}
                                                alt={category.categoryName}
                                                className="w-10 h-10 object-contain brightness-0 invert"
                                            />
                                        </div>
                                        <h4 className="text-2xl font-bold text-[#0a1628] leading-tight">
                                            {category.categoryName}
                                        </h4>
                                    </div>
                                    <p className="text-[#666] leading-[1.8] mb-8">
                                        {category.description || 'Comprehensive coverage for your protection needs.'}
                                    </p>
                                    <div className="mt-auto">
                                        <Link
                                            to="/calculator"
                                            className="inline-block bg-[#f0f7ff] text-[#015fc9] px-6 py-3 rounded-[10px] font-semibold text-sm transition-all duration-300 hover:bg-[#015fc9] hover:text-white"
                                        >
                                            Read More & Get Quote
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Award Winning Company Section */}
            <section className="relative bg-[linear-gradient(135deg,#015fc9_0%,#0047ab_100%)] py-[100px] overflow-hidden">
                {/* Background Image Overlay */}
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center"
                    style={{ backgroundImage: `url(${carousel12})` }}
                />
                <div className="relative max-w-[1200px] mx-auto px-5 grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-[60px] items-center">
                    <div className="text-white">
                        <h2 className="text-[42px] font-bold mb-[25px] leading-[1.3]">
                            We're Award Winning Insurance Company
                        </h2>
                        <p className="opacity-90 leading-relaxed mb-8 text-base">
                            Recognized for excellence in customer service and comprehensive coverage solutions.
                            Our commitment to protecting your future has earned us numerous industry accolades.
                        </p>
                        <div className="flex items-center gap-5 px-[25px] py-5 bg-white/10 rounded-[15px] backdrop-blur-[10px]">
                            <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="#015fc9">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm opacity-90">Call Us Anytime</div>
                                <div className="text-[24px] font-bold">+84 123 456 789</div>
                            </div>
                        </div>
                    </div>

                    {/* Quote Form */}
                    <div className="bg-white p-10 rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
                        <h3 className="text-2xl font-bold text-[#0a1628] mb-[30px]">
                            Get A Free Quote
                        </h3>
                        <form className="flex flex-col gap-5">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="p-[15px_20px] rounded-[10px] border border-[#eee] text-sm outline-none transition-colors duration-300 focus:border-[#015fc9]"
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="p-[15px_20px] rounded-[10px] border border-[#eee] text-sm outline-none transition-colors duration-300 focus:border-[#015fc9]"
                            />
                            <select
                                className="p-[15px_20px] rounded-[10px] border border-[#eee] text-sm outline-none bg-white cursor-pointer transition-colors duration-300 focus:border-[#015fc9]"
                            >
                                <option value="">Select Insurance Type</option>
                                <option value="life">Life Insurance</option>
                                <option value="health">Health Insurance</option>
                                <option value="home">Home Insurance</option>
                                <option value="vehicle">Vehicle Insurance</option>
                            </select>
                            <textarea
                                placeholder="Your Message"
                                rows={4}
                                className="p-[15px_20px] rounded-[10px] border border-[#eee] text-sm outline-none resize-none transition-colors duration-300 focus:border-[#015fc9]"
                            />
                            <button
                                type="submit"
                                className="bg-[linear-gradient(135deg,#015fc9_0%,#007bff_100%)] text-white p-[18px] rounded-[50px] border-none font-semibold text-lg cursor-pointer transition-all duration-300 shadow-[0_5px_15px_rgba(1,95,201,0.3)] hover:shadow-[0_8px_25px_rgba(1,95,201,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Get A Quote
                            </button>
                        </form>
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
                        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed text-base">
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

            {/* Testimonials Section */}
            <section className="py-[100px] bg-[#f8f9fa]">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="text-center mb-[60px]">
                        <h2 className="text-[42px] font-bold text-[#0a1628] mb-5">
                            What They Say About Our Insurance
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed text-base">
                            Hear from our satisfied clients about their experience with INSLIFE.
                        </p>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-[30px]">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-white p-10 rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] relative transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
                            >
                                {/* Quote icon */}
                                <div className="absolute top-[25px] right-[30px] text-[60px] text-[rgba(1,95,201,0.1)] leading-none italic font-serif">
                                    "
                                </div>
                                <p className="text-[#666] leading-[1.8] mb-[30px] text-[15px] italic">
                                    {testimonial.text}
                                </p>
                                <div className="flex items-center gap-[15px]">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-[60px] h-[60px] rounded-full object-cover"
                                    />
                                    <div>
                                        <h5 className="text-lg font-semibold text-[#0a1628]">
                                            {testimonial.name}
                                        </h5>
                                        <p className="text-[#015fc9] text-sm">{testimonial.role}</p>
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

export default Home;
