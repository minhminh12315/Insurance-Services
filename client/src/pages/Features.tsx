import PageHeader from '../components/PageHeader';
import icon06 from '../assets/icon-06-primary.png';
import icon03 from '../assets/icon-03-primary.png';
import icon04 from '../assets/icon-04-primary.png';
import icon07 from '../assets/icon-07-primary.png';
import homeDoctor from '../assets/home_doctor.jpg';

const Features = () => {
    const features = [
        {
            icon: icon06,
            title: 'Easy Process',
            description: 'Simple and streamlined insurance application process. Get covered in minutes, not days.',
        },
        {
            icon: icon03,
            title: 'Fast Delivery',
            description: 'Quick policy issuance and claims settlement. We value your time and ensure rapid service.',
        },
        {
            icon: icon04,
            title: 'Policy Controlling',
            description: 'Full control over your insurance policies. Manage, modify, and monitor all your plans in one place.',
        },
        {
            icon: icon07,
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

                        <div className="grid grid-cols-2 gap-5">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-[#f0f4fb] rounded-[20px] p-[10px] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="bg-white rounded-[15px] p-[35px_20px] h-full flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 mb-[15px] flex items-center justify-center">
                                            <img src={feature.icon} alt={feature.title} className="w-full h-full object-contain" />
                                        </div>
                                        <h4 className="text-xl font-bold text-[#0a1628]">
                                            {feature.title}
                                        </h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative">
                        <img
                            src={homeDoctor}
                            alt="Insurance professional"
                            className="w-full h-[650px] object-cover rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Features;
