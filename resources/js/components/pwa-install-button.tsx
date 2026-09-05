import { router } from '@inertiajs/react';
import { Download, Share2, Smartphone, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface InstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallButton() {
    const [isInteractiveMap, setIsInteractiveMap] = useState(() => window.location.pathname === '/interactive-map');
    const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
    const [isIos, setIsIos] = useState(false);
    const [isInstalled, setIsInstalled] = useState(true);
    const [showIosHelp, setShowIosHelp] = useState(false);

    useEffect(() => {
        const standalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            ('standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
        setIsInstalled(standalone);
        setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));

        const capturePrompt = (event: Event) => {
            event.preventDefault();
            setInstallPrompt(event as InstallPromptEvent);
            setIsInstalled(false);
        };
        const installed = () => {
            setInstallPrompt(null);
            setIsInstalled(true);
        };
        window.addEventListener('beforeinstallprompt', capturePrompt);
        window.addEventListener('appinstalled', installed);
        const removeNavigateListener = router.on('navigate', (event) => {
            setIsInteractiveMap(event.detail.page.component === 'interactive-map');
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', capturePrompt);
            window.removeEventListener('appinstalled', installed);
            removeNavigateListener();
        };
    }, []);

    if (isInteractiveMap || isInstalled || (!isIos && !installPrompt)) return null;

    const install = async () => {
        if (isIos) {
            setShowIosHelp(true);

            return;
        }

        if (!installPrompt) {
            return;
        }

        await installPrompt.prompt();
        await installPrompt.userChoice;
        setInstallPrompt(null);
    };

    return (
        <>
            <button
                type="button"
                onClick={install}
                className="fixed right-4 bottom-4 z-[1900] inline-flex items-center gap-2 rounded-xl border border-orange-600 bg-white px-4 py-3 text-sm font-bold text-orange-600 shadow-xl transition hover:bg-orange-50"
            >
                <Download className="size-4" /> Install App
            </button>
            {showIosHelp && (
                <div
                    className="fixed inset-0 z-[2000] grid place-items-end bg-slate-950/50 p-4 sm:place-items-center"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Install Explore Hinoba-an"
                >
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <span className="grid size-12 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                                <Smartphone className="size-6" />
                            </span>
                            <button
                                onClick={() => setShowIosHelp(false)}
                                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                                aria-label="Close install instructions"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                        <h2 className="mt-5 text-2xl font-extrabold text-slate-900">Install Explore Hinoba-an</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">On iPhone or iPad, Safari installs this portal from the Share menu.</p>
                        <ol className="mt-5 grid gap-3 text-sm text-slate-700">
                            <li className="flex gap-3">
                                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-teal-50 font-bold text-teal-700">1</span>
                                <span>
                                    Tap the{' '}
                                    <strong className="inline-flex items-center gap-1">
                                        <Share2 className="size-4" /> Share
                                    </strong>{' '}
                                    button in Safari.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-teal-50 font-bold text-teal-700">2</span>
                                <span>
                                    Scroll down and choose <strong>Add to Home Screen</strong>.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-teal-50 font-bold text-teal-700">3</span>
                                <span>
                                    Tap <strong>Add</strong> to install the tourism portal.
                                </span>
                            </li>
                        </ol>
                        <button onClick={() => setShowIosHelp(false)} className="mt-6 w-full rounded-xl bg-orange-600 px-4 py-3 font-bold text-white">
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
