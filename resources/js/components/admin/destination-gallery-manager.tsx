import { DeleteDialog } from '@/components/admin/delete-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Images, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface DestinationImage {
    id: number;
    image_path: string;
    image_url: string;
    caption: string | null;
    sort_order: number;
    is_primary: boolean;
}

export function DestinationGalleryManager({ destinationId, initialImages }: { destinationId: number; initialImages: DestinationImage[] }) {
    const [images, setImages] = useState(initialImages);
    const [selected, setSelected] = useState<DestinationImage | null>(null);
    const [processing, setProcessing] = useState(false);
    useEffect(() => setImages(initialImages), [initialImages]);

    function move(index: number, direction: -1 | 1): void {
        const target = index + direction;
        if (target < 0 || target >= images.length) return;
        const reordered = [...images];
        [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
        setImages(reordered);
        router.put(
            route('admin.destinations.images.reorder', destinationId),
            { image_ids: reordered.map((image) => image.id) },
            {
                preserveScroll: true,
                onError: () => setImages(initialImages),
            },
        );
    }

    function remove(): void {
        if (!selected) return;
        setProcessing(true);
        router.delete(route('admin.destinations.images.destroy', [destinationId, selected.id]), {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setSelected(null);
            },
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Images className="text-emerald-700" />
                    Gallery order
                </CardTitle>
                <CardDescription>Use the arrow controls to reorder images or remove an individual image.</CardDescription>
            </CardHeader>
            <CardContent>
                {images.length ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {images.map((image, index) => (
                            <article key={image.id} className="overflow-hidden rounded-xl border">
                                <img
                                    src={image.image_url}
                                    alt={image.caption ?? `Gallery image ${index + 1}`}
                                    className="aspect-video w-full object-cover"
                                />
                                <div className="flex items-center justify-between gap-2 p-3">
                                    <span className="text-muted-foreground text-xs">Position {index + 1}</span>
                                    <div className="flex gap-1">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            disabled={index === 0}
                                            onClick={() => move(index, -1)}
                                            aria-label="Move image left"
                                        >
                                            <ArrowLeft />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            disabled={index === images.length - 1}
                                            onClick={() => move(index, 1)}
                                            aria-label="Move image right"
                                        >
                                            <ArrowRight />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="text-red-600"
                                            onClick={() => setSelected(image)}
                                            aria-label="Delete image"
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground py-8 text-center text-sm">No gallery images uploaded.</p>
                )}
            </CardContent>
            <DeleteDialog
                open={selected !== null}
                onOpenChange={(open) => !open && setSelected(null)}
                title="Delete gallery image?"
                description="This image will be permanently removed from the destination gallery."
                processing={processing}
                onDelete={remove}
            />
        </Card>
    );
}
