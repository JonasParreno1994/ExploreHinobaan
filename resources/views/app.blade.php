<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <meta name="description" content="{{ data_get($page, 'props.branding.tagline', 'Discover destinations and tourism experiences in Hinoba-an.') }}">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="{{ data_get($page, 'props.branding.site_name', 'Explore Hinoba-an') }}">
        <meta property="og:title" content="{{ data_get($page, 'props.branding.site_name', 'Explore Hinoba-an Tourism Portal') }}">
        <meta property="og:description" content="{{ data_get($page, 'props.branding.tagline', 'Discover destinations and tourism experiences in Hinoba-an.') }}">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:image" content="{{ url(data_get($page, 'props.branding.social_image_url') ?: asset('app-icon.svg')) }}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ data_get($page, 'props.branding.site_name', 'Explore Hinoba-an Tourism Portal') }}">
        <meta name="twitter:description" content="{{ data_get($page, 'props.branding.tagline', 'Discover destinations and tourism experiences in Hinoba-an.') }}">
        <meta name="twitter:image" content="{{ url(data_get($page, 'props.branding.social_image_url') ?: asset('app-icon.svg')) }}">
        <link id="site-favicon" rel="icon" href="{{ data_get($page, 'props.branding.logo_url') ?: asset('favicon.ico') }}">
        <link rel="manifest" href="{{ asset('manifest.webmanifest') }}">
        <link rel="apple-touch-icon" href="{{ asset('icons/apple-touch-icon.png') }}">
        <meta name="theme-color" content="#F97316">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="apple-mobile-web-app-title" content="Explore Hinoba-an">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
