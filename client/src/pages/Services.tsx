import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi, type InsuranceCategoryModel } from '../services/insuranceApi';
import PageHeader from '../components/PageHeader';
import lifeIcon from '../assets/life_insurance.png';
import healthIcon from '../assets/health_insurance.png';
import homeIcon from '../assets/home_insurance.png';
import vehicleIcon from '../assets/vehicle_insurance.png';

const Services = () => {
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

    const [categories, setCategories] = useState<InsuranceCategoryModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Map category names to icons
    const getCategoryIcon = (categoryName: string) => {
        const name = categoryName.toLowerCase();
        if (name.includes('life') || name.includes('nhân thọ')) return lifeIcon;
        if (name.includes('health') || name.includes('y tế') || name.includes('sức khỏe')) return healthIcon;
        if (name.includes('home') || name.includes('nhà') || name.includes('căn hộ')) return homeIcon;
        if (name.includes('vehicle') || name.includes('motor') || name.includes('xe') || name.includes('ô tô')) return vehicleIcon;
        return lifeIcon; // default
    };

    // Fetch categories on component mount
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
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Remove hardcoded services - now using dynamic categories
    // const services = [...];

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

                    {isLoading ? (
                        <div className="text-center py-10">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#015fc9] border-t-transparent"></div>
                            <p className="mt-4 text-[#666]">Loading insurance services...</p>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-[#666]">No insurance services available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-[30px]">
                            {categories.map((category) => (
                                <div
                                    key={category.categoryId}
                                    className="bg-white p-[40px_35px] rounded-[20px] shadow-[0_5px_30px_rgba(0,0,0,0.08)] transition-all duration-300 border border-[#eee] hover:-translate-y-[10px] hover:shadow-[0_20px_60px_rgba(1,95,201,0.15)] hover:border-[#015fc9]"
                                >
                                    <div className="flex items-start gap-[25px]">
                                        <div className="w-16 h-16 bg-[#015fc9] rounded-[15px] flex items-center justify-center shrink-0">
                                            <img
                                                src={getCategoryIcon(category.categoryName)}
                                                alt={category.categoryName}
                                                className="w-9 h-9 object-contain brightness-0 invert"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-[22px] font-semibold text-[#0a1628] mb-[15px]">
                                                {category.categoryName}
                                            </h4>
                                            <p className="text-[#666] text-[15px] leading-[1.7] mb-5">
                                                {category.description || 'Comprehensive coverage for your protection needs with flexible plans tailored to your requirements.'}
                                            </p>
                                            <Link
                                                to={`/calculator?categoryId=${category.categoryId}`}
                                                className="inline-flex items-center gap-2 text-[#015fc9] no-underline font-semibold text-sm px-[25px] py-[10px] border-2 border-[#015fc9] rounded-[50px] transition-all duration-300 hover:bg-[#015fc9] hover:text-white"
                                            >
                                                Read More & Get Quote
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Services;
