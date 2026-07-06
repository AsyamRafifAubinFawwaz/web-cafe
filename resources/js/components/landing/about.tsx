import { Utensils, Clock, Star, Tag,  } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaTiktok, FaYoutube } from 'react-icons/fa6';
import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AboutProps {
    menuCount?: number;
    promoCount?: number;
}

export default function About({ menuCount = 0, promoCount = 0 }: AboutProps) {
    const statsAnim = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
    const imageAnim = useScrollAnimation<HTMLDivElement>({ threshold: 0.15 });
    const textAnim = useScrollAnimation<HTMLDivElement>({ threshold: 0.15 });

    const stats = [
        { icon: Utensils, value: menuCount, label: 'Menu' },
        { icon: Clock, value: '24/7', label: 'Pelayanan' },
        { icon: Star, value: '4,9', label: 'Rating' },
    ];

    if (promoCount > 0) {
        stats.push({ icon: Tag, value: promoCount, label: 'Promo' });
    }
    
    return (
        <section id="about" className="bg-cafe-bg pt-12 sm:pt-16 md:pt-24">

            {/* Stats Row */}
            <div
                ref={statsAnim.ref}
                className={`flex justify-center items-center max-w-screen pb-12 sm:pb-16 md:pb-20 px-4 scroll-fade-up ${statsAnim.isVisible ? 'scroll-visible' : 'scroll-hidden'}`}
            >
                <div className="grid grid-cols-2 gap-6 sm:gap-8 md:flex md:justify-between md:items-center w-full md:w-[70%]">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={idx}
                                className="grid items-center justify-center scroll-stagger"
                                style={{ '--stagger-delay': `${idx * 100}ms` } as React.CSSProperties}
                            >
                                <h2 className='text-center text-cafe-primary font-poppins font-bold text-2xl sm:text-3xl md:text-3xl flex items-center gap-2 justify-center'>
                                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-cafe-primary" />
                                    {stat.value}
                                </h2>
                                <p className='text-center text-cafe-primary font-poppins text-sm sm:text-base md:text-md'>{stat.label}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* About Content */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-14">
                  
                    {/* Image */}
                    <div
                        ref={imageAnim.ref}
                        className={`relative flex justify-center items-center w-full md:w-1/2 scroll-fade-left ${imageAnim.isVisible ? 'scroll-visible' : 'scroll-hidden'}`}
                    >  
                        <img
                            src="/images/about-img.png"
                            alt="Motrack Cafe Cozy Interior"
                            className="w-full h-full p-2 sm:p-4"
                        />
                    </div>

                    {/* Text Content */}
                    <div
                        ref={textAnim.ref}
                        className={`flex flex-col w-full md:w-1/2 text-center md:text-left scroll-fade-right ${textAnim.isVisible ? 'scroll-visible' : 'scroll-hidden'}`}
                    >

                        <h2 className="mt-2 font-chewy text-4xl sm:text-5xl md:text-6xl text-cafe-primary underline decoration-3 underline-offset-4">
                            Nugas <span className='text-cafe-secondary'>Cafe</span>
                        </h2>
                        
                        <p className="mt-4 sm:mt-6 font-poppins text-sm sm:text-base text-cafe-secondary/90 leading-relaxed">
                            Didirikan sejak tahun 2023, Nugas Cafe hadir bukan sekadar sebagai tempat minum kopi biasa. Kami mendedikasikan ruang ini sebagai wadah kolaborasi, produktivitas, dan istirahat yang nyaman di tengah hiruk-pikuk aktivitas kota jember.
                        </p>
                        
                        <p className="mt-3 sm:mt-4 font-poppins text-sm sm:text-base text-cafe-secondary/90 leading-relaxed">
                            Setiap cangkir kopi yang kami sajikan dibuat oleh barista berpengalaman menggunakan biji kopi lokal Indonesia terbaik. Kami menggabungkan suasana hangat rumah dengan fasilitas nongkrong yang asik.
                        </p>

                        <div className="flex gap-4 sm:gap-6 items-center mt-5 sm:mt-6 justify-center md:justify-start">
                            <a className='flex justify-center items-center rounded-full bg-cafe-primary hover:scale-105 transition-all duration-300 cursor-pointer' href="">
                                <FaInstagram className='w-11 h-11 sm:w-14 sm:h-14 text-white p-2.5 sm:p-3'></FaInstagram>
                            </a>
                            <a className='flex justify-center items-center rounded-full bg-cafe-primary hover:scale-105 transition-all duration-300 cursor-pointer' href="">
                                <FaYoutube className='w-11 h-11 sm:w-14 sm:h-14 text-white p-2.5 sm:p-3'></FaYoutube>
                            </a>
                            <a className='flex justify-center items-center rounded-full bg-cafe-primary hover:scale-105 transition-all duration-300 cursor-pointer' href="">
                                <FaTiktok className='w-11 h-11 sm:w-14 sm:h-14 text-white p-2.5 sm:p-3'></FaTiktok>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
