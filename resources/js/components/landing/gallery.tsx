import { Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

interface GalleryItem {
    id: number;
    name: string;
    description: string;
    image: string;
}

export default function Gallery() {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    const galleryItems: GalleryItem[] = [
        {
            id: 1,
            name: 'Sudut Baca Cozy',
            description: 'Sudut tenang dengan deretan buku fiksi & non-fiksi untuk dibaca santai sambil minum latte hangat.',
            image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&auto=format&fit=crop&q=60'
        },
        {
            id: 2,
            name: 'Barista Espresso Area',
            description: 'Pusat pembuatan kopi espresso terbaik kami, dirancang semi-terbuka agar Anda dapat melihat langsung proses penyeduhannya.',
            image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop&q=60'
        },
        {
            id: 3,
            name: 'Pojok Outdoor Rimbun',
            description: 'Area luar ruangan yang teduh dipenuhi tanaman hijau hias, memberikan kesejukan alami untuk nongkrong sore.',
            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=60'
        },
        {
            id: 4,
            name: 'Ruang Meeting VIP',
            description: 'Dilengkapi dengan smart TV proyektor, AC dingin, dan papan tulis, ideal untuk presentasi kelompok atau rapat internal.',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60'
        },
        {
            id: 5,
            name: 'Penyajian Manual Brew',
            description: 'Biji kopi single-origin lokal yang diseduh dengan presisi tinggi menghasilkan cita rasa buah dan bunga yang unik.',
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=60'
        },
        {
            id: 6,
            name: 'Event Gathering Komunitas',
            description: 'Salah satu momen keseruan acara bincang-bincang buku dan musik akustik di akhir pekan.',
            image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=60'
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
        <section id="gallery" className="bg-cafe-bg py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto">
                    <span className="text-sm font-semibold tracking-wider text-cafe-primary uppercase">
                        Galeri Foto
                    </span>
                    <h2 className="mt-2 font-chewy text-4xl sm:text-5xl text-cafe-secondary">
                        Suasana & Hidangan Terfavorit
                    </h2>
                    <p className="mt-4 font-poppins text-sm sm:text-base text-cafe-secondary/70">
                        Intip sekilas momen kehangatan, keindahan tata ruang indoor/outdoor, serta aneka sajian kuliner yang dibuat dengan cinta di Motrack Cafe.
                    </p>
                </div>

                {/* Gallery Photo Grid */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryItems.map((item, idx) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedIdx(idx)}
                            className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-md aspect-square bg-cafe-secondary/5 border border-cafe-secondary/5"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            
                            {/* Hover Overlay with detail */}
                            <div className="absolute inset-0 bg-gradient-to-t from-cafe-secondary/90 via-cafe-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <div className="flex justify-between items-center text-white mb-2">
                                    <h3 className="font-chewy text-xl tracking-wide">
                                        {item.name}
                                    </h3>
                                    <div className="bg-white/20 p-2 rounded-full">
                                        <Maximize2 className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                                <p className="font-poppins text-2xs text-white/80 leading-relaxed line-clamp-2">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox / Slideshow Modal */}
            {selectedIdx !== null && (
                <div
                    onClick={() => setSelectedIdx(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xs animate-fade-in"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-w-4xl w-full flex flex-col items-center animate-scale-in"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedIdx(null)}
                            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black text-lg transition-colors border border-white/10"
                        >
                            ✕
                        </button>

                        {/* Navigation controls */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black transition-colors border border-white/10"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black transition-colors border border-white/10"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>

                        {/* Image Slide */}
                        <div className="bg-cafe-secondary/90 rounded-3xl overflow-hidden shadow-2xl max-w-full flex flex-col border border-white/10">
                            <img
                                src={galleryItems[selectedIdx].image}
                                alt={galleryItems[selectedIdx].name}
                                className="max-h-[70vh] object-contain w-auto self-center bg-black"
                            />
                            
                            {/* Slide Text Content */}
                            <div className="p-6 bg-cafe-secondary text-white">
                                <h3 className="font-chewy text-2xl tracking-wide text-cafe-primary">
                                    {galleryItems[selectedIdx].name}
                                </h3>
                                <p className="mt-2 font-poppins text-xs sm:text-sm text-white/80 leading-relaxed">
                                    {galleryItems[selectedIdx].description}
                                </p>
                            </div>
                        </div>

                        {/* Pagination Counter */}
                        <div className="mt-4 font-poppins text-xs text-white/60">
                            {selectedIdx + 1} / {galleryItems.length}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
