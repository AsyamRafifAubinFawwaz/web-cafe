import { Maximize2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface GalleryData {
    id: number;
    name: string;
    description?: string;
    image: string;
}

interface GalleryProps {
    galleries?: GalleryData[];
}

export default function Gallery({ galleries = [] }: GalleryProps) {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const headerAnim = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
    const gridAnim = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
    const extraAnim = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

    const getImageUrl = (imagePath?: string) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
        return `/storage/${cleanPath}`;
    };

    const galleryItems = galleries.map((item, index) => {
        let gridClass = 'col-span-1 aspect-[3/4]'; 
        if (index === 0) gridClass = 'col-span-2 aspect-[3/2]';
        else if (index === 1) gridClass = 'col-span-1 aspect-[3/4]';
        else if (index >= 2 && index <= 4) gridClass = 'col-span-1 aspect-[3/4]';

        const pinColor = index % 2 === 0 ? 'bg-[#F2C94C]' : 'bg-[#D94343]';
        
        return {
            ...item,
            description: item.description || 'Moment indah kebersamaan di Nugas Cafe',
            gridClass,
            pinColor,
        };
    });

    const bentoItems = galleryItems.slice(0, 5);
    const extraItems = galleryItems.slice(5);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIdx !== null) {
            setSelectedIdx((selectedIdx + 1) % galleryItems.length);
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIdx !== null) {
            setSelectedIdx((selectedIdx - 1 + galleryItems.length) % galleryItems.length);
        }
    };

    return (
        <section id="gallery" className="bg-cafe-bg py-12 sm:py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <div
                    ref={headerAnim.ref}
                    className={`text-center max-w-2xl mx-auto mb-10 sm:mb-16 scroll-fade-up ${headerAnim.isVisible ? 'scroll-visible' : 'scroll-hidden'}`}
                >
                    <h2 className="mt-2 font-chewy text-4xl sm:text-5xl md:text-6xl text-cafe-primary underline decoration-3 underline-offset-4">
                        Nugas <span className='text-cafe-secondary'>Gallery</span>
                    </h2>
                    <p className="mt-3 sm:mt-4 font-poppins text-base sm:text-lg text-cafe-secondary tracking-wide">
                        Abadikan moment moment kebersamaan
                    </p>
                </div>

                {galleries.length === 0 ? (
                    <div className="mx-auto max-w-2xl bg-white/80 backdrop-blur-md p-8 sm:p-12 rounded-[2rem] border border-gray-200 shadow-lg text-center">
                        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-200">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-chewy text-2xl sm:text-3xl text-cafe-primary mb-3">Koleksi Foto Segera Hadir</h3>
                        <p className="font-poppins text-sm sm:text-base text-cafe-secondary/80 leading-relaxed">
                            Keseruan di Nugas Cafe akan segera kami bagikan di sini. Pantau terus ya!
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Asymmetric Gallery Photo Grid */}
                        <div
                            ref={gridAnim.ref}
                            className={`grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 items-stretch scroll-fade-up scroll-stagger ${gridAnim.isVisible ? 'scroll-visible' : 'scroll-hidden'}`}
                            style={{ '--stagger-delay': '150ms' } as React.CSSProperties}
                        >
                    {bentoItems.map((item, idx) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedIdx(idx)}
                            className={`group relative p-2.5 sm:p-3 md:p-4 bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl sm:rounded-[1.8rem] cursor-pointer transition-transform duration-300 hover:-translate-y-1 flex flex-col justify-between ${item.gridClass}`}
                        >
                            {/* Pin Bulat Pojok Kiri Atas (Sesuai Referensi Gambar) */}
                            <div className={`absolute -top-1.5 -left-1.5 sm:-top-2 sm:-left-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-3 sm:border-4 border-white shadow-sm z-20 ${item.pinColor}`} />

                            {/* Container Gambar */}
                            <div className="relative w-full h-full overflow-hidden rounded-xl sm:rounded-[1.4rem] bg-gray-50 flex-1">
                                <img
                                    src={getImageUrl(item.image)}
                                    alt={item.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                                />
                                
                                {/* Hover Overlay Info Ringkas */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-5">
                                    <div className="flex justify-between items-center text-white mb-1">
                                        <h3 className="font-poppins font-bold text-xs sm:text-sm tracking-wide">
                                            {item.name}
                                        </h3>
                                        <div className="bg-white/20 backdrop-blur-xs p-1 sm:p-1.5 rounded-full">
                                            <Maximize2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                                        </div>
                                    </div>
                                    <p className="font-sans text-[10px] sm:text-[11px] text-white/80 leading-relaxed line-clamp-2">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                        </div>

                        {/* Expand Button */}
                        {extraItems.length > 0 && (
                            <div className="mt-10 flex justify-center">
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#D94343] hover:bg-[#c33a3a] text-white font-poppins font-semibold text-sm rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    {isExpanded ? 'Sembunyikan Gambar' : 'Lihat Gambar Lainnya'}
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                            </div>
                        )}

                        {/* Extra Items Grid */}
                        {isExpanded && extraItems.length > 0 && (
                            <div
                                ref={extraAnim.ref}
                                className={`mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 items-stretch scroll-fade-up scroll-stagger ${extraAnim.isVisible || isExpanded ? 'scroll-visible' : 'scroll-hidden'}`}
                            >
                                {extraItems.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedIdx(idx + 5)}
                                        className={`group relative p-2.5 sm:p-3 bg-white border border-gray-100 shadow-sm rounded-2xl cursor-pointer transition-transform duration-300 hover:-translate-y-1 ${item.gridClass}`}
                                    >
                                        <div className="relative w-full h-full overflow-hidden rounded-xl bg-gray-50 flex-1 aspect-square">
                                            <img
                                                src={getImageUrl(item.image)}
                                                alt={item.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-5">
                                                <div className="flex justify-between items-center text-white mb-1">
                                                    <h3 className="font-poppins font-bold text-xs sm:text-sm tracking-wide">
                                                        {item.name}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Lightbox / Slideshow Modal */}
            {selectedIdx !== null && (
                <div
                    onClick={() => setSelectedIdx(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/95 backdrop-blur-xs"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-w-4xl w-full flex flex-col items-center"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedIdx(null)}
                            className="absolute -top-10 sm:-top-12 right-0 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 text-sm sm:text-lg transition-colors border border-white/10 z-10"
                        >
                            ✕
                        </button>

                        {/* Navigation controls */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-1 sm:left-2 md:-left-16 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/10"
                        >
                            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                        
                        <button
                            onClick={handleNext}
                            className="absolute right-1 sm:right-2 md:-right-16 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/10"
                        >
                            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>

                        {/* Image Slide Card */}
                        <div className="bg-white p-2 sm:p-3 md:p-4 rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl max-w-full flex flex-col w-full max-h-[85vh]">
                            <div className="w-full overflow-hidden rounded-xl sm:rounded-[1.8rem] bg-black flex items-center justify-center">
                                <img
                                    src={getImageUrl(galleryItems[selectedIdx].image)}
                                    alt={galleryItems[selectedIdx].name}
                                    className="max-h-[45vh] sm:max-h-[55vh] md:max-h-[60vh] object-contain w-auto h-full"
                                />
                            </div>
                            
                            {/* Slide Text Content */}
                            <div className="p-3 sm:p-4 md:p-6 text-gray-800">
                                <h3 className="font-poppins font-bold text-lg sm:text-xl text-gray-900">
                                    {galleryItems[selectedIdx].name}
                                </h3>
                                <p className="mt-1 font-sans text-xs sm:text-sm text-gray-500 leading-relaxed">
                                    {galleryItems[selectedIdx].description}
                                </p>
                            </div>
                        </div>

                        {/* Pagination Counter */}
                        <div className="mt-3 sm:mt-4 font-sans text-xs text-white/60">
                            {selectedIdx + 1} / {galleryItems.length}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}