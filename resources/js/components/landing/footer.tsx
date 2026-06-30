import { Instagram, Phone, Mail, MapPin, Coffee, ArrowUp } from 'lucide-react';
import React from 'react';

export default function Footer() {
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-cafe-secondary text-cafe-bg relative">
            {/* Top wave/curve overlay alternative or clean border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-cafe-primary" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Column 1: Brand & Logo */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cafe-primary text-white">
                                <Coffee className="h-5 w-5" />
                            </div>
                            <span className="font-chewy text-2xl tracking-wider text-cafe-white">
                                MOTRACK
                            </span>
                        </div>
                        <p className="font-poppins text-xs text-cafe-bg/70 leading-relaxed">
                            Ekosistem digital cafe solusi masa kini. Kami menggabungkan kenikmatan kopi cita rasa tinggi dengan kenyamanan dan kepraktisan manajemen operasional.
                        </p>
                        <p className="font-poppins text-[10px] text-cafe-bg/40 mt-4">
                            © {new Date().getFullYear()} Motrack Cafe Solution. All rights reserved.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-chewy text-lg text-cafe-white tracking-wider">Navigasi Cepat</h3>
                        <ul className="flex flex-col gap-2 font-poppins text-xs text-cafe-bg/85">
                            <li><a href="#hero" className="hover:text-cafe-primary transition-colors">Beranda</a></li>
                            <li><a href="#about" className="hover:text-cafe-primary transition-colors">Tentang Kami</a></li>
                            <li><a href="#menu" className="hover:text-cafe-primary transition-colors">Katalog Menu</a></li>
                            <li><a href="#promo" className="hover:text-cafe-primary transition-colors">Promo Diskon</a></li>
                            <li><a href="#gallery" className="hover:text-cafe-primary transition-colors">Galeri Foto</a></li>
                            <li><a href="#reviews" className="hover:text-cafe-primary transition-colors">Ulasan Pelanggan</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact & Address */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-chewy text-lg text-cafe-white tracking-wider">Kontak & Alamat</h3>
                        <ul className="flex flex-col gap-3 font-poppins text-xs text-cafe-bg/85">
                            <li className="flex gap-2 items-start">
                                <MapPin className="h-4 w-4 shrink-0 text-cafe-primary" />
                                <span>Jl. Kopi Nusantara No. 88, Lowokwaru, Kota Malang, Jawa Timur 65141</span>
                            </li>
                            <li className="flex gap-2 items-center">
                                <Phone className="h-4 w-4 shrink-0 text-cafe-primary" />
                                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="hover:text-cafe-primary transition-colors">+62 812-3456-7890</a>
                            </li>
                            <li className="flex gap-2 items-center">
                                <Mail className="h-4 w-4 shrink-0 text-cafe-primary" />
                                <a href="mailto:info@motrackcafe.com" className="hover:text-cafe-primary transition-colors">info@motrackcafe.com</a>
                            </li>
                            <li className="flex gap-2 items-center">
                                <Instagram className="h-4 w-4 shrink-0 text-cafe-primary" />
                                <a href="https://instagram.com/motrack.cafe" target="_blank" rel="noopener noreferrer" className="hover:text-cafe-primary transition-colors">@motrack.cafe</a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Google Maps Embed Mockup/Real iframe */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-chewy text-lg text-cafe-white tracking-wider">Lokasi Kami</h3>
                        <div className="h-40 w-full rounded-2xl overflow-hidden shadow-md border-2 border-cafe-bg/10 relative group">
                            {/* Static mock Map representation for stability / clean styling, or simple real iframe */}
                            <iframe 
                                title="Motrack Cafe Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.4285743128913!2d112.61332767484482!3d-7.954605992070087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78827e2f5b61e7%3A0x7d81232ad320cd15!2sUniversitas%20Brawijaya!5e0!3m2!1sid!2sid!4v1719672000000!5m2!1sid!2sid"
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen={false} 
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-cafe-bg/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="font-poppins text-[10px] text-cafe-bg/50">
                        Dirancang dengan ♥ oleh Antigravity untuk Motrack Cafe Solution.
                    </p>
                    
                    <button
                        onClick={handleScrollToTop}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-cafe-primary hover:bg-cafe-primary/90 text-white shadow-md transition-all active:scale-90"
                    >
                        <ArrowUp className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </footer>
    );
}
