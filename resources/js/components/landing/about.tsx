import { Wifi, BatteryCharging, Coffee, CalendarRange, Clock } from 'lucide-react';
import React from 'react';

export default function About() {
    const facilities = [
        { icon: Wifi, title: 'WiFi Cepat', desc: 'Internet stabil 100 Mbps untuk bekerja' },
        { icon: BatteryCharging, title: 'Banyak Colokan', desc: 'Stop kontak di setiap sudut meja' },
        { icon: Coffee, title: 'Menu Premium', desc: 'Biji kopi pilihan & bahan baku segar' },
        { icon: CalendarRange, title: 'Reservasi Ruang', desc: 'Bisa sewa area untuk gathering/event' },
    ];

    return (
        <section id="about" className="bg-cafe-white py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    {/* Left Column: Cozy Interior Photo */}
                    <div className="relative flex justify-center items-center">
                        <div className="relative w-full max-w-md md:max-w-lg lg:max-w-full">
                            {/* Decorative badge background color */}
                            <div className="absolute -top-4 -left-4 h-full w-full rounded-3xl bg-cafe-primary/5" />
                            
                            {/* Image container */}
                            <div className="relative overflow-hidden rounded-3xl shadow-xl border-4 border-cafe-bg">
                                <img
                                    src="/images/cafe_about.png"
                                    alt="Motrack Cafe Cozy Interior"
                                    className="h-[300px] sm:h-[400px] md:h-[450px] w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Cafe Story, Facilities, Hours */}
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold tracking-wider text-cafe-primary uppercase">
                            Kenalan dengan Kami
                        </span>
                        
                        <h2 className="mt-2 font-chewy text-4xl sm:text-5xl text-cafe-secondary">
                            Rumah Kedua untuk Produktivitas Anda
                        </h2>
                        
                        <p className="mt-6 font-poppins text-sm sm:text-base text-cafe-secondary/80 leading-relaxed">
                            Didirikan sejak tahun 2024, **Motrack Cafe** hadir bukan sekadar sebagai tempat minum kopi biasa. Kami mendedikasikan ruang ini sebagai wadah kolaborasi, produktivitas, dan istirahat yang nyaman di tengah hiruk-pikuk aktivitas perkotaan.
                        </p>
                        
                        <p className="mt-4 font-poppins text-sm sm:text-base text-cafe-secondary/80 leading-relaxed">
                            Setiap cangkir kopi yang kami sajikan dibuat oleh barista berpengalaman menggunakan biji kopi lokal Indonesia terbaik. Kami menggabungkan suasana hangat rumah dengan fasilitas modern perkantoran.
                        </p>

                        {/* Facilities Grid */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {facilities.map((fac, idx) => (
                                <div key={idx} className="flex gap-4 p-3 rounded-xl hover:bg-cafe-bg/50 transition-colors duration-200">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cafe-primary/10 text-cafe-primary">
                                        <fac.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-poppins font-bold text-sm text-cafe-secondary">{fac.title}</h3>
                                        <p className="font-poppins text-xs text-cafe-secondary/70 mt-0.5">{fac.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Opening Hours Info Box */}
                        <div className="mt-10 flex flex-col sm:flex-row gap-6 items-center p-5 rounded-2xl bg-cafe-bg border border-cafe-primary/10">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cafe-primary text-white">
                                <Clock className="h-6 w-6" />
                            </div>
                            <div className="text-center sm:text-left">
                                <h4 className="font-poppins font-bold text-sm text-cafe-secondary">Jam Operasional</h4>
                                <div className="mt-1 flex flex-col sm:flex-row sm:gap-6 text-xs text-cafe-secondary/80 font-poppins">
                                    <p><strong className="text-cafe-primary">Senin - Jumat:</strong> 09:00 - 22:00 WIB</p>
                                    <p><strong className="text-cafe-primary">Sabtu - Minggu:</strong> 08:00 - 23:00 WIB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
