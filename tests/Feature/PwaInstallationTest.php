<?php

test('the public portal exposes installable application metadata', function () {
    $this->get(route('home'))
        ->assertSuccessful()
        ->assertSee('manifest.webmanifest', false)
        ->assertSee('apple-mobile-web-app-capable', false)
        ->assertSee('#F97316', false);

    expect(public_path('manifest.webmanifest'))->toBeFile()
        ->and(public_path('service-worker.js'))->toBeFile()
        ->and(public_path('offline.html'))->toBeFile()
        ->and(public_path('icons/icon-192.png'))->toBeFile()
        ->and(public_path('icons/icon-512.png'))->toBeFile()
        ->and(public_path('icons/icon-maskable-192.png'))->toBeFile()
        ->and(public_path('icons/icon-maskable-512.png'))->toBeFile()
        ->and(public_path('icons/apple-touch-icon.png'))->toBeFile();

    $manifest = json_decode(file_get_contents(public_path('manifest.webmanifest')), true, flags: JSON_THROW_ON_ERROR);

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
        ->and($installButton)
        ->toContain("router.on('navigate'")
        ->toContain("event.detail.page.component === 'interactive-map'")
        ->toContain('if (isInteractiveMap ||')
        ->not->toContain('usePage')
        ->toContain('await installPrompt.prompt();')
        ->toContain('setShowIosHelp(true);');
});
