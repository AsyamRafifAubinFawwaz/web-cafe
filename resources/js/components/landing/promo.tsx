import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface PromoPoster {
    id: number;
    title: string;
    image: string; // URL atau path ke file poster promo (.png / .jpg)
}

interface PromoProps {
    promos?: PromoPoster[];
}

export default function Promo({ promos = [] }: PromoProps) {
    const swiperRef = useRef<SwiperType | null>(null);
    const sectionAnim = useScrollAnimation<HTMLDivElement>({ threshold: 0.15 });

    const getImageUrl = (imagePath?: string) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
        return `/storage/${cleanPath}`;
    };

    if (promos.length === 0) return null;

    return (
        <section id="promo" className="bg-gradient-to-br from-cafe-primary via-[#d44346] to-[#bd3538] py-12 sm:py-16 md:py-24 overflow-hidden relative shadow-inner">
            
            {/* Dekorasi Lingkaran Halus (Opsional, agar bg tidak terlalu flat) */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Header Section */}
                <div
                    className={`text-center max-w-2xl mx-auto mb-10 sm:mb-16 scroll-fade-up ${sectionAnim.isVisible ? 'scroll-visible' : 'scroll-hidden'}`}
                >
                    <h2 className="mt-2 font-chewy text-4xl sm:text-5xl md:text-6xl text-white underline decoration-cafe-yellow/50 decoration-3 underline-offset-4 drop-shadow-sm">
                        Promo <span className='text-cafe-yellow'>Spesial</span>
                    </h2>
                    <p className="mt-3 sm:mt-4 font-poppins text-base sm:text-lg text-white/90 tracking-wide font-light">
                        Jangan lewatkan penawaran menarik dari Nugas Cafe!
                    </p>
                </div>

                <div
                    ref={sectionAnim.ref}
                    className={`relative max-w-4xl mx-auto px-2 sm:px-12 custom-promo-swiper scroll-scale-in ${sectionAnim.isVisible ? 'scroll-visible' : 'scroll-hidden'}`}
                >
                    
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        onBeforeInit={(swiper) => { swiperRef.current = swiper; }}
                        spaceBetween={20}
                        slidesPerView={1}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        pagination={{ 
                            clickable: true,
                            el: '.custom-promo-pagination'
                        }}
                        className="rounded-2xl sm:rounded-[2rem] shadow-lg border border-gray-200/40"
                    >
                        {promos.map(poster => (
                            <SwiperSlide key={poster.id}>
                                {/* 
                                    Rasio tetap 16:9 di SEMUA breakpoint 
                                    agar card promo konsisten di hp, tab, ipad, laptop, desktop 
                                */}
                                <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 rounded-2xl sm:rounded-[2rem]">
                                    <img 
                                        src={getImageUrl(poster.image)} 
                                        alt={poster.title}
                                        className="w-full h-full object-cover select-none pointer-events-none"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Tombol Navigasi Panah Kiri */}
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="absolute -left-1 sm:left-0 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-11 sm:w-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 hover:bg-cafe-yellow hover:text-cafe-secondary hover:border-cafe-yellow active:scale-95 transition-all shadow-lg"
                        aria-label="Previous Slide"
                    >
                        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3]" />
                    </button>

                    {/* Tombol Navigasi Panah Kanan */}
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="absolute -right-1 sm:right-0 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-11 sm:w-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 hover:bg-cafe-yellow hover:text-cafe-secondary hover:border-cafe-yellow active:scale-95 transition-all shadow-lg"
                        aria-label="Next Slide"
                    >
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3]" />
                    </button>

                    {/* Indikator Titik (Dots) di Bawah Slider */}
                    <div className="custom-promo-pagination flex justify-center gap-2 mt-4 sm:mt-6" />
                </div>

            </div>

            {/* Style Tambahan untuk Efek Bullets Kapsul Swiper */}
            <style>{`
                .custom-promo-pagination .swiper-pagination-bullet {
                    width: 8px;
                    height: 8px;
                    background-color: #ffffff !important;
                    opacity: 0.4;
                    transition: all 0.3s ease;
                    border-radius: 9999px;
                }
                .custom-promo-pagination .swiper-pagination-bullet-active {
                    width: 24px !important;
                    background-color: var(--color-cafe-yellow, #FBD380) !important;
                    opacity: 1 !important;
                    box-shadow: 0 0 10px rgba(251, 211, 128, 0.4);
                }
            `}
            </style>
        </section>
    );
}