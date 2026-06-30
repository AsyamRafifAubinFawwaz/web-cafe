import { Gift, Calendar, Copy, Check, MessageSquare } from 'lucide-react';
import React, { useState } from 'react';

interface PromoItem {
    id: number;
    title: string;
    code: string;
    description: string;
    discountLabel: string;
    expiryDate: string;
    color: string;
}

export default function Promo() {
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const promos: PromoItem[] = [
        {
            id: 1,
            title: 'Promo Happy Hour Espresso',
            code: 'MOTRACKHH',
            description: 'Nikmati potongan harga 20% untuk semua menu minuman berbasis kopi Espresso setiap hari Senin - Kamis mulai pukul 14:00 - 17:00 WIB.',
            discountLabel: 'DISKON 20%',
            expiryDate: 'Berlaku s/d 31 Des 2026',
            color: 'bg-cafe-primary text-white'
        },
        {
            id: 2,
            title: 'Paket Kombo WFC (Work From Cafe)',
            code: 'MOTRACKWFC',
            description: 'Dapatkan kombinasi hemat 1 porsi Nasi Goreng Kampung gurih dan 1 gelas Ice Americano segar hanya dengan Rp 40.000 nett.',
            discountLabel: 'HEMAT Rp12.000',
            expiryDate: 'Berlaku Setiap Hari',
            color: 'bg-cafe-secondary text-white'
        },
        {
            id: 3,
            title: 'Diskon Booking Paket Gathering',
            code: 'CAFEGATHER',
            description: 'Potongan harga Rp 50.000 untuk uang muka (DP) bagi Reservasi Paket Acara kelompok besar (min. 40 pax) dengan opsi Full Book.',
            discountLabel: 'POTONGAN Rp50k',
            expiryDate: 'Khusus Reservasi Acara',
            color: 'bg-cafe-primary/10 text-cafe-primary border border-cafe-primary/20'
        }
    ];

    const handleCopyCode = (code: string, id: number) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <section id="promo" className="bg-cafe-white py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto">
                    <span className="text-sm font-semibold tracking-wider text-cafe-primary uppercase">
                        Penawaran Terbatas
                    </span>
                    <h2 className="mt-2 font-chewy text-4xl sm:text-5xl text-cafe-secondary">
                        Nikmati Promo Spesial Kami
                    </h2>
                    <p className="mt-4 font-poppins text-sm sm:text-base text-cafe-secondary/70">
                        Gunakan kode promo berikut saat melakukan pemesanan meja di kasir atau menginput reservasi online untuk mendapatkan potongan harga spesial.
                    </p>
                </div>

                {/* Promo Cards Grid */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {promos.map(promo => {
                        return (
                            <div
                                key={promo.id}
                                className="group relative rounded-3xl overflow-hidden shadow-lg border border-cafe-secondary/5 hover:shadow-xl transition-all duration-300 bg-cafe-bg flex flex-col justify-between"
                            >
                                {/* Coupon Top Section */}
                                <div className={`p-6 ${promo.color} flex flex-col justify-between min-h-[140px]`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                                            <Gift className="h-5 w-5 text-white" />
                                        </div>
                                        <span className="font-chewy text-lg tracking-wide bg-white/20 px-3 py-1 rounded-full text-xs">
                                            {promo.discountLabel}
                                        </span>
                                    </div>
                                    <h3 className="mt-4 font-chewy text-xl tracking-wide leading-tight">
                                        {promo.title}
                                    </h3>
                                </div>

                                {/* Coupon Dotted Divider with Hole Punch Effect */}
                                <div className="relative h-4 bg-cafe-bg flex items-center justify-between px-4">
                                    <div className="absolute left-0 -top-2 h-4 w-4 rounded-full bg-cafe-white -ml-2" />
                                    <div className="w-full border-t-2 border-dashed border-cafe-secondary/20" />
                                    <div className="absolute right-0 -top-2 h-4 w-4 rounded-full bg-cafe-white -mr-2" />
                                </div>

                                {/* Coupon Bottom Section */}
                                <div className="p-6 flex-grow flex flex-col justify-between bg-cafe-bg">
                                    <div>
                                        <p className="font-poppins text-xs text-cafe-secondary/80 leading-relaxed min-h-[80px]">
                                            {promo.description}
                                        </p>
                                        
                                        <div className="mt-4 flex items-center gap-2 text-2xs text-cafe-secondary/60 font-poppins font-medium">
                                            <Calendar className="h-3 w-3 text-cafe-primary" />
                                            {promo.expiryDate}
                                        </div>
                                    </div>

                                    {/* Voucher Code Copy Action & CTA */}
                                    <div className="mt-6 pt-4 border-t border-cafe-secondary/5 flex flex-col gap-3">
                                        <div className="flex items-center justify-between bg-white border border-cafe-secondary/10 p-2 rounded-xl">
                                            <code className="font-mono text-xs font-bold text-cafe-secondary pl-2">
                                                {promo.code}
                                            </code>
                                            <button
                                                onClick={() => handleCopyCode(promo.code, promo.id)}
                                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-poppins text-xs font-bold transition-all ${
                                                    copiedId === promo.id
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-cafe-bg text-cafe-secondary hover:bg-cafe-secondary/5'
                                                }`}
                                            >
                                                {copiedId === promo.id ? (
                                                    <>
                                                        <Check className="h-3.5 w-3.5" />
                                                        Disalin
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-3.5 w-3.5" />
                                                        Salin
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <a
                                            href={`https://wa.me/6281234567890?text=Halo%20Admin%20Motrack%20Cafe,%20saya%20ingin%20klaim%20promo%20${encodeURIComponent(promo.title)}%20dengan%20kode%20${promo.code}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-cafe-primary font-poppins font-bold text-xs text-cafe-primary hover:bg-cafe-primary hover:text-white transition-all duration-300"
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                            Klaim via WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
