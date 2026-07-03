import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface HeroProps {
    onReservasiClick?: () => void;
    onMenuClick?: () => void;
}

export default function Hero({ onReservasiClick, onMenuClick }: HeroProps) {
    const titleAnim = useScrollAnimation<HTMLHeadingElement>({ threshold: 0.1 });
    const subtitleAnim = useScrollAnimation<HTMLParagraphElement>({ threshold: 0.1 });
    const ctaAnim = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

    return (
        <section id="hero" className="min-h-screen max-h-screen relative overflow-hidden bg-[#ED4A4D] py-12 sm:py-16 md:py-24 lg:py-24">
          
            <div className="mx-auto max-screen flex flex-col justify-center items-center w-full h-full px-4 sm:px-6">

                <img className='w-full absolute bottom-[-50%] right-[-4%] scale-130 opacity-90' src="images/hero-img.png" alt="" />

                <p
                    ref={subtitleAnim.ref}
                    className={`text-center text-cafe-white font-jawa text-base sm:text-lg md:text-2xl lg:text-4xl pb-2 scroll-fade-down ${subtitleAnim.isVisible ? 'scroll-visible' : 'scroll-hidden'}`}
                >
                    Nugas Cafe
                </p>

                <h1
                    ref={titleAnim.ref}
                    className={`text-center font-chewy text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] text-cafe-white drop-shadow-sm scroll-fade-up ${titleAnim.isVisible ? 'scroll-visible' : 'scroll-hidden'}`}
                >
                    Rasa Yang Tepat Untuk <br /> Setiap Momen Kamu di <br />
                    <span className='text-cafe-yellow'>Jember.</span>
                </h1>
                        
                <div
                    ref={ctaAnim.ref}
                    className={`mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0 scroll-fade-up scroll-stagger ${ctaAnim.isVisible ? 'scroll-visible' : 'scroll-hidden'}`}
                    style={{ '--stagger-delay': '200ms' } as React.CSSProperties}
                >
                    <button
                        onClick={onReservasiClick}
                        className="group relative overflow-hidden rounded-xl bg-cafe-white px-8 sm:px-12 py-3.5 sm:py-4 font-poppins font-bold text-sm sm:text-base text-cafe-primary shadow-lg transition-all duration-300 hover:bg-cafe-white hover:text-cafe-primary hover:scale-105 active:scale-95 cursor-pointer border-b-4 border-cafe-primary/90"
                    >
                        <span className="relative z-10">Reservasi</span>
                    </button>
                    
                    <button
                        onClick={onMenuClick}
                        className="group relative overflow-hidden rounded-xl bg-cafe-primary/50 px-8 sm:px-12 py-3.5 sm:py-4 font-poppins font-bold text-sm sm:text-base text-cafe-white shadow-lg transition-all duration-300 hover:bg-cafe-white hover:text-cafe-primary hover:scale-105 active:scale-95 cursor-pointer border-3 border-cafe-white"
                    >
                        <span>Lihat Menu</span>
                    </button>
                </div>

                        {/* <div className="mt-12 grid grid-cols-3 gap-6 border-t border-cafe-secondary/10 pt-8 max-w-md mx-auto lg:mx-0">
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
                        </div> */}




                    
                    {/* <div className="relative order-1 lg:order-2 flex justify-center items-center">
                        <div className="relative w-full max-w-md md:max-w-lg lg:max-w-full">
                    
                            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border-2 border-dashed border-cafe-primary/30" />
                            
                            <div className="relative overflow-hidden rounded-3xl border-4 border-cafe-white bg-cafe-white shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                                <img
                                    src="/images/cafe_hero.png"
                                    alt="Fresh Brewed Coffee and Croissant at Motrack Cafe"
                                    className="h-[300px] sm:h-[400px] md:h-[450px] w-full object-cover"
                                />
                            </div>

                            <div className="absolute -bottom-6 -left-6 rotate-12 bg-cafe-secondary p-4 rounded-2xl shadow-xl border-2 border-cafe-white hidden sm:block animate-bounce-slow">
                                <p className="font-chewy text-lg text-cafe-bg">Freshly Baked!</p>
                                <p className="font-poppins text-2xs text-cafe-white/80">Setiap pagi hari</p>
                         mot   </div>
                        </div>
                    </div> */}
                    
                
            </div>
        </section>
    );
}
