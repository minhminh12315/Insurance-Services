
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fakePolicies, fakePayments, insuranceSchemes } from '../../data/fakeData';
import type {
    LifePolicyDetails, HealthPolicyDetails, MotorPolicyDetails, HomePolicyDetails
} from '../../types';

const UserPolicyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const policy = fakePolicies.find(p => p.policy_id === Number(id));
    const scheme = insuranceSchemes.find(s => s.scheme_id === policy?.scheme_id);
    const payments = fakePayments.filter(p => p.policy_id === Number(id));

    if (!policy || policy.user_id !== user?.user_id) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold text-slate-700">Policy not found</h2>
                <button
                    onClick={() => navigate('/user/policies')}
                    className="mt-4 text-[#015fc9] hover:underline"
                >
                    Back to Policies
                </button>
            </div>
        );
    }

    // --- Helper Components for Specific Types ---

    const LifeDetails = ({ details }: { details: LifePolicyDetails }) => (
        <div className="space-y-6">
            {/* 1. Main Benefit (Product) */}
            <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Main Benefit</p>
                            <h3 className="text-xl font-bold">🛡️ {details.main_benefit.coverage_scope}</h3>
                            <p className="text-slate-400 text-sm mt-1">Coverage until age {details.main_benefit.end_age}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Sum Assured</p>
                            <p className="text-3xl font-bold text-white">${details.main_benefit.sum_assured.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            {/* 2. Riders (Supplementary) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    🧩 Supplementary Riders
                </h3>
                <div className="space-y-3">
                    {details.riders?.length > 0 ? details.riders.map((rider, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 gap-4">
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm
                                    ${rider.type === 'Accident' ? 'bg-red-100 text-red-600' :
                                        rider.type === 'CriticalIllness' ? 'bg-purple-100 text-purple-600' :
                                            rider.type === 'Waiver' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    {rider.type === 'Accident' ? '🚑' :
                                        rider.type === 'CriticalIllness' ? '🦠' :
                                            rider.type === 'Waiver' ? '🎁' : '➕'}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{rider.name}</p>
                                    <p className="text-sm text-slate-500">{rider.description}</p>
                                    {rider.type === 'Waiver' && rider.is_waiver_active && (
                                        <p className="text-xs font-bold text-emerald-600 mt-1">✨ Active - Premium Waived</p>
                                    )}
                                </div>
                            </div>
                            <div className="text-right pl-12 sm:pl-0">
                                {rider.sum_assured > 0 ? (
                                    <>
                                        <p className="text-xs text-slate-500 uppercase font-bold">Benefit</p>
                                        <p className="font-bold text-slate-900">+${rider.sum_assured.toLocaleString()}</p>
                                    </>
                                ) : (
                                    <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded">Benefit in Kind</span>
                                )}
                            </div>
                        </div>
                    )) : (
                        <p className="text-slate-500 italic text-center py-4">No riders attached.</p>
                    )}
                </div>
            </div>

            {/* 3. Beneficiaries & Cash Value */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">👥 Beneficiaries</h3>
                    <ul className="space-y-3">
                        {details.beneficiaries?.map((b, i) => (
                            <li key={i} className="flex justify-between items-center pb-2 border-b border-slate-50 last:border-0">
                                <div>
                                    <p className="font-semibold text-slate-800">{b.name}</p>
                                    <p className="text-xs text-slate-500">{b.relation}</p>
                                </div>
                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{b.percentage}%</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
                    <h3 className="text-lg font-bold text-emerald-800 mb-2">💰 Financial Value</h3>
                    <div className="mt-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-emerald-700">Accumulated</span>
                            <span className="font-bold text-emerald-900 text-lg">${details.cash_value?.current_balance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-emerald-200/50">
                            <div className="flex flex-col">
                                <span className="text-emerald-700 font-bold">Surrender Value</span>
                                <span className="text-[10px] text-emerald-600">Withdraw now</span>
                            </div>
                            <span className="font-bold text-emerald-900 text-xl">${details.cash_value?.surrender_value.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const HealthDetails = ({ details }: { details: HealthPolicyDetails }) => {
        const renderBenefitBar = (label: string, used: number, total: number, colorClass: string, waitingDate?: string) => {
            const isWaiting = waitingDate ? new Date(waitingDate) > new Date() : false;
            return (
                <div className="mb-4 last:mb-0">
                    <div className="flex justify-between items-end mb-1.5">
                        <span className="font-medium text-slate-700">{label}</span>
                        {isWaiting ? (
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                ⏳ Waiting until {new Date(waitingDate!).toLocaleDateString('vi-VN')}
                            </span>
                        ) : (
                            <span className="text-slate-500 text-sm">
                                {used >= 1000000 ? `${(used / 1000000).toFixed(1)}M` : used.toLocaleString()} / {total >= 1000000 ? `${(total / 1000000).toFixed(0)}M` : total.toLocaleString()}
                            </span>
                        )}
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${isWaiting ? 'bg-slate-300' : colorClass}`}
                            style={{ width: isWaiting ? '0%' : `${Math.min((used / total) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            );
        };

        return (
            <div className="space-y-6">
                {/* 1. Main Benefit: Inpatient */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Main Benefit</p>
                                <h3 className="text-xl font-bold">🏥 Inpatient Treatment</h3>
                                <p className="text-blue-100 text-sm opacity-90">Surgery & Overnight Stays</p>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Total Limit</p>
                                <p className="text-2xl font-bold">${(details.main_benefit.total_limit_per_year / 1000000).toLocaleString()}M</p>
                            </div>
                        </div>

                        {/* Total Usage Bar */}
                        <div className="mb-6">
                            <div className="flex justify-between text-sm mb-2 opacity-90">
                                <span>Used This Year</span>
                                <span className="font-bold">
                                    {(details.main_benefit.used_amount / 1000000).toFixed(1)}M / {(details.main_benefit.total_limit_per_year / 1000000).toFixed(0)}M
                                </span>
                            </div>
                            <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                                <div
                                    className={`h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] ${details.main_benefit.used_amount / details.main_benefit.total_limit_per_year > 0.8 ? 'bg-red-400' : 'bg-white/90'
                                        }`}
                                    style={{ width: `${Math.min((details.main_benefit.used_amount / details.main_benefit.total_limit_per_year) * 100, 100)}%` }}
                                />
                            </div>
                            {details.main_benefit.used_amount / details.main_benefit.total_limit_per_year > 0.8 && (
                                <p className="text-xs text-red-200 mt-1 font-bold">⚠️ High usage warning</p>
                            )}
                        </div>

                        {/* Sub-limits grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-md border border-white/10">
                                <p className="text-[10px] text-blue-200 uppercase font-bold mb-1">Room & Board / Day</p>
                                <p className="font-bold">${details.main_benefit.room_board_limit.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-md border border-white/10">
                                <p className="text-[10px] text-blue-200 uppercase font-bold mb-1">Surgery Limit</p>
                                <p className="font-bold">${details.main_benefit.surgery_limit.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Supplementary Benefits */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        ➕ Supplementary Benefits
                    </h3>
                    {details.supplementary_benefits?.length > 0 ? (
                        details.supplementary_benefits.map((benefit, idx) => (
                            <div key={idx}>
                                {renderBenefitBar(
                                    benefit.name,
                                    benefit.used_amount,
                                    benefit.limit_per_year,
                                    benefit.type === 'Dental' ? 'bg-purple-500' : benefit.type === 'Maternity' ? 'bg-pink-500' : 'bg-emerald-500',
                                    benefit.waiting_period_end_date
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500 italic">No supplementary benefits included.</p>
                    )}
                </div>

                {/* 3. E-Card & Utilities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-4 text-white shadow-xl relative overflow-hidden group cursor-pointer">
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-yellow-500 text-xs uppercase tracking-wider font-bold mb-1">{details.hospital_network_tier}</p>
                                <p className="font-bold text-lg">{user?.full_name}</p>
                                <p className="text-sm opacity-60 font-mono">{policy.policy_number}</p>
                            </div>
                            <div className="bg-white p-1 rounded">
                                <span className="block w-8 h-8 bg-slate-900" /> {/* Mock QR */}
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-end relative z-10">
                            <span className="text-[10px] opacity-60">Valid Worldwide</span>
                            <span className="text-xs font-bold text-blue-400 group-hover:text-blue-300">Show QR ↗</span>
                        </div>
                    </div>

                    <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-[#015fc9] hover:bg-blue-50 transition-all group">
                        <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🏥</span>
                        <span className="font-semibold text-slate-700">Find Hospital</span>
                        <span className="text-xs text-slate-500">Nearest Direct Billing</span>
                    </button>
                </div>
            </div>
        );
    };

    const MotorDetails = ({ details }: { details: MotorPolicyDetails }) => (
        <div className="space-y-6">
            {/* 1. Vehicle Info Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        {details.vehicle_info.type === 'Car' ? '🚗' : '🏍️'} {details.vehicle_info.brand_model}
                    </h3>
                    <div className="flex gap-4 mt-2 text-sm text-slate-500 font-mono">
                        <div>
                            <span className="text-xs text-slate-400 uppercase font-bold mr-1">Chassis:</span>
                            {details.vehicle_info.chassis_number}
                        </div>
                        <div>
                            <span className="text-xs text-slate-400 uppercase font-bold mr-1">Engine:</span>
                            {details.vehicle_info.engine_number}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-xs text-slate-400 font-bold uppercase">License Plate</span>
                    <span className="block text-xl font-black text-slate-900 bg-yellow-300 px-2 py-0.5 rounded border-2 border-slate-900">
                        {details.vehicle_info.license_plate}
                    </span>
                </div>
            </div>

            {/* 2. Compulsory TNDS (Yellow) */}
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-6 rounded-2xl shadow-lg relative overflow-hidden text-white">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-yellow-100 text-xs font-bold uppercase tracking-wider mb-1">Compulsory / Bắt buộc</p>
                            <h3 className="text-2xl font-bold mb-1">📜 Civil Liability (TNDS)</h3>
                            <p className="text-yellow-50 text-sm opacity-90">Required by Law</p>
                        </div>
                        {details.tnds_compulsory.is_active ? (
                            <span className="bg-white text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">✅ Active</span>
                        ) : (
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">❌ Expired</span>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-[10px] text-yellow-100 uppercase font-bold">Liability (Person)</p>
                            <p className="font-bold text-lg">${(details.tnds_compulsory.limit_per_person / 1000000).toLocaleString()}M / person</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-yellow-100 uppercase font-bold">Liability (Property)</p>
                            <p className="font-bold text-lg">${(details.tnds_compulsory.limit_property / 1000000).toLocaleString()}M / accident</p>
                        </div>
                    </div>
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 flex items-center gap-2">
                        📱 Verifiy E-Certificate (QR)
                    </button>
                </div>
                <span className="absolute -right-4 -bottom-4 text-9xl opacity-10 rotate-12">⚖️</span>
            </div>

            {/* 3. Voluntary Coverage (If Active) */}
            {details.voluntary_coverage?.is_active && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        🛡️ Voluntary Physical Damage
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Vehicle Value</p>
                            <p className="text-lg font-bold text-slate-900">${details.voluntary_coverage.vehicle_value.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                            <p className="text-xs text-red-600 font-bold uppercase mb-1">Deductible</p>
                            <p className="text-lg font-bold text-red-700">${details.voluntary_coverage.deductible_amount.toLocaleString()}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-700 mb-3">Included Riders</p>
                        <div className="flex flex-wrap gap-2">
                            {details.voluntary_coverage.riders.map(rider => (
                                <span key={rider} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100 flex items-center gap-1">
                                    ✅ {rider === 'Hydrostatic' ? '🌊 Hydrostatic' :
                                        rider === 'PartsTheft' ? '🕵️ Parts Theft' :
                                            rider === 'GenuineGarage' ? '🛠️ Genuine Garage' :
                                                rider === 'PassengerAccident' ? '👨‍👩‍👧 Passenger' : rider}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Actions */}
            <div className="grid grid-cols-2 gap-3">
                {details.rescue_hotline && (
                    <button className="col-span-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700">
                        📞 SOS Rescue ({details.rescue_hotline})
                    </button>
                )}
                {details.vehicle_info.type === 'Car' ? (
                    <button className="col-span-1 border border-slate-200 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-50">
                        🛠️ Garage Network
                    </button>
                ) : (
                    <button className="col-span-1 border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-50">
                        👮 Police Report Guide
                    </button>
                )}
            </div>
        </div>
    );

    const HomeDetails = ({ details }: { details: HomePolicyDetails }) => (
        <div className="space-y-6">
            {/* 1. Main: Structure */}
            <div className="bg-gradient-to-br from-orange-600 to-red-600 p-6 rounded-2xl shadow-lg relative overflow-hidden text-white">
                <div className="relative z-10">
                    <p className="text-orange-100 text-xs font-bold uppercase tracking-wider mb-1">Main Protection</p>
                    <h3 className="text-2xl font-bold mb-1">🏠 Structure & Frame</h3>
                    <p className="text-orange-50 text-sm mb-4">covers {details.main_benefit.property_type} at {details.main_benefit.property_address}</p>

                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold">${details.main_benefit.structure_value.toLocaleString()}</span>
                        <span className="text-sm text-orange-200 mb-1">Rebuild Value</span>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {details.main_benefit.coverage_risks.map(risk => (
                            <span key={risk} className="px-2.5 py-1 bg-white/20 text-white rounded text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                                {risk === 'Fire' ? '🔥' : risk === 'Flood' ? '🌊' : risk === 'Theft' ? '🦹' : risk === 'Explosion' ? '💥' : '🛡️'} {risk}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            </div>

            {/* 2. Riders: Contents & Liability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-xl mb-3">📺</div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Contents</p>
                    <h4 className="text-lg font-bold text-slate-800">Interior Assets</h4>
                    <p className="text-slate-500 text-xs mt-1 mb-3">Furniture, Appliances, Valuables</p>
                    <p className="text-xl font-bold text-indigo-600">${details.supplementary_benefits.contents_value.toLocaleString()}</p>
                    {details.asset_photos_urls && details.asset_photos_urls.length > 0 && (
                        <button className="mt-3 text-xs font-bold text-indigo-500 hover:text-indigo-700 flex items-center gap-1">
                            📷 View {details.asset_photos_urls.length} Attached Photos
                        </button>
                    )}
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-xl mb-3">⚖️</div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Liability</p>
                    <h4 className="text-lg font-bold text-slate-800">Public Liability</h4>
                    <p className="text-slate-500 text-xs mt-1 mb-3">Damage to neighbors/visitors</p>
                    <p className="text-xl font-bold text-emerald-600">${details.supplementary_benefits.liability_limit.toLocaleString()}</p>
                </div>

                {details.supplementary_benefits.rental_support_limit > 0 && (
                    <div className="md:col-span-2 bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex items-center gap-3">
                        <span className="text-2xl">🏨</span>
                        <div>
                            <p className="font-bold text-yellow-800 text-sm">Rental Support Available</p>
                            <p className="text-xs text-yellow-600">Up to ${details.supplementary_benefits.rental_support_limit.toLocaleString()} for temporary accommodation.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // --- Main Rendering ---

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header / Nav */}
            <button
                onClick={() => navigate('/user/policies')}
                className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
                ← Back to Policies
            </button>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Main Content */}
                <div className="flex-1 space-y-8">
                    {/* Policy Header Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${policy.policy_status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {policy.policy_status}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-900 mt-3 mb-1">{scheme?.scheme_name}</h1>
                                <p className="text-slate-500 font-mono text-sm">{policy.policy_number}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-500 mb-1">Total Benefit / Sum Assured</p>
                                <p className="text-3xl font-bold text-[#015fc9]">${policy.sum_assured.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Specific Details based on Type */}
                    {policy.type === 'Life' && <LifeDetails details={policy.details as LifePolicyDetails} />}
                    {policy.type === 'Health' && <HealthDetails details={policy.details as HealthPolicyDetails} />}
                    {policy.type === 'Motor' && <MotorDetails details={policy.details as MotorPolicyDetails} />}
                    {policy.type === 'Home' && <HomeDetails details={policy.details as HomePolicyDetails} />}

                    {/* Payment History (Common) */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">📜 Payment History</h3>
                        {payments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Amount</th>
                                            <th className="px-4 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {payments.map(pay => (
                                            <tr key={pay.payment_id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 text-slate-700">{pay.payment_date}</td>
                                                <td className="px-4 py-3 font-medium text-slate-900">${pay.amount_paid}</td>
                                                <td className="px-4 py-3">
                                                    <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-full">{pay.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-slate-500 italic">No payments recorded yet.</p>
                        )}
                    </div>
                </div>

                {/* Right Sidebar: Quick Actions & Summary */}
                <div className="w-full lg:w-96 space-y-6">
                    {/* Premium Card */}
                    <div className="bg-[#0f172a] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Premium Due</p>
                            <h2 className="text-4xl font-bold mb-1">${policy.premium_amount}</h2>
                            <p className="text-slate-400 text-sm mb-6">/{policy.payment_frequency}</p>

                            <button className="w-full py-3 bg-[#015fc9] hover:bg-blue-600 transition-colors rounded-xl font-bold text-sm shadow-lg shadow-blue-900/50">
                                Pay Now
                            </button>
                        </div>
                        {/* Decorative circle */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4">⚡ Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-300 transition-all group">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 text-lg group-hover:scale-110 transition-transform">📄</span>
                                    <span className="font-medium text-slate-700">File a Claim</span>
                                </div>
                                <span className="text-slate-400">→</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-300 transition-all group">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 text-lg group-hover:scale-110 transition-transform">🔄</span>
                                    <span className="font-medium text-slate-700">Renew Policy</span>
                                </div>
                                <span className="text-slate-400">→</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-300 transition-all group">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-500 text-lg group-hover:scale-110 transition-transform">📥</span>
                                    <span className="font-medium text-slate-700">Download Contract</span>
                                </div>
                                <span className="text-slate-400">→</span>
                            </button>
                        </div>
                    </div>

                    {/* Support Contact */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl">
                            🎧
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">Need Help?</p>
                            <p className="text-sm text-slate-500">Call support 24/7</p>
                        </div>
                        <a href="tel:19001234" className="ml-auto font-bold text-[#015fc9]">1900 1234</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPolicyDetail;
