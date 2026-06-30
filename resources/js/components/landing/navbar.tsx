import { Link } from '@inertiajs/react';
import { Menu, X, Coffee, User } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { dashboard, login } from '@/routes';

interface NavbarProps {
    auth: {
        user?: any;
    };
}

export default function Navbar({ auth }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Beranda', href: '#hero' },
        { name: 'Tentang Kami', href: '#about' },
        { name: 'Menu', href: '#menu' },
        { name: 'Promo', href: '#promo' },
        { name: 'Galeri', href: '#gallery' },
        { name: 'Ulasan', href: '#reviews' },
    ];

    const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
                behavior: 'smooth'
            });
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-poppins ${
                scrolled
                    ? 'bg-cafe-bg/95 backdrop-blur-md shadow-md border-b border-cafe-secondary/5 py-4'
                    : 'bg-transparent py-6'
            }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between">
                    {/* Brand Logo */}
                    <a href="#hero" onClick={(e) => handleScrollTo(e, '#hero')} className="flex items-center gap-2 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cafe-primary text-white transition-transform group-hover:rotate-12">
                            <Coffee className="h-5 w-5" />
                        </div>
                        <span className="font-chewy text-xl tracking-wider text-cafe-secondary group-hover:text-cafe-primary transition-colors">
                            MOTRACK
                        </span>
                    </a>

                    {/* Desktop Menu Links */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleScrollTo(e, link.href)}
                                className="text-xs font-semibold text-cafe-secondary/80 hover:text-cafe-primary transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Desktop CTA / Login link */}
                    <div className="hidden lg:flex items-center gap-4">
                        {auth?.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center gap-2 rounded-xl bg-cafe-secondary text-white px-5 py-2.5 text-xs font-bold shadow-md hover:bg-cafe-secondary/95 transition-all active:scale-95"
                            >
                                <User className="h-4 w-4" />
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="inline-flex items-center gap-2 rounded-xl bg-cafe-primary text-white px-5 py-2.5 text-xs font-bold shadow-md hover:bg-cafe-primary/95 transition-all active:scale-95"
                            >
                                Masuk / Kasir
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center lg:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-cafe-secondary hover:text-cafe-primary focus:outline-none transition-colors"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Drawer Overlay */}
            {isOpen && (
                <div className="lg:hidden bg-cafe-bg border-b border-cafe-secondary/5 py-4 px-4 shadow-lg animate-fade-in">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleScrollTo(e, link.href)}
                                className="text-sm font-semibold text-cafe-secondary/85 hover:text-cafe-primary transition-colors py-2 border-b border-cafe-secondary/5"
                            >
                                {link.name}
                            </a>
                        ))}

                        <div className="pt-2 flex flex-col gap-2">
                            {auth?.user ? (
                                <Link
                                    href={dashboard()}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-cafe-secondary text-white py-3 text-xs font-bold"
                                >
                                    <User className="h-4 w-4" />
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-cafe-primary text-white py-3 text-xs font-bold"
                                >
                                    Masuk / Kasir
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
