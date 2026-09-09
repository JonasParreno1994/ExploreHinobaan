@php
    $microsite = data_get($page, 'props.enterprise.microsite');
    $enterpriseName = data_get($page, 'props.enterprise.business_name');
    $metaTitle = data_get($microsite, 'social_title') ?: data_get($microsite, 'seo_title') ?: $enterpriseName ?: data_get($page, 'props.branding.site_name', 'Explore Hinoba-an Tourism Portal');
    $metaDescription = data_get($microsite, 'social_description') ?: data_get($microsite, 'seo_description') ?: data_get($microsite, 'tagline') ?: data_get($page, 'props.branding.tagline', 'Discover destinations and tourism experiences in Hinoba-an.');
    $metaImage = data_get($microsite, 'social_image_url') ?: data_get($microsite, 'cover_image_url') ?: data_get($page, 'props.branding.social_image_url') ?: asset('app-icon.svg');
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <meta name="description" content="{{ $metaDescription }}">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="{{ data_get($page, 'props.branding.site_name', 'Explore Hinoba-an') }}">
        <meta property="og:title" content="{{ $metaTitle }}">
        <meta property="og:description" content="{{ $metaDescription }}">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:image" content="{{ url($metaImage) }}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $metaTitle }}">
        <meta name="twitter:description" content="{{ $metaDescription }}">
        <meta name="twitter:image" content="{{ url($metaImage) }}">
        <link id="site-favicon" rel="icon" href="{{ data_get($page, 'props.branding.logo_url') ?: asset('favicon.ico') }}">
        <link rel="manifest" href="{{ route('webapp.manifest') }}">
        <link rel="apple-touch-icon" href="{{ data_get($page, 'props.branding.webapp_logo_url') ?: asset('icons/apple-touch-icon.png') }}">
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
