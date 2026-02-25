import { useState } from 'react';
import PageHeader from '../components/PageHeader';

const Testimonial = () => {
    const testimonials = [
        {
            name: 'Sarah Johnson',
            profession: 'Business Owner',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
            text: 'Dolores sed duo clita tempor justo dolor et stet lorem kasd labore dolore lorem ipsum. At lorem lorem magna ut et, nonumy et labore et tempor diam tempor erat.',
        },
        {
            name: 'Michael Brown',
            profession: 'Software Engineer',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
            text: 'Their insurance plans are comprehensive and affordable. The claims process was smooth and hassle-free. I highly recommend their services to anyone looking for reliable coverage.',
        },
        {
            name: 'Emily Davis',
            profession: 'Marketing Manager',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
            text: 'Exceptional customer service and great coverage options. They made the entire process effortless and were always available to answer my questions promptly.',
        },
        {
            name: 'David Wilson',
            profession: 'Financial Analyst',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
            text: 'I switched to this insurance company last year and it was the best decision. Their premiums are competitive and the benefits far exceed what I was getting before.',
        },
        {
            name: 'Lisa Anderson',
            profession: 'Teacher',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
            text: 'The team went above and beyond to help me find the right policy. Their expertise and dedication to customer satisfaction is truly commendable.',
        },
        {
            name: 'Robert Martinez',
            profession: 'Entrepreneur',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
            text: 'Professional, reliable, and trustworthy. These are the words that come to mind when I think about this insurance company. Outstanding service all around.',
        },
    ];

    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
    const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

    // Positions for floating avatars around the center
    const floatingPositions = [
        { top: '15%', left: '18%' },
        { top: '5%', left: '50%', transform: 'translateX(-50%)' },
        { top: '15%', right: '18%' },
        { top: '55%', left: '5%' },
        { top: '70%', left: '20%' },
        { top: '55%', right: '5%' },
        { top: '70%', right: '20%' },
    ];

    return (
        <div>
            {/* Page Header */}
            <PageHeader title="Testimonial" currentPage="Testimonial" />

            {/* Testimonial Section */}
            <section className="py-[100px] bg-white">
                <div className="max-w-[800px] mx-auto px-5">
                    <div className="text-center mb-[50px]">
                        <h2 className="text-[42px] font-bold text-[#0a1628] leading-[1.3]">
                            What They Say About<br />Our Insurance
                        </h2>
                    </div>

                    {/* Testimonial Carousel */}
                    <div className="relative min-h-[420px]">
                        {/* Floating avatars */}
                        {testimonials.map((t, i) => {
                            if (i === current) return null;
                            const posIndex = i > current ? i - 1 : i;
                            const pos = floatingPositions[posIndex % floatingPositions.length];
                            return (
                                <div
                                    key={i}
                                    style={pos}
                                    className="absolute transition-all duration-500 cursor-pointer z-[1]"
                                    onClick={() => setCurrent(i)}
                                >
                                    <img
                                        src={t.image}
                                        alt={t.name}
                                        className="w-[60px] h-[60px] rounded-full object-cover border-3 border-[#e8edf2] opacity-70 transition-all duration-300 hover:opacity-100 hover:border-[#015fc9]"
                                    />
                                </div>
                            );
                        })}

                        {/* Center testimonial */}
                        <div className="text-center relative z-[2] pt-5">
                            <img
                                src={testimonials[current].image}
                                alt={testimonials[current].name}
                                className="w-[90px] h-[90px] rounded-full object-cover border-4 border-[#015fc9] mx-auto mb-[25px] block shadow-[0_5px_20px_rgba(1,95,201,0.3)]"
                            />
                            <p className="text-[#666] leading-[1.8] text-base max-w-[600px] mx-auto mb-[25px] italic">
                                {testimonials[current].text}
                            </p>
                            <h4 className="text-xl font-semibold text-[#0a1628] mb-[5px]">
                                {testimonials[current].name}
                            </h4>
                            <p className="text-[#666] text-sm mb-[30px]">
                                {testimonials[current].profession}
                            </p>

                            {/* Navigation Buttons */}
                            <div className="flex justify-center gap-2.5">
                                <button
                                    onClick={prev}
                                    className="w-[42px] h-[42px] rounded-lg border-none bg-[linear-gradient(135deg,#015fc9_0%,#007bff_100%)] text-white cursor-pointer flex items-center justify-center transition-all duration-300 text-lg hover:scale-110"
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={next}
                                    className="w-[42px] h-[42px] rounded-lg border-none bg-[linear-gradient(135deg,#015fc9_0%,#007bff_100%)] text-white cursor-pointer flex items-center justify-center transition-all duration-300 text-lg hover:scale-110"
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Testimonial;
