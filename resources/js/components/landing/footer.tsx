import { Instagram, Phone, Mail, MapPin, Coffee, Youtube } from 'lucide-react';
import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function Footer() {
    const footerAnim = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

    return (
        <footer className="bg-[#5C1315] text-white relative">
            <div
                ref={footerAnim.ref}
                className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-10 sm:py-16 scroll-fade-up ${footerAnim.isVisible ? 'scroll-visible' : 'scroll-hidden'}`}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
                    
                    {/* Column 1: Brand & Logo (lg:col-span-4) */}
                    <div className="flex flex-col gap-5 lg:col-span-4">
                        <div className="flex items-center">
                            {/* <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#E5B25C] text-[#E5B25C]">
                                <Coffee className="h-6 w-6" />
                            </div> */}
                            <img src="images/logo-nugas.png" className="h-16 w-16" alt="Nugas Cafe Logo" />
                            <span className="font-chewy text-3xl sm:text-4xl tracking-wider text-white flex gap-2">
                                Nugas <span className="text-[#E5B25C]">Cafe</span>
                            </span>
                        </div>
                        <p className="font-poppins text-sm text-white/90 leading-relaxed pr-0 lg:pr-6">
                            Ruang komunal produktif di Jember untuk kenyamanan belajar dan bekerja. Nikmati Wi-Fi cepat, colokan melimpah, dan harga ramah mahasiswa.
                        </p>
                        
                        {/* Social Icons */}
                        <div className="flex items-center gap-4 mt-2">
                            <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#5C1315] hover:scale-110 hover:bg-[#E5B25C] transition-all">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#5C1315] hover:scale-110 hover:bg-[#E5B25C] transition-all">
                                <Youtube className="h-5 w-5" />
                            </a>
                            <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#5C1315] hover:scale-110 hover:bg-[#E5B25C] transition-all">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.27 6.36 6.34 6.34 0 0 0 6.25-6.36V7.95a8.16 8.16 0 0 0 5 1.54V6.03a4.7 4.7 0 0 1-2.93-2.34z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links (lg:col-span-2) */}
                    <div className="flex flex-col gap-4 lg:col-span-2 lg:pl-4">
                        <h3 className="font-poppins font-semibold text-lg text-white">Navigasi</h3>
                        <ul className="flex flex-col gap-3 font-poppins text-sm text-white/80">
                            <li><a href="#hero" className="hover:text-[#E5B25C] transition-colors">Beranda</a></li>
                            <li><a href="#about" className="hover:text-[#E5B25C] transition-colors">Tentang Kami</a></li>
                            <li><a href="#menu" className="hover:text-[#E5B25C] transition-colors">Menu</a></li>
                            <li><a href="#promo" className="hover:text-[#E5B25C] transition-colors">Promo</a></li>
                            <li><a href="#gallery" className="hover:text-[#E5B25C] transition-colors">Galeri</a></li>
                            <li><a href="#reviews" className="hover:text-[#E5B25C] transition-colors">Ulasan</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact & Address (lg:col-span-3) */}
                    <div className="flex flex-col gap-4 lg:col-span-3">
                        <h3 className="font-poppins font-semibold text-lg text-white">Kontak</h3>
                        <ul className="flex flex-col gap-4 font-poppins text-sm text-white/80">
                            <li className="flex gap-3 items-start">
                                <MapPin className="h-5 w-5 shrink-0 text-[#E5B25C]" />
                                <span>Jl. Mastrip 4 No.61, Lingkungan Krajan Timur, Tegalgede, Kec. Sumbersari, Kabupaten Jember, Jawa Timur 68121</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Phone className="h-5 w-5 shrink-0 text-[#E5B25C]" />
                                <a href="https://wa.me/6285736658648" target="_blank" rel="noopener noreferrer" className="hover:text-[#E5B25C] transition-colors">+62 812-3456-7890</a>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Mail className="h-5 w-5 shrink-0 text-[#E5B25C]" />
                                <a href="mailto:halo@nugascafe.com" className="hover:text-[#E5B25C] transition-colors">halo@nugascafe.com</a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Google Maps Embed (lg:col-span-3) */}
                    <div className="flex flex-col gap-4 lg:col-span-3">
                        <div className="h-48 sm:h-full min-h-[200px] w-full rounded-xl overflow-hidden shadow-lg border-[3px] border-[#93c5fd] bg-white relative group">
                            <iframe 
                                title="Nugas Cafe Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.4287085438446!2d113.7263402!3d-8.159488999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd6959986d27375%3A0xedd5b132ed9bc180!2sNugas%20Jember%20(Coffee%2C%20Food%2C%20and%20Space)!5e0!3m2!1sid!2sid!4v1783184555042!5m2!1sid!2sid"
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen={false} 
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="opacity-95 group-hover:opacity-100 transition-all duration-300"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 sm:mt-16 pt-6 border-t border-white/10 flex justify-center items-center">
                    <p className="font-poppins text-xs sm:text-sm text-white/80 tracking-wide text-center">
                        @ Nugas Cafe {new Date().getFullYear()} - All Rights Reserved
                    </p>
                </div>
            </div>
        </footer>
    );
}
