import { Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface GalleryItem {
    id: number;
    name: string;
    description: string;
    image: string;
    gridClass: string;   // Untuk mengatur ukuran asimetris masing-masing kartu
    pinColor: string;   // Warna dot dekoratif di pojok (kuning/merah sesuai gambar)
}

export default function Gallery() {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const headerAnim = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
    const gridAnim = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

    const galleryItems: GalleryItem[] = [
        {
            id: 1,
            name: 'Sudut Baca Cozy',
            description: 'Sudut tenang dengan deretan buku fiksi & non-fiksi untuk dibaca santai sambil minum latte hangat.',
            image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&auto=format&fit=crop&q=60',
            gridClass: 'md:col-span-2 aspect-[4/3] sm:aspect-video md:aspect-auto', // Horizontal Lebar
            pinColor: 'bg-[#F2C94C]' // Kuning
        },
        {
            id: 2,
            name: 'Barista Espresso Area',
            description: 'Pusat pembuatan kopi espresso terbaik kami, dirancang semi-terbuka agar Anda dapat melihat langsung proses penyeduhannya.',
            image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop&q=60',
            gridClass: 'md:col-span-1 aspect-square md:aspect-auto', // Persegi standar
            pinColor: 'bg-[#D94343]' // Merah
        },
        {
            id: 3,
            name: 'Pojok Outdoor Rimbun',
            description: 'Area luar ruangan yang teduh dipenuhi tanaman hijau hias, memberikan kesejukan alami untuk nongkrong sore.',
            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=60',
            gridClass: 'md:col-span-1 aspect-[3/4]', // Vertikal Tinggi
            pinColor: 'bg-[#D94343]'
        },
        {
            id: 4,
            name: 'Ruang Meeting VIP',
            description: 'Dilengkapi dengan smart TV proyektor, AC dingin, dan papan tulis, ideal untuk presentasi kelompok atau rapat internal.',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60',
            gridClass: 'md:col-span-1 aspect-[3/4]', // Vertikal Tinggi
            pinColor: 'bg-[#D94343]'
        },
        {
            id: 5,
            name: 'Penyajian Manual Brew',
            description: 'Biji kopi single-origin lokal yang diseduh dengan presisi tinggi menghasilkan cita rasa buah dan bunga yang unik.',
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=60',
            gridClass: 'md:col-span-1 aspect-[3/4]', // Vertikal Tinggi
            pinColor: 'bg-[#D94343]'
        }
    ];

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
        <section id="gallery" className="bg-[#FFFCEF] py-12 sm:py-16 md:py-24">
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

                {/* Asymmetric Gallery Photo Grid */}
                <div
                    ref={gridAnim.ref}
                    className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 items-stretch scroll-fade-up scroll-stagger ${gridAnim.isVisible ? 'scroll-visible' : 'scroll-hidden'}`}
                    style={{ '--stagger-delay': '150ms' } as React.CSSProperties}
                >
                    {galleryItems.map((item, idx) => (
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
                                    src={item.image}
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
                                    src={galleryItems[selectedIdx].image}
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