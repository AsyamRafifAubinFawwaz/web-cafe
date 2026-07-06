import { Search, Tag, ChevronLeft, ChevronRight, Star, Coffee } from 'lucide-react';
import React, { useState, useMemo, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

interface MenuItem {
    id: number;
    category_id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    rating: number;
    is_promo?: boolean;
    promo_price?: number;
}

interface Category {
    id: number;
    type: 'makanan' | 'minuman';
    name: string;
}

interface MenuProps {
    categories?: Category[];
    menuItems?: MenuItem[];
}

export default function Menu({ categories = [], menuItems = [] }: MenuProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMainType, setActiveMainType] = useState<'all' | 'makanan' | 'minuman'>('all');
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

    const swiperRef = useRef<SwiperType | null>(null);

    const headerAnim = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
    const searchAnim = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
    const filterAnim = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
    const cardsAnim = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

    const getImageUrl = (imagePath?: string) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
        return `/storage/${cleanPath}`;
    };

    const handleMainTypeChange = (type: 'all' | 'makanan' | 'minuman') => {
        setActiveMainType(type);
    };

    const filteredItems = useMemo(() => {
        return menuItems.filter(item => {
            const category = categories.find(cat => cat.id === item.category_id);
            if (!category) return false;

            // Jika tidak sedang mencari sesuatu, filter berdasarkan tipe tab yang aktif
            if (!searchQuery) {
                if (activeMainType !== 'all' && category.type !== activeMainType) {
                    return false;
                }
            }

            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesSearch;
        });
    }, [searchQuery, activeMainType]);

    const formatIDR = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price).replace(/\s/g, ' ');
    };

    return (
        <section id="menu" className="bg-cafe-bg py-12 sm:py-16 md:py-24 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div
                    ref={headerAnim.ref}
                    className={`max-w-screen mb-6 sm:mb-8 scroll-fade-up ${headerAnim.isVisible ? 'scroll-visible' : 'scroll-hidden'}`}
                >
                    <h2 className="text-center font-poppins font-bold text-xl sm:text-2xl text-[#D94343]">
                        Nikmati menu istimewa dari kami
                    </h2>
                </div>

                {menuItems.length === 0 ? (
                    <div className="mt-8 mx-auto max-w-2xl bg-white/80 backdrop-blur-md p-8 sm:p-12 rounded-[2rem] border border-[#D94343]/20 shadow-lg text-center">
                        <div className="mx-auto w-16 h-16 bg-[#FFFCEF] rounded-full flex items-center justify-center mb-4 border border-[#D94343]/30">
                            <Coffee className="w-8 h-8 text-[#D94343]" />
                        </div>
                        <h3 className="font-chewy text-2xl sm:text-3xl text-cafe-primary mb-3">Menu Sedang Disiapkan!</h3>
                        <p className="font-poppins text-sm sm:text-base text-cafe-secondary/80 leading-relaxed">
                            Kami sedang meracik dan mempersiapkan menu-menu spesial yang pastinya bikin kamu ketagihan. Silakan cek kembali nanti atau hubungi kami untuk informasi lebih lanjut.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Search Bar */}
                        <div
                            ref={searchAnim.ref}
                    className={`max-w-screen flex justify-center items-center scroll-fade-up scroll-stagger ${searchAnim.isVisible ? 'scroll-visible' : 'scroll-hidden'}`}
                    style={{ '--stagger-delay': '100ms' } as React.CSSProperties}
                >
                    <div className="relative w-full sm:w-3/4 md:w-1/2">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Cari menu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 sm:py-4 rounded-full text-sm bg-white border border-gray-200 shadow-lg focus:border-[#D94343] focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div
                    ref={filterAnim.ref}
                    className={`flex justify-center items-center gap-2 max-w-screen py-6 sm:py-8 scroll-fade-up scroll-stagger ${filterAnim.isVisible ? 'scroll-visible' : 'scroll-hidden'}`}
                    style={{ '--stagger-delay': '200ms' } as React.CSSProperties}
                >

                    <button
                        onClick={() => handleMainTypeChange('all')}
                        className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-poppins font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                            activeMainType === 'all' && searchQuery === ''
                                ? 'bg-[#D94343] text-white shadow-md'
                                : 'bg-white/80 text-gray-700 hover:bg-gray-100 shadow-md'
                        }`}
                    >
                        Semua Menu
                    </button>
                    <button
                        onClick={() => handleMainTypeChange('minuman')}
                        className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-poppins font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                            activeMainType === 'minuman' && searchQuery === ''
                                ? 'bg-[#D94343] text-white shadow-md'
                                : 'bg-white/80 text-gray-700 hover:bg-gray-100 shadow-md'
                        }`}
                    >
                        Minuman
                    </button>
                    <button
                        onClick={() => handleMainTypeChange('makanan')}
                        className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-poppins font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                            activeMainType === 'makanan' && searchQuery === ''
                                ? 'bg-[#D94343] text-white shadow-md'
                                : 'bg-white/80 text-gray-700 hover:bg-gray-100 shadow-md'
                        }`}
                    >
                        Makanan
                    </button>
                </div>

                

                {filteredItems.length > 0 ? (
                    <div
                        ref={cardsAnim.ref}
                        className={`relative mt-4 px-2 sm:px-10 custom-menu-swiper scroll-fade-up scroll-stagger ${cardsAnim.isVisible ? 'scroll-visible' : 'scroll-hidden'}`}
                        style={{ '--stagger-delay': '300ms' } as React.CSSProperties}
                    >
                        <Swiper
                            key={`${activeMainType}-${searchQuery}`}
                            modules={[Navigation, Scrollbar]}
                            onBeforeInit={(swiper) => { swiperRef.current = swiper; }}
                            spaceBetween={16}
                            slidesPerView={1.15}
                            breakpoints={{
                                480: { slidesPerView: 1.5, spaceBetween: 16 },
                                640: { slidesPerView: 2.2, spaceBetween: 20 },
                                768: { slidesPerView: 2.5, spaceBetween: 20 },
                                1024: { slidesPerView: 3.2, spaceBetween: 24 },
                                1280: { slidesPerView: 4, spaceBetween: 24 },
                            }}
                            className="!overflow-visible !pb-14"
                        >
                            {filteredItems.map(item => {
                                const originalCategory = categories.find(cat => cat.id === item.category_id);
                                const displayBadge = originalCategory ? (originalCategory.type === 'makanan' ? 'Makanan' : 'Minuman') : 'Menu';

                                return (
                                    <SwiperSlide key={item.id} className="!h-auto">
                                        <div className="group relative h-full bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between">
                                            
                                            
                                            <div className="relative overflow-hidden rounded-2xl aspect-[4/3.5] bg-gray-50">
                                                <img
                                                    src={getImageUrl(item.image)}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />

                                                <div className="absolute top-3 right-3 bg-white text-gray-900 font-bold text-xs sm:text-md px-3 sm:px-4 py-1 rounded-full shadow-md flex items-center gap-1 z-10">
                                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                    <span>{item.rating ? Number(item.rating).toFixed(1) : '0.0'}</span>
                                                </div>

                                                {item.is_promo && (
                                                    <div className="absolute top-3 left-3 bg-[#D94343] text-white font-bold text-[10px] px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1">
                                                        <Tag className="h-2.5 w-2.5" />
                                                        Promo
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-3 sm:mt-4 flex-grow flex flex-col justify-between px-3 sm:px-4 pb-4 sm:pb-6">
                                                <div>
                                                    <h3 className="font-poppins font-bold text-base sm:text-lg text-cafe-secondary tracking-tight line-clamp-1">
                                                        {item.name}
                                                    </h3>
                                                    <p className="mt-1 font-poppins text-xs text-cafe-secondary/70 line-clamp-1">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2">
                                                    <div className="flex flex-col">
                                                        {item.is_promo && item.promo_price ? (
                                                            <>
                                                                <span className="font-poppins font-semibold text-sm sm:text-base text-[#D94343]">
                                                                    {formatIDR(item.promo_price)}
                                                                </span>
                                                                <span className="font-poppins text-[10px] text-gray-400 line-through">
                                                                    {formatIDR(item.price)}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="font-poppins font-semibold text-sm sm:text-base text-gray-800">
                                                                {formatIDR(item.price)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <button 
                                                        onClick={() => setSelectedItem(item)}
                                                        className="bg-[#D94343] hover:bg-[#c33a3a] text-white text-[10px] sm:text-[11px] font-bold px-3 sm:px-4 py-1.5 rounded-xl transition-colors shadow-xs"
                                                    >
                                                        {displayBadge}
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>

                        {/* Navigasi Panah Desktop */}
                        <button
                            onClick={() => swiperRef.current?.slidePrev()}
                            aria-label="Sebelumnya"
                            className="hidden md:flex absolute -left-4 top-[40%] -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-md border border-gray-100 hover:bg-[#D94343] hover:text-white transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => swiperRef.current?.slideNext()}
                            aria-label="Berikutnya"
                            className="hidden md:flex absolute -right-4 top-[40%] -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-md border border-gray-100 hover:bg-[#D94343] hover:text-white transition-colors"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <div className="mt-12 text-center p-6 sm:p-8 bg-white rounded-2xl border border-dashed border-gray-300 max-w-sm mx-auto">
                        <p className="text-xs text-gray-500 font-medium">
                            Menu tidak ditemukan. Coba kata kunci lainnya.
                        </p>
                    </div>
                )}
                    </>
                )}
            </div>

    
        </section>
    );
}