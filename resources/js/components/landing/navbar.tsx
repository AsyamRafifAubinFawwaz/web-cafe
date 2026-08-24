import { Link } from '@inertiajs/react';
import { Menu, X, Coffee, User } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { dashboard, login } from '@/routes';

interface NavbarProps {
    auth: {
        user?: any;
    };
    alwaysScrolled?: boolean;
}

export default function Navbar({ auth, alwaysScrolled = false }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(alwaysScrolled);

    useEffect(() => {
        if (alwaysScrolled) return;

        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [alwaysScrolled]);

    const navLinks = [
        { name: 'Beranda', href: '#hero' },
        { name: 'Tentang Kami', href: '#about' },
        { name: 'Menu', href: '#menu' },
        { name: 'Promo', href: '#promo' },
        { name: 'Galeri', href: '#gallery' },
        { name: 'Ulasan', href: '#reviews' },
    ];

    const handleScrollTo = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string,
    ) => {
        e.preventDefault();
        setIsOpen(false);
        const element = document.querySelector(href);

        if (element) {
            const offset = 80; // height of navbar
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    return (
        <header
            className={`fixed top-0 right-0 left-0 z-40 font-poppins transition-all duration-300 ${
                scrolled || isOpen
                    ? 'bg-cafe-bg/95 py-1 shadow-md backdrop-blur-md'
                    : 'bg-transparent py-2'
            }`}
        >
            <div className="max-w-screen px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between">
                    <a
                        href="#hero"
                        onClick={(e) => handleScrollTo(e, '#hero')}
                        className="group flex items-center gap-2"
                    >
                        <img
                            className="h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18"
                            src="/images/logo-nugas.png"
                            alt=""
                        />
                    </a>

                    {/* Desktop Menu Links */}
                    <div className="hidden items-center gap-8 lg:flex">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleScrollTo(e, link.href)}
                                className={`text-sm font-semibold transition-colors duration-300 ${
                                    scrolled
                                        ? 'text-gray-700 hover:text-cafe-primary'
                                        : 'text-cafe-yellow hover:text-white'
                                }`}
                            >
                                {link.name}
                            </a>
                        ))}
                        {/* Desktop CTA / Login link */}
                        <div className="hidden items-center gap-4 lg:flex">
                            {auth?.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 rounded-xl bg-cafe-secondary px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-cafe-secondary/95 active:scale-95"
                                >
                                    <User className="h-4 w-4" />
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-md transition-all active:scale-95 ${scrolled ? 'bg-cafe-primary text-cafe-white hover:bg-cafe-primary/95' : 'bg-cafe-white text-cafe-primary hover:bg-cafe-white/95'}`}
                                >
                                    Masuk
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center lg:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`transition-colors hover:text-cafe-secondary/70 focus:outline-none ${scrolled || isOpen ? 'text-cafe-secondary' : 'text-cafe-white'}`}
                        >
                            {isOpen ? (
                                <X className="h-8 w-8 md:h-10 md:w-10" />
                            ) : (
                                <Menu className="h-8 w-8 md:h-10 md:w-10" />
                            )}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Drawer Overlay */}
            {isOpen && (
                <div className="animate-fade-in border-b border-cafe-secondary/5 bg-cafe-bg px-4 py-4 shadow-lg lg:hidden">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleScrollTo(e, link.href)}
                                className="border-b border-cafe-secondary/5 py-2 text-sm font-semibold text-cafe-secondary/85 transition-colors hover:text-cafe-primary"
                            >
                                {link.name}
                            </a>
                        ))}

                        <div className="flex flex-col gap-2 pt-2">
                            {auth?.user ? (
                                <Link
                                    href={dashboard()}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-cafe-secondary py-3 text-xs font-bold text-white"
                                >
                                    <User className="h-4 w-4" />
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-cafe-primary py-3 text-xs font-bold text-white"
                                >
                                    Masuk
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
