import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import About from '@/components/landing/about';
import Footer from '@/components/landing/footer';
import Gallery from '@/components/landing/gallery';
import Hero from '@/components/landing/hero';
import Menu from '@/components/landing/menu';
import Navbar from '@/components/landing/navbar';
import Promo from '@/components/landing/promo';
import Reviews from '@/components/landing/reviews';

export default function Welcome() {
    const { auth } = usePage().props as any;

    const handleScrollToSection = (sectionId: string) => {
        const element = document.querySelector(sectionId);

        if (element) {
            const offset = 80; // height of navbar
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <>
            <Head>
                <title>Motrack Cafe Solution - Tempat Terbaik untuk Kopi & Diskusi</title>
                <meta name="description" content="Selamat datang di Motrack Cafe Solution, kafe modern dengan biji kopi premium, ruang kolaborasi nyaman, and reservasi kelompok terintegrasi." />
            </Head>

            <div className="bg-cafe-bg text-cafe-secondary min-h-screen font-poppins antialiased select-none scroll-smooth">
                {/* Floating Navigation Bar */}
                <Navbar auth={auth} />

                {/* 1. Hero Section */}
                <Hero 
                    onReservasiClick={() => handleScrollToSection('#about')} 
                    onMenuClick={() => handleScrollToSection('#menu')} 
                />

                {/* 2. About Section */}
                <About />

                {/* 3. Menu Section */}
                <Menu />

                {/* 4. Promo Section */}
                <Promo />

                {/* 5. Gallery Section */}
                <Gallery />

                {/* 6. Rating & Ulasan Section */}
                <Reviews />

                {/* 7. Footer Section */}
                <Footer />
            </div>
        </>
    );
}
