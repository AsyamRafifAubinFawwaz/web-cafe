import { Head, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import Navbar from '@/components/landing/navbar';
import { CalendarDays, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface Package {
    id: number;
    name: string;
    price: number;
    price_type: string;
    min_order_per_pax: number;
    min_capacity: number;
    max_capacity: number;
}

interface PageProps {
    packages: Package[];
    auth: any;
}

const steps = [
    "Pilih paket reservasi yang paling sesuai dengan kebutuhan kamu.",
    "Masukkan data diri anda sebagai koordinator reservasi.",
    "Pilih metode pengisian data sesuai dengan keperluan anda.",
    "Setelah data terpenuhi kirim reservasi untuk mengkorfirmasi reservasi anda."
];

export default function ReservationStage({ packages = [] }: PageProps) {
    const { auth } = usePage().props as any;
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (packages.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % packages.length);
        }
    };

    const handlePrev = () => {
        if (packages.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + packages.length) % packages.length);
        }
    };

    const formatPriceK = (price: number) => {
        if (price === 0) return 'Free';
        if (price >= 1000) return (price / 1000) + 'k';
        return price.toString();
    };

    const formatPriceIDR = (price: number) => {
        if (price >= 1000) return (price / 1000) + 'k';
        return price.toString();
    };

    const currentPackage = packages[currentIndex];

    return (
        <div className="bg-cafe-bg min-h-screen font-poppins antialiased pb-20">
            <Head title="Tahap Reservasi - Nugas Cafe" />

            <Navbar auth={auth} alwaysScrolled={true} />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center">
                    
                    {/* LEFT COLUMN: Timeline */}
                    <div className="flex flex-col max-w-lg lg:ml-auto">
                        <div className="flex items-center gap-3 mb-10">
                            {/* Calendar Icon with 31 */}
                            <div className="relative text-[#D94343]">
                                <CalendarDays className="w-12 h-12" />
                                <span className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-sm font-sans mt-0.5">
                                    31
                                </span>
                            </div>
                            <h1 className="font-chewy text-4xl sm:text-5xl md:text-5xl text-cafe-secondary underline decoration-[3px] underline-offset-8">
                                <span className="text-[#D94343]">Tahap</span> Reservasi
                            </h1>
                        </div>

                        <div className="flex flex-col gap-6 sm:gap-8 relative">
                            {/* Dotted Line Background for Desktop */}
                            <div className="absolute right-[45px] top-6 bottom-6 w-0 border-r border-dashed border-[#D94343] hidden sm:block"></div>

                            {steps.map((text, idx) => (
                                <div key={idx} className="flex items-start gap-5 sm:gap-6 relative sm:pr-[80px]">
                                    {/* Number Circle */}
                                    <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#D94343] text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-md">
                                        {idx + 1}
                                    </div>
                                    
                                    {/* Step Text */}
                                    <p className="font-poppins text-sm sm:text-base text-gray-700 leading-relaxed pt-2 sm:pt-3">
                                        {text}
                                    </p>
                                    
                                    {/* Timeline Marker (Right side) */}
                                    <div className="hidden sm:flex absolute right-[39px] top-[22px] justify-center items-center">
                                        {idx === 0 ? (
                                            // Active/Sunburst marker for first step
                                            <div className="w-3.5 h-3.5 rounded-full bg-[#D94343] ring-[3px] ring-cafe-bg ring-offset-2 ring-offset-[#D94343] z-10" />
                                        ) : (
                                            // Normal marker for other steps
                                            <div className="w-3.5 h-3.5 rounded-full bg-[#D94343] z-10 border-[3px] border-cafe-bg" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Package Carousel */}
                    <div className="w-full max-w-[340px] mx-auto lg:max-w-[380px]">
                        <div className="bg-white rounded-[2rem] p-3 sm:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative">
                            
                            {/* Carousel Content */}
                            {currentPackage ? (
                                <div className="bg-[#D94343] rounded-[1.5rem] border-[5px] border-[#F2C94C] p-4 sm:p-5 pt-8 relative shadow-inner">
                                    
                                    {/* Top Logo */}
                                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] bg-[#D94343] rounded-full p-1 border-4 border-[#F2C94C] flex items-center justify-center overflow-hidden">
                                        <div className="bg-white rounded-full w-full h-full flex items-center justify-center p-1">
                                            <img src="/images/logo-nugas.png" alt="Logo" className="w-full h-full object-contain" />
                                        </div>
                                    </div>

                                    {/* Package Name */}
                                    <h2 className="font-chewy text-white text-2xl sm:text-3xl text-center mb-3 mt-1">
                                        {currentPackage.name}
                                    </h2>

                                    {/* Features & Rules List */}
                                    <div className="font-poppins text-white text-[10px] sm:text-[11px] leading-relaxed space-y-2.5 px-1">
                                        
                                        {/* Fasilitas */}
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" /> 
                                                <span className="font-bold">Fasilitas:</span>
                                            </div>
                                            <ul className="list-disc list-outside ml-[1.4rem] space-y-0.5 opacity-95 marker:text-white/80">
                                                <li>Bebas menata/menentukan tata letak</li>
                                                <li>Kapasitas {currentPackage.min_capacity} - {currentPackage.max_capacity} orang</li>
                                                <li>Include sound + mic</li>
                                                <li>Include proyektor + layar</li>
                                                <li>Diperbolehkan custom menu</li>
                                                <li>Diskon bundling menu</li>
                                            </ul>
                                        </div>
                                        
                                        {/* Ketentuan */}
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" /> 
                                                <span className="font-bold">Ketentuan:</span>
                                            </div>
                                            <ul className="list-disc list-outside ml-[1.4rem] space-y-0.5 opacity-95 marker:text-white/80">
                                                <li>Minimal order {formatPriceIDR(currentPackage.min_order_per_pax)}/orang</li>
                                                <li>Tidak diperbolehkan membawa makanan/minuman dari luar</li>
                                                <li>Batas maksimal booking hanya sampai jam 7.30 malam</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Price and CTA */}
                                    <div className="mt-5 text-center pb-1">
                                        <div className="font-chewy text-white text-3xl sm:text-4xl underline decoration-[3px] underline-offset-4 mb-4">
                                            {formatPriceK(currentPackage.price)}
                                        </div>
                                        <button className="bg-white text-[#D94343] font-bold font-poppins text-xs sm:text-sm px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 w-3/4 mx-auto block max-w-[160px]">
                                            Pilih Paket
                                        </button>
                                    </div>

                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500 font-poppins text-sm">
                                    Belum ada paket reservasi yang tersedia.
                                </div>
                            )}

                            {/* Navigation Arrows (Moved after card for correct z-index overlap) */}
                            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-1 sm:-mx-5 pointer-events-none z-50">
                                <button 
                                    onClick={handlePrev} 
                                    className="pointer-events-auto w-10 h-10 bg-gray-100 hover:bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-md transition-all active:scale-95"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button 
                                    onClick={handleNext} 
                                    className="pointer-events-auto w-10 h-10 bg-gray-100 hover:bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-md transition-all active:scale-95"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}