import { EnterpriseMicrositeData } from '@/components/enterprise-microsite/types';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function EnterpriseGallery({ enterprise }: { enterprise: EnterpriseMicrositeData }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const images = enterprise.gallery_images;
    useEffect(() => {
        if (activeIndex === null) return;
        const close = (event: KeyboardEvent) => event.key === 'Escape' && setActiveIndex(null);
        document.addEventListener('keydown', close);
        return () => document.removeEventListener('keydown', close);
    }, [activeIndex]);
    if (images.length === 0) return null;
    const move = (offset: number) => setActiveIndex((current) => (current === null ? null : (current + offset + images.length) % images.length));
    return (
        <section id="gallery" className="scroll-mt-24 py-20 sm:py-24">
            <SectionHeading eyebrow="A closer look" title="Gallery" description="Explore the place, people, and experiences waiting for you." />
            <div className="mt-9 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] md:grid-cols-4">
                {images.map((image, index) => (
                    <button
                        key={image.id}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`group relative overflow-hidden rounded-2xl bg-slate-200 ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
                    >
                        <img
                            src={image.image_url}
                            loading={index === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                            alt={image.caption ?? `${enterprise.business_name} gallery image`}
                            className="size-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-10 pb-3 text-left text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                            {image.caption}
                        </span>
                    </button>
                ))}
            </div>
            {activeIndex !== null && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Gallery viewer"
                    onClick={() => setActiveIndex(null)}
                >
                    <button
                        type="button"
                        aria-label="Close gallery"
                        onClick={() => setActiveIndex(null)}
                        className="absolute top-5 right-5 rounded-full bg-white/10 p-3 text-white"
                    >
                        <X />
                    </button>
                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                aria-label="Previous image"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    move(-1);
                                }}
                                className="absolute left-3 rounded-full bg-white/10 p-3 text-white sm:left-8"
                            >
                                <ChevronLeft />
                            </button>
                            <button
                                type="button"
                                aria-label="Next image"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    move(1);
                                }}
                                className="absolute right-3 rounded-full bg-white/10 p-3 text-white sm:right-8"
                            >
                                <ChevronRight />
                            </button>
                        </>
                    )}
                    <figure className="max-h-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
                        <img
                            src={images[activeIndex].image_url}
                            alt={images[activeIndex].caption ?? enterprise.business_name}
                            className="max-h-[82vh] max-w-full rounded-2xl object-contain"
                        />
                        {images[activeIndex].caption && (
                            <figcaption className="mt-3 text-center text-sm text-white/80">{images[activeIndex].caption}</figcaption>
                        )}
                    </figure>
                </div>
            )}
        </section>
    );
}

export function SectionHeading({
    eyebrow,
    title,
    description,
    inverted = false,
}: {
    eyebrow: string;
    title: string;
    description?: string;
    inverted?: boolean;
}) {
    return (
        <div className="max-w-2xl">
            <p className="text-xs font-black tracking-[.2em] text-[var(--microsite-secondary)] uppercase">{eyebrow}</p>
            <h2 className={`mt-3 text-3xl font-black tracking-tight sm:text-5xl ${inverted ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
            {description && <p className={`mt-4 leading-7 ${inverted ? 'text-white/70' : 'text-slate-600'}`}>{description}</p>}
        </div>
    );
}
