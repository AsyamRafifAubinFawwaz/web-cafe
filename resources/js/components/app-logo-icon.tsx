import type { HTMLAttributes } from 'react';

export default function AppLogoIcon({ className, ...props }: HTMLAttributes<HTMLImageElement>) {
    return (
        <img
            className={className}
            src="/images/logo-nugas.png"
            alt="Nugas Cafe Logo"
            {...(props as any)}
        />
    );
}
