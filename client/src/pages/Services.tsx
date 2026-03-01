import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import lifeIcon from '../assets/life_insurance.png';
import healthIcon from '../assets/health_insurance.png';
import homeIcon from '../assets/home_insurance.png';
import vehicleIcon from '../assets/vehicle_insurance.png';

const Services = () => {
    const services = [
        {
            icon: lifeIcon,
            title: 'Life Insurance',
            description: 'Protect your loved ones with comprehensive life insurance coverage that ensures financial security for your family\'s future.',
        },
        {
            icon: healthIcon,
            title: 'Health Insurance',
            description: 'Access quality healthcare with our flexible health insurance plans tailored to meet your medical needs and budget.',
        },
        {
            icon: homeIcon,
            title: 'Home Insurance',
            description: 'Safeguard your home and belongings with our reliable home insurance solutions protecting against all risks.',
        },
        {
            icon: vehicleIcon,
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
                                    <div className="w-16 h-16 bg-[#015fc9] rounded-[15px] flex items-center justify-center shrink-0">
                                        <img src={service.icon} alt={service.title} className="w-9 h-9 object-contain brightness-0 invert" />
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
