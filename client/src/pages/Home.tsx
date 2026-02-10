import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

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

    const services = [
        {
            icon: '❤️',
            title: 'Life Insurance',
            description: 'Protect your loved ones with comprehensive life insurance coverage for peace of mind.',
        },
        {
            icon: '🏥',
            title: 'Health Insurance',
            description: 'Access quality healthcare with our flexible health insurance plans tailored to your needs.',
        },
        {
            icon: '🏠',
            title: 'Home Insurance',
            description: 'Safeguard your home and belongings with our reliable home insurance solutions.',
        },
        {
            icon: '🚗',
            title: 'Vehicle Insurance',
            description: 'Drive with confidence knowing your vehicle is fully protected against all risks.',
        },
    ];

    const features = [
        { icon: '⚡', title: 'Easy Process', description: 'Simple and streamlined application process' },
        { icon: '🚀', title: 'Fast Delivery', description: 'Quick policy issuance and claims processing' },
        { icon: '🎛️', title: 'Policy Controlling', description: 'Full control over your insurance policies' },
        { icon: '💰', title: 'Money Saving', description: 'Competitive rates and maximum savings' },
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
        <div style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Hero Section */}
            <section
                style={{
                    height: '100vh',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {heroSlides.map((slide, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `linear-gradient(rgba(0, 31, 63, 0.8), rgba(0, 31, 63, 0.8)), url(${slide.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: currentSlide === index ? 1 : 0,
                            transition: 'opacity 1s ease-in-out',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                maxWidth: '1200px',
                                margin: '0 auto',
                                padding: '0 20px',
                                color: '#ffffff',
                            }}
                        >
                            <h1
                                style={{
                                    fontSize: 'clamp(36px, 5vw, 64px)',
                                    fontWeight: 700,
                                    marginBottom: '20px',
                                    lineHeight: 1.2,
                                    maxWidth: '700px',
                                }}
                            >
                                {slide.title}
                            </h1>
                            <p
                                style={{
                                    fontSize: '18px',
                                    marginBottom: '40px',
                                    opacity: 0.9,
                                    maxWidth: '600px',
                                    lineHeight: 1.8,
                                }}
                            >
                                {slide.subtitle}
                            </p>
                            <Link
                                to="/services"
                                style={{
                                    display: 'inline-block',
                                    background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                                    color: '#ffffff',
                                    padding: '18px 40px',
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 20px rgba(1, 95, 201, 0.4)',
                                }}
                            >
                                More Details
                            </Link>
                        </div>
                    </div>
                ))}
                {/* Slide indicators */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '12px',
                    }}
                >
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            style={{
                                width: currentSlide === index ? '40px' : '12px',
                                height: '12px',
                                borderRadius: '6px',
                                background: currentSlide === index ? '#015fc9' : 'rgba(255,255,255,0.5)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* About Section with 25 Years Experience */}
            <section style={{ padding: '100px 0', background: '#ffffff' }}>
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 20px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: '60px',
                        alignItems: 'center',
                    }}
                >
                    {/* Left side with image and badge */}
                    <div style={{ position: 'relative' }}>
                        <img
                            src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=600&h=500&fit=crop"
                            alt="Happy family"
                            style={{
                                width: '100%',
                                height: '500px',
                                objectFit: 'cover',
                                borderRadius: '20px',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                            }}
                        />
                        {/* 25 Years Badge */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '30px',
                                left: '-30px',
                                background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                                color: '#ffffff',
                                padding: '30px 25px',
                                borderRadius: '15px',
                                textAlign: 'center',
                                boxShadow: '0 10px 40px rgba(1, 95, 201, 0.4)',
                            }}
                        >
                            <div style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1 }}>25</div>
                            <div style={{ fontSize: '18px', fontWeight: 500, marginTop: '5px' }}>Years</div>
                            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '5px' }}>Experience</div>
                        </div>
                    </div>

                    {/* Right side content */}
                    <div>
                        <h2
                            style={{
                                fontSize: '42px',
                                fontWeight: 700,
                                color: '#0a1628',
                                marginBottom: '25px',
                                lineHeight: 1.3,
                            }}
                        >
                            We're Here To Assist You With Exploring Protection
                        </h2>
                        <p
                            style={{
                                color: '#666',
                                lineHeight: 1.8,
                                marginBottom: '35px',
                                fontSize: '16px',
                            }}
                        >
                            With over 25 years of experience in the insurance industry, we provide comprehensive coverage solutions
                            tailored to meet your unique needs. Our expert team is dedicated to protecting what matters most to you.
                        </p>

                        {/* Feature boxes */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '35px' }}>
                            <div
                                style={{
                                    background: '#f8f9fa',
                                    padding: '25px',
                                    borderRadius: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                }}
                            >
                                <div
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background: '#015fc9',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px',
                                    }}
                                >
                                    ✓
                                </div>
                                <span style={{ fontWeight: 600, color: '#0a1628' }}>Flexible Insurance Plans</span>
                            </div>
                            <div
                                style={{
                                    background: '#f8f9fa',
                                    padding: '25px',
                                    borderRadius: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                }}
                            >
                                <div
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background: '#015fc9',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px',
                                    }}
                                >
                                    💰
                                </div>
                                <span style={{ fontWeight: 600, color: '#0a1628' }}>Money Back Guarantee</span>
                            </div>
                        </div>

                        {/* Call to action */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                padding: '20px 25px',
                                background: 'linear-gradient(135deg, rgba(1, 95, 201, 0.1) 0%, rgba(0, 123, 255, 0.1) 100%)',
                                borderRadius: '15px',
                                borderLeft: '4px solid #015fc9',
                            }}
                        >
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    background: '#015fc9',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', color: '#666' }}>Call Us Anytime</div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: '#015fc9' }}>+84 123 456 789</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section with Blue Background */}
            <section
                style={{
                    background: 'linear-gradient(135deg, #015fc9 0%, #0047ab 100%)',
                    padding: '100px 0',
                }}
            >
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 20px',
                    }}
                >
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '40px',
                            alignItems: 'center',
                        }}
                    >
                        {/* Left content */}
                        <div style={{ color: '#ffffff' }}>
                            <h2
                                style={{
                                    fontSize: '42px',
                                    fontWeight: 700,
                                    marginBottom: '25px',
                                    lineHeight: 1.3,
                                }}
                            >
                                For Individuals And Organisations
                            </h2>
                            <p style={{ opacity: 0.9, lineHeight: 1.8, marginBottom: '30px' }}>
                                We provide tailored insurance solutions for both individuals and businesses.
                                Our comprehensive coverage options ensure complete protection for all your needs.
                            </p>
                            <Link
                                to="/about"
                                style={{
                                    display: 'inline-block',
                                    background: '#ffffff',
                                    color: '#015fc9',
                                    padding: '16px 35px',
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                More Details
                            </Link>
                        </div>

                        {/* Stats grid */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '20px',
                            }}
                        >
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    style={{
                                        background: '#ffffff',
                                        padding: '35px 25px',
                                        borderRadius: '20px',
                                        textAlign: 'center',
                                        transition: 'transform 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-10px)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                                >
                                    <div
                                        style={{
                                            fontSize: '48px',
                                            fontWeight: 700,
                                            color: stat.color,
                                            marginBottom: '10px',
                                        }}
                                    >
                                        {stat.number}
                                    </div>
                                    <div style={{ color: '#666', fontSize: '15px', fontWeight: 500 }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section style={{ padding: '100px 0', background: '#f8f9fa' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2
                            style={{
                                fontSize: '42px',
                                fontWeight: 700,
                                color: '#0a1628',
                                marginBottom: '20px',
                            }}
                        >
                            Few Reasons Why People Choosing Us!
                        </h2>
                        <p style={{ color: '#666', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>
                            We are committed to providing exceptional insurance services with transparency,
                            reliability, and customer satisfaction at the core of everything we do.
                        </p>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                            gap: '30px',
                        }}
                    >
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                style={{
                                    background: '#ffffff',
                                    padding: '40px 30px',
                                    borderRadius: '20px',
                                    textAlign: 'center',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                                    transition: 'all 0.3s ease',
                                    border: '1px solid transparent',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.borderColor = '#015fc9';
                                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(1, 95, 201, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'transparent';
                                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.05)';
                                }}
                            >
                                <div
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        background: 'linear-gradient(135deg, rgba(1, 95, 201, 0.1) 0%, rgba(0, 123, 255, 0.1) 100%)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 25px',
                                        fontSize: '36px',
                                    }}
                                >
                                    {feature.icon}
                                </div>
                                <h4 style={{ fontSize: '20px', fontWeight: 600, color: '#0a1628', marginBottom: '15px' }}>
                                    {feature.title}
                                </h4>
                                <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.7 }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section style={{ padding: '100px 0', background: '#ffffff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2
                            style={{
                                fontSize: '42px',
                                fontWeight: 700,
                                color: '#0a1628',
                                marginBottom: '20px',
                            }}
                        >
                            We Provide Professional Insurance Services
                        </h2>
                        <p style={{ color: '#666', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>
                            Explore our wide range of insurance products designed to protect you and your loved ones.
                        </p>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '30px',
                        }}
                    >
                        {services.map((service, index) => (
                            <div
                                key={index}
                                style={{
                                    background: '#ffffff',
                                    padding: '40px 35px',
                                    borderRadius: '20px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                                    transition: 'all 0.3s ease',
                                    border: '1px solid #eee',
                                    display: 'flex',
                                    gap: '25px',
                                    alignItems: 'flex-start',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(1, 95, 201, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.05)';
                                }}
                            >
                                <div
                                    style={{
                                        width: '70px',
                                        height: '70px',
                                        background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                                        borderRadius: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '32px',
                                        flexShrink: 0,
                                    }}
                                >
                                    {service.icon}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '22px', fontWeight: 600, color: '#0a1628', marginBottom: '15px' }}>
                                        {service.title}
                                    </h4>
                                    <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
                                        {service.description}
                                    </p>
                                    <Link
                                        to={`/services/${service.title.toLowerCase().replace(' ', '-')}`}
                                        style={{
                                            color: '#015fc9',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            fontSize: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                        }}
                                    >
                                        Read More
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Award Winning Company Section */}
            <section
                style={{
                    background: 'linear-gradient(135deg, #015fc9 0%, #0047ab 100%)',
                    padding: '100px 0',
                }}
            >
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 20px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: '60px',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ color: '#ffffff' }}>
                        <h2
                            style={{
                                fontSize: '42px',
                                fontWeight: 700,
                                marginBottom: '25px',
                                lineHeight: 1.3,
                            }}
                        >
                            We're Award Winning Insurance Company
                        </h2>
                        <p style={{ opacity: 0.9, lineHeight: 1.8, marginBottom: '30px' }}>
                            Recognized for excellence in customer service and comprehensive coverage solutions.
                            Our commitment to protecting your future has earned us numerous industry accolades.
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                padding: '20px 25px',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '15px',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    background: '#ffffff',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="#015fc9">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', opacity: 0.9 }}>Call Us Anytime</div>
                                <div style={{ fontSize: '24px', fontWeight: 700 }}>+84 123 456 789</div>
                            </div>
                        </div>
                    </div>

                    {/* Quote Form */}
                    <div
                        style={{
                            background: '#ffffff',
                            padding: '40px',
                            borderRadius: '20px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                        }}
                    >
                        <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#0a1628', marginBottom: '30px' }}>
                            Get A Free Quote
                        </h3>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <input
                                type="text"
                                placeholder="Your Name"
                                style={{
                                    padding: '15px 20px',
                                    borderRadius: '10px',
                                    border: '1px solid #eee',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.3s ease',
                                }}
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                style={{
                                    padding: '15px 20px',
                                    borderRadius: '10px',
                                    border: '1px solid #eee',
                                    fontSize: '14px',
                                    outline: 'none',
                                }}
                            />
                            <select
                                style={{
                                    padding: '15px 20px',
                                    borderRadius: '10px',
                                    border: '1px solid #eee',
                                    fontSize: '14px',
                                    outline: 'none',
                                    background: '#ffffff',
                                    cursor: 'pointer',
                                }}
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
                                style={{
                                    padding: '15px 20px',
                                    borderRadius: '10px',
                                    border: '1px solid #eee',
                                    fontSize: '14px',
                                    outline: 'none',
                                    resize: 'none',
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    background: 'linear-gradient(135deg, #015fc9 0%, #007bff 100%)',
                                    color: '#ffffff',
                                    padding: '18px',
                                    borderRadius: '50px',
                                    border: 'none',
                                    fontWeight: 600,
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Get A Quote
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section style={{ padding: '100px 0', background: '#ffffff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2
                            style={{
                                fontSize: '42px',
                                fontWeight: 700,
                                color: '#0a1628',
                                marginBottom: '20px',
                            }}
                        >
                            Meet Our Professional Team Members
                        </h2>
                        <p style={{ color: '#666', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>
                            Our dedicated team of professionals is here to guide you through every step of your insurance journey.
                        </p>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                            gap: '30px',
                        }}
                    >
                        {team.map((member, index) => (
                            <div
                                key={index}
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.05)';
                                }}
                            >
                                <div style={{ position: 'relative', overflow: 'hidden' }}>
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        style={{
                                            width: '100%',
                                            height: '300px',
                                            objectFit: 'cover',
                                            transition: 'transform 0.5s ease',
                                        }}
                                    />
                                    {/* Social overlay */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: '15px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            display: 'flex',
                                            gap: '10px',
                                        }}
                                    >
                                        {['facebook', 'twitter', 'linkedin'].map((social) => (
                                            <a
                                                key={social}
                                                href="#"
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    background: '#015fc9',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.3s ease',
                                                }}
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
                                <div style={{ padding: '25px', textAlign: 'center' }}>
                                    <h4 style={{ fontSize: '20px', fontWeight: 600, color: '#0a1628', marginBottom: '8px' }}>
                                        {member.name}
                                    </h4>
                                    <p style={{ color: '#666', fontSize: '14px' }}>{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section style={{ padding: '100px 0', background: '#f8f9fa' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2
                            style={{
                                fontSize: '42px',
                                fontWeight: 700,
                                color: '#0a1628',
                                marginBottom: '20px',
                            }}
                        >
                            What They Say About Our Insurance
                        </h2>
                        <p style={{ color: '#666', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>
                            Hear from our satisfied clients about their experience with INSLIFE.
                        </p>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                            gap: '30px',
                        }}
                    >
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                style={{
                                    background: '#ffffff',
                                    padding: '40px',
                                    borderRadius: '20px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                                    position: 'relative',
                                }}
                            >
                                {/* Quote icon */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '25px',
                                        right: '30px',
                                        fontSize: '60px',
                                        color: 'rgba(1, 95, 201, 0.1)',
                                        fontFamily: 'serif',
                                        lineHeight: 1,
                                    }}
                                >
                                    "
                                </div>
                                <p
                                    style={{
                                        color: '#666',
                                        lineHeight: 1.8,
                                        marginBottom: '30px',
                                        fontSize: '15px',
                                        fontStyle: 'italic',
                                    }}
                                >
                                    {testimonial.text}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <div>
                                        <h5 style={{ fontSize: '18px', fontWeight: 600, color: '#0a1628' }}>
                                            {testimonial.name}
                                        </h5>
                                        <p style={{ color: '#015fc9', fontSize: '14px' }}>{testimonial.role}</p>
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
