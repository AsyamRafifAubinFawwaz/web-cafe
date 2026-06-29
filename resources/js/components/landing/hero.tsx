import React from 'react';

interface HeroProps {
    onReservasiClick?: () => void;
    onMenuClick?: () => void;
}

export default function Hero({ onReservasiClick, onMenuClick }: HeroProps) {
    return (
        <section id="hero" className="relative overflow-hidden bg-cafe-bg py-16 md:py-24 lg:py-32">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-cafe-primary/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-80 w-80 rounded-full bg-cafe-secondary/5 blur-3xl" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    {/* Left Column: Text & CTA */}
                    <div className="text-center lg:text-left order-2 lg:order-1 animate-fade-in-up">
                        <span className="inline-flex items-center rounded-full bg-cafe-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-cafe-primary uppercase">
                            ☕ Motrack Cafe Solution
                        </span>
                        
                        <h1 className="mt-6 font-chewy text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none text-cafe-primary drop-shadow-sm">
                            Tempat Terbaik untuk Kopi & Diskusi
                        </h1>
                        
                        <p className="mt-6 font-poppins text-base sm:text-lg text-cafe-secondary/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Nikmati perpaduan biji kopi pilihan nusantara dengan suasana cafe yang hangat, nyaman, dan tenang. Cocok untuk produktivitas kerja kelompok maupun momen santai bersama komunitas Anda.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                            <button
                                onClick={onReservasiClick}
                                className="group relative overflow-hidden rounded-xl bg-cafe-primary px-8 py-4 font-poppins font-bold text-white shadow-lg transition-all duration-300 hover:bg-cafe-primary/90 hover:shadow-cafe-primary/30 hover:shadow-xl active:scale-95"
                            >
                                <span className="relative z-10">Reservasi Tempat</span>
                                <div className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0" />
                            </button>
                            
                            <button
                                onClick={onMenuClick}
                                className="rounded-xl border-2 border-cafe-secondary px-8 py-4 font-poppins font-bold text-cafe-secondary transition-all duration-300 hover:bg-cafe-secondary hover:text-white active:scale-95"
                            >
                                Lihat Buku Menu
                            </button>
                        </div>

                        {/* Cafe Mini Stats */}
                        <div className="mt-12 grid grid-cols-3 gap-6 border-t border-cafe-secondary/10 pt-8 max-w-md mx-auto lg:mx-0">
                            <div>
                                <p className="font-chewy text-2xl md:text-3xl text-cafe-primary">100%</p>
                                <p className="font-poppins text-xs text-cafe-secondary/70">Arabica & Robusta</p>
                            </div>
                            <div>
                                <p className="font-chewy text-2xl md:text-3xl text-cafe-primary">50+</p>
                                <p className="font-poppins text-xs text-cafe-secondary/70">Kapasitas Kursi</p>
                            </div>
                            <div>
                                <p className="font-chewy text-2xl md:text-3xl text-cafe-primary">4.8★</p>
                                <p className="font-poppins text-xs text-cafe-secondary/70">Ulasan Google</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Premium Image Asset */}
                    <div className="relative order-1 lg:order-2 flex justify-center items-center">
                        <div className="relative w-full max-w-md md:max-w-lg lg:max-w-full">
                            {/* Decorative frame background */}
                            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border-2 border-dashed border-cafe-primary/30" />
                            
                            {/* main image container */}
                            <div className="relative overflow-hidden rounded-3xl border-4 border-cafe-white bg-cafe-white shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                                <img
                                    src="/images/cafe_hero.png"
                                    alt="Fresh Brewed Coffee and Croissant at Motrack Cafe"
                                    className="h-[300px] sm:h-[400px] md:h-[450px] w-full object-cover"
                                />
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 rotate-12 bg-cafe-secondary p-4 rounded-2xl shadow-xl border-2 border-cafe-white hidden sm:block animate-bounce-slow">
                                <p className="font-chewy text-lg text-cafe-bg">Freshly Baked!</p>
                                <p className="font-poppins text-2xs text-cafe-white/80">Setiap pagi hari</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
