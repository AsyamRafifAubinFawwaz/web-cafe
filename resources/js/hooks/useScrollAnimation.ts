import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollAnimationOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

/**
 * Custom hook untuk mendeteksi elemen masuk viewport saat scroll
 * dan men-trigger animasi CSS.
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
    options: ScrollAnimationOptions = {}
) {
    const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', triggerOnce = true } = options;
    const ref = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [threshold, rootMargin, triggerOnce]);

    return { ref, isVisible };
}

/**
 * Hook untuk stagger animation — memberikan delay bertahap
 * pada sekelompok elemen (misalnya card list).
 */
export function useStaggerAnimation(
    itemCount: number,
    baseDelay: number = 100
) {
    const getDelay = useCallback(
        (index: number) => `${index * baseDelay}ms`,
        [baseDelay]
    );

    return { getDelay };
}
