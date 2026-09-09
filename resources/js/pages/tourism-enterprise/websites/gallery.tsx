import { ImageUploader } from '@/components/admin/image-uploader';
import { EnterpriseWebsite, WebsiteEnterprise, WebsiteShell } from '@/components/tourism-enterprise/website-shell';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Image as ImageIcon, Star } from 'lucide-react';
import { FormEvent } from 'react';

interface GalleryImage {
    id: number;
    image_url: string;
    caption: string | null;
    is_featured: boolean;
}

export default function Gallery({ enterprise, images }: { enterprise: WebsiteEnterprise; website: EnterpriseWebsite; images: GalleryImage[] }) {
    const form = useForm<{ image: File | null; caption: string }>({ image: null, caption: '' });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(route('partner.websites.gallery.store', enterprise.id), { forceFormData: true, onSuccess: () => form.reset() });
    };
    const move = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= images.length) return;
        const ordered = images.map((image) => image.id);
        [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
        router.patch(route('partner.websites.gallery.reorder', enterprise.id), { images: ordered }, { preserveScroll: true });
    };
    return (
        <WebsiteShell enterprise={enterprise}>
            <Head title="Website Gallery" />
            <div>
                <p className="text-xs font-bold tracking-widest text-orange-600 uppercase">Website content</p>
                <h1 className="mt-2 text-3xl font-extrabold">Gallery</h1>
            </div>
            <form onSubmit={submit} className="mt-6 grid gap-4 rounded-3xl border border-orange-100 bg-white p-6">
                <ImageUploader
                    files={form.data.image ? [form.data.image] : []}
                    onChange={(files) => form.setData('image', files[0] ?? null)}
                    multiple={false}
                    maxFiles={1}
                    maxSizeMb={5}
                    error={form.errors.image}
                />
                <input
                    value={form.data.caption}
                    onChange={(e) => form.setData('caption', e.target.value)}
                    placeholder="Optional photo caption"
                    className="h-11 rounded-xl border px-3"
                />
                <button
                    disabled={form.processing || !form.data.image}
                    className="w-fit rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white"
                >
                    Add gallery image
                </button>
            </form>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
                {images.map((image) => (
                    <figure key={image.id} className="relative overflow-hidden rounded-2xl border bg-white">
                        <img src={image.image_url} alt={image.caption ?? ''} className="aspect-square w-full object-cover" />
                        {image.is_featured && <span className="absolute m-3 rounded-full bg-amber-300 px-3 py-1 text-xs font-bold">Featured</span>}
                        <figcaption className="flex items-center justify-between gap-2 p-3 text-xs">
                            <span className="truncate">{image.caption || 'No caption'}</span>
                            <button
                                type="button"
                                onClick={() => router.delete(route('partner.websites.gallery.destroy', [enterprise.id, image.id]))}
                                className="font-bold text-red-600"
                            >
                                Remove
                            </button>
                        </figcaption>
                        <div className="flex flex-wrap gap-1 border-t p-2">
                            <button type="button" onClick={() => move(images.indexOf(image), -1)} className="rounded-lg border p-2" aria-label="Move image up"><ArrowUp className="size-3" /></button>
                            <button type="button" onClick={() => move(images.indexOf(image), 1)} className="rounded-lg border p-2" aria-label="Move image down"><ArrowDown className="size-3" /></button>
                            <button type="button" onClick={() => router.patch(route('partner.websites.gallery.feature', [enterprise.id, image.id]))} className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 font-bold"><Star className="size-3" /> Featured</button>
                            <button type="button" onClick={() => router.patch(route('partner.websites.gallery.cover', [enterprise.id, image.id]))} className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 font-bold"><ImageIcon className="size-3" /> Cover</button>
                        </div>
                    </figure>
                ))}
            </div>
        </WebsiteShell>
    );
}
