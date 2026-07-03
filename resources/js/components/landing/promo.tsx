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

export default function Promo() {
    const swiperRef = useRef<SwiperType | null>(null);
    const sectionAnim = useScrollAnimation<HTMLDivElement>({ threshold: 0.15 });

    const promoPosters: PromoPoster[] = [
        {
            id: 1,
            title: 'Promo Special Americano 40% Off',
            image: 'images/poster-promo.png'
        },
        {
            id: 2,
            title: 'Promo Happy Hour Espresso Base',
            image: 'images/poster-promo.png'
        },
        {
            id: 3,
            title: 'Paket Hemat Work From Cafe Combo',
            image: 'images/poster-promo.png'
        }
    ];

    return (
        <section id="promo" className="bg-gradient-to-b from-[#E6D5B5] to-[#DCC0A1] py-12 sm:py-16 md:py-20 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                
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
                        {promoPosters.map(poster => (
                            <SwiperSlide key={poster.id}>
                                {/* 
                                    Rasio tetap 16:9 di SEMUA breakpoint 
                                    agar card promo konsisten di hp, tab, ipad, laptop, desktop 
                                */}
                                <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 rounded-2xl sm:rounded-[2rem]">
                                    <img 
                                        src={poster.image} 
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
                        className="absolute -left-1 sm:left-0 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-11 sm:w-11 flex items-center justify-center rounded-full bg-secondary/60 text-white hover:bg-[#BCA47E] active:scale-95 transition-all shadow-md"
                        aria-label="Previous Slide"
                    >
                        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3]" />
                    </button>

                    {/* Tombol Navigasi Panah Kanan */}
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="absolute -right-1 sm:right-0 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-11 sm:w-11 flex items-center justify-center rounded-full bg-secondary/60 text-white hover:bg-[#BCA47E] active:scale-95 transition-all shadow-md"
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
                    background-color: secondary !important;
                    opacity: 0.5;
                    transition: all 0.3s ease;
                    border-radius: 9999px;
                }
                .custom-promo-pagination .swiper-pagination-bullet-active {
                    width: 20px !important;
                    background-color: #D94343 !important;
                    opacity: 1 !important;
                }
            `}
            </style>
        </section>
    );
}