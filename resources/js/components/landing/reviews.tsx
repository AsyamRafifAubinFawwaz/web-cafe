import React, { useEffect } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function Reviews() {
    const headerAnim = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
    const widgetAnim = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

    // Load Elfsight Script secara aman di dalam React Lifecycle
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://elfsightcdn.com/platform.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Bersihkan skrip saat komponen tidak lagi dimuat agar tidak duplikat
            document.body.removeChild(script);
        };
    }, []);

    return (
        <section id="reviews" className="bg-[#FFF9F4] py-12 sm:py-16 md:py-24 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
                
                <div
                    ref={headerAnim.ref}
                    className={`text-center max-w-2xl mx-auto mb-10 sm:mb-16 scroll-fade-up ${headerAnim.isVisible ? 'scroll-visible' : 'scroll-hidden'}`}
                >
                    <h2 className="mt-2 font-chewy text-4xl sm:text-5xl md:text-6xl text-cafe-primary underline decoration-3 underline-offset-4">
                        Testimoni <span className='text-cafe-secondary'>Pelanggan</span>
                    </h2>
                </div>


                {/* Container Premium untuk Elfsight Widget */}
                <div
                    ref={widgetAnim.ref}
                    className={`mt-12 sm:mt-16 md:mt-24 max-w-5xl mx-auto scroll-fade-up scroll-stagger ${widgetAnim.isVisible ? 'scroll-visible' : 'scroll-hidden'}`}
                    style={{ '--stagger-delay': '200ms' } as React.CSSProperties}
                >
                    <div className="bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                        
                        {/* Elfsight Target Div */}
                        <div 
                            className="elfsight-app-311585c3-0f7b-4b13-908a-9cb6873287ca" 
                            data-elfsight-app-lazy
                        ></div>
                        
                    </div>
                </div>


            </div>
        </section>
    );
}