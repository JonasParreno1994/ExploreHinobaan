<?php

test('the public portal exposes installable application metadata', function () {
    $this->get(route('home'))
        ->assertSuccessful()
        ->assertSee('manifest.webmanifest', false)
        ->assertSee('apple-mobile-web-app-capable', false)
        ->assertSee('#F97316', false);

    expect(public_path('manifest.webmanifest'))->toBeFile()
        ->and(public_path('service-worker.js'))->toBeFile()
        ->and(public_path('app-icon.svg'))->toBeFile();

    $manifest = json_decode(file_get_contents(public_path('manifest.webmanifest')), true, flags: JSON_THROW_ON_ERROR);

    expect($manifest)
        ->toMatchArray([
            'name' => 'Explore Hinoba-an Tourism Portal',
            'start_url' => '/',
            'display' => 'standalone',
            'theme_color' => '#F97316',
        ])
        ->and($manifest['icons'])->not->toBeEmpty();
});

test('the application service worker provides safe same-origin asset caching', function () {
    $serviceWorker = file_get_contents(public_path('service-worker.js'));

    expect($serviceWorker)
        ->toContain("request.method !== 'GET'")
        ->toContain('self.location.origin')
        ->toContain("request.mode === 'navigate'");
});
