<?php

test('the public portal exposes installable application metadata', function () {
    $this->get(route('home'))
        ->assertSuccessful()
        ->assertSee('manifest.webmanifest', false)
        ->assertSee('apple-mobile-web-app-capable', false)
        ->assertSee('#F97316', false);

    expect(public_path('service-worker.js'))->toBeFile()
        ->and(public_path('offline.html'))->toBeFile()
        ->and(public_path('icons/icon-192.png'))->toBeFile()
        ->and(public_path('icons/icon-512.png'))->toBeFile()
        ->and(public_path('icons/icon-maskable-192.png'))->toBeFile()
        ->and(public_path('icons/icon-maskable-512.png'))->toBeFile()
        ->and(public_path('icons/apple-touch-icon.png'))->toBeFile();

    expect(getimagesize(public_path('icons/icon-192.png')))
        ->toMatchArray([192, 192])
        ->and(getimagesize(public_path('icons/icon-512.png')))->toMatchArray([512, 512])
        ->and(getimagesize(public_path('icons/icon-maskable-192.png')))->toMatchArray([192, 192])
        ->and(getimagesize(public_path('icons/icon-maskable-512.png')))->toMatchArray([512, 512])
        ->and(getimagesize(public_path('icons/apple-touch-icon.png')))->toMatchArray([180, 180]);

    $manifest = $this->get(route('webapp.manifest'))
        ->assertSuccessful()
        ->assertHeader('Content-Type', 'application/manifest+json')
        ->json();

    expect($manifest)
        ->toMatchArray([
            'name' => 'Explore Hinoba-an Tourism Portal',
            'id' => '/',
            'start_url' => '/',
            'display' => 'standalone',
            'theme_color' => '#F97316',
        ])
        ->and($manifest['icons'])->toHaveCount(4)
        ->and(collect($manifest['icons'])->pluck('sizes')->all())->toBe(['192x192', '512x512', '192x192', '512x512'])
        ->and(collect($manifest['icons'])->pluck('purpose')->all())->toBe(['any', 'any', 'maskable', 'maskable']);
});

test('the application service worker provides safe same-origin asset caching', function () {
    $serviceWorker = file_get_contents(public_path('service-worker.js'));

    expect($serviceWorker)
        ->toContain("const CACHE_NAME = 'explore-hinobaan-v3'")
        ->toContain("request.method !== 'GET'")
        ->toContain('self.location.origin')
        ->toContain("request.mode === 'navigate'")
        ->toContain("const OFFLINE_URL = '/offline.html'")
        ->not->toContain("const APP_SHELL = ['/'");
});

test('the install action is mounted across application pages and only appears when installation is available', function () {
    $application = file_get_contents(resource_path('js/app.tsx'));
    $installButton = file_get_contents(resource_path('js/components/pwa-install-button.tsx'));

    expect($application)
        ->toContain('<PwaInstallButton />')
        ->toContain('event.detail?.page?.props?.branding')
        ->and($installButton)
        ->toContain("router.on('navigate'")
        ->toContain('event.detail?.page?.component')
        ->toContain("setIsInteractiveMap(component === 'interactive-map')")
        ->not->toContain('event.detail.page')
        ->toContain('if (isInteractiveMap ||')
        ->not->toContain('usePage')
        ->toContain('await installPrompt.prompt();')
        ->toContain('setShowIosHelp(true);');
});
