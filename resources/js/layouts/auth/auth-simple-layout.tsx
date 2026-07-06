import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-cafe-bg p-4 sm:p-6 md:p-10 font-poppins">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm border border-cafe-secondary/5 p-2 overflow-hidden hover:scale-105 transition-transform duration-300">
                                <AppLogoIcon className="h-full w-full object-contain" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-1 text-center">
                            <h1 className="text-2xl md:text-3xl font-chewy text-cafe-secondary font-normal tracking-wide">{title}</h1>
                            <p className="text-center text-xs md:text-sm text-cafe-secondary/60">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
