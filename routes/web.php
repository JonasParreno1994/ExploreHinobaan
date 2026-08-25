<?php

use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\BannerTextController;
use App\Http\Controllers\Admin\BarangayController;
use App\Http\Controllers\Admin\DestinationController;
use App\Http\Controllers\Admin\EnterpriseController;
use App\Http\Controllers\Admin\EnterpriseTypeController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\FooterSettingController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\HeaderSettingController;
use App\Http\Controllers\Admin\LguInformationController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\TourismCategoryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DestinationController as PublicDestinationController;
use App\Http\Controllers\EnterpriseController as PublicEnterpriseController;
use App\Http\Controllers\EnterpriseServiceController as PublicEnterpriseServiceController;
use App\Http\Controllers\InteractiveMapController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\ReservationController as PublicReservationController;
use App\Http\Controllers\TourismEnterprise\AuthenticatedSessionController as PartnerSessionController;
use App\Http\Controllers\TourismEnterprise\DashboardController as PartnerDashboardController;
use App\Http\Controllers\TourismEnterprise\EnterpriseDocumentController as PartnerDocumentController;
use App\Http\Controllers\TourismEnterprise\EnterpriseProfileController as PartnerEnterpriseController;
use App\Http\Controllers\TourismEnterprise\EnterpriseServiceController as PartnerServiceController;
use App\Http\Controllers\TourismEnterprise\RegisteredEnterpriseController;
use App\Http\Controllers\TourismEnterprise\ReservationController as PartnerReservationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', LandingPageController::class)->name('home');
Route::get('interactive-map', InteractiveMapController::class)->name('interactive-map');

Route::middleware('guest')->prefix('tourism-enterprise')->name('partner.')->group(function () {
    Route::get('login', [PartnerSessionController::class, 'create'])->name('login');
    Route::post('login', [PartnerSessionController::class, 'store'])->name('login.store');
    Route::get('register', [RegisteredEnterpriseController::class, 'create'])->name('register');
    Route::post('register', [RegisteredEnterpriseController::class, 'store'])->name('register.store');
});

Route::middleware(['auth', 'role:Tourism Enterprise'])->prefix('tourism-enterprise')->name('partner.')->group(function () {
    Route::get('dashboard', PartnerDashboardController::class)->name('dashboard');
    Route::get('enterprises', [PartnerEnterpriseController::class, 'index'])->name('enterprises.index');
    Route::get('documents', [PartnerDocumentController::class, 'index'])->name('documents.index');
    Route::patch('services/{enterpriseService}/archive', [PartnerServiceController::class, 'archive'])->name('services.archive');
    Route::resource('services', PartnerServiceController::class)->except(['show', 'destroy'])->parameters(['services' => 'enterpriseService']);
    Route::get('reservations', [PartnerReservationController::class, 'index'])->name('reservations.index');
    Route::get('reservations/{reservation}', [PartnerReservationController::class, 'show'])->name('reservations.show');
    Route::patch('reservations/{reservation}/status', [PartnerReservationController::class, 'updateStatus'])->name('reservations.status');
});
Route::get('destinations/{destination:slug}', [PublicDestinationController::class, 'show'])->name('destinations.show');
Route::get('enterprises', [PublicEnterpriseController::class, 'index'])->name('enterprises.index');
Route::get('enterprises/{enterprise:slug}', [PublicEnterpriseController::class, 'show'])->name('enterprises.show');
Route::get('enterprises/{enterprise:slug}/services/{service:slug}', [PublicEnterpriseServiceController::class, 'show'])->scopeBindings()->name('enterprises.services.show');
Route::post('reservations', [PublicReservationController::class, 'store'])->middleware('throttle:10,1')->name('reservations.store');
Route::get('reservations/success/{reservationNumber}', [PublicReservationController::class, 'success'])->name('reservations.success');

Route::middleware(['auth', 'role:Administrator,Tourism Staff'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('admin/users', UserController::class)->names('admin.users');
    Route::resource('admin/roles', RoleController::class)->only(['index', 'store', 'destroy'])->names('admin.roles');
    Route::get('admin/audit-logs', AuditLogController::class)->name('admin.audit-logs.index');
    Route::patch('admin/barangays/{barangay}/activate', [BarangayController::class, 'activate'])->name('admin.barangays.activate');
    Route::patch('admin/barangays/{barangay}/deactivate', [BarangayController::class, 'deactivate'])->name('admin.barangays.deactivate');
    Route::resource('admin/barangays', BarangayController::class)->except('destroy')->names('admin.barangays');
    Route::resource('admin/lgu-information', LguInformationController::class)->except('destroy')->names('admin.lgu-information');
    Route::resource('admin/banners', BannerController::class)->names('admin.banners');
    Route::get('admin/text', [BannerTextController::class, 'index'])->name('admin.text.index');
    Route::get('admin/text/{banner}/edit', [BannerTextController::class, 'edit'])->name('admin.text.edit');
    Route::put('admin/text/{banner}', [BannerTextController::class, 'update'])->name('admin.text.update');
    Route::resource('admin/gallery', GalleryController::class)->names('admin.gallery');
    Route::resource('admin/footer-settings', FooterSettingController::class)->names('admin.footer-settings');
    Route::get('admin/settings', SettingsController::class)->name('admin.settings');
    Route::get('admin/header-settings/create', [HeaderSettingController::class, 'create'])->name('admin.header-settings.create');
    Route::post('admin/header-settings', [HeaderSettingController::class, 'store'])->name('admin.header-settings.store');
    Route::get('admin/header-settings/{headerSetting}/edit', [HeaderSettingController::class, 'edit'])->name('admin.header-settings.edit');
    Route::put('admin/header-settings/{headerSetting}', [HeaderSettingController::class, 'update'])->name('admin.header-settings.update');
    Route::resource('admin/announcements', AnnouncementController::class)->names('admin.announcements');
    Route::patch('admin/categories/{category}/activate', [TourismCategoryController::class, 'activate'])->name('admin.categories.activate');
    Route::patch('admin/categories/{category}/deactivate', [TourismCategoryController::class, 'deactivate'])->name('admin.categories.deactivate');
    Route::resource('admin/categories', TourismCategoryController::class)->except(['show', 'destroy'])->names('admin.categories');
    Route::patch('admin/destinations/{destination}/publish', [DestinationController::class, 'publish'])->name('admin.destinations.publish');
    Route::patch('admin/destinations/{destination}/unpublish', [DestinationController::class, 'unpublish'])->name('admin.destinations.unpublish');
    Route::patch('admin/destinations/{destination}/archive', [DestinationController::class, 'archive'])->name('admin.destinations.archive');
    Route::patch('admin/destinations/{destination}/toggle-featured', [DestinationController::class, 'toggleFeatured'])->name('admin.destinations.toggle-featured');
    Route::delete('admin/destinations/{destination}/images/{image}', [DestinationController::class, 'destroyImage'])->name('admin.destinations.images.destroy');
    Route::put('admin/destinations/{destination}/images/reorder', [DestinationController::class, 'reorderImages'])->name('admin.destinations.images.reorder');
    Route::resource('admin/destinations', DestinationController::class)->except('destroy')->names('admin.destinations');
    Route::patch('admin/events/{event}/publish', [EventController::class, 'publish'])->name('admin.events.publish');
    Route::patch('admin/events/{event}/archive', [EventController::class, 'archive'])->name('admin.events.archive');
    Route::patch('admin/events/{event}/toggle-featured', [EventController::class, 'toggleFeatured'])->name('admin.events.toggle-featured');
    Route::resource('admin/events', EventController::class)->names('admin.events');
    Route::patch('admin/enterprises/{enterprise}/approve', [EnterpriseController::class, 'approve'])->name('admin.enterprises.approve');
    Route::patch('admin/enterprises/{enterprise}/reject', [EnterpriseController::class, 'reject'])->name('admin.enterprises.reject');
    Route::patch('admin/enterprises/{enterprise}/suspend', [EnterpriseController::class, 'suspend'])->name('admin.enterprises.suspend');
    Route::patch('admin/enterprises/{enterprise}/reactivate', [EnterpriseController::class, 'reactivate'])->name('admin.enterprises.reactivate');
    Route::patch('admin/enterprises/{enterprise}/documents/{document}/verify', [EnterpriseController::class, 'verifyDocument'])->name('admin.enterprises.documents.verify');
    Route::resource('admin/enterprises', EnterpriseController::class)->only(['index', 'show'])->names('admin.enterprises');
    Route::patch('admin/enterprise-types/{enterprise_type}/activate', [EnterpriseTypeController::class, 'activate'])->name('admin.enterprise-types.activate');
    Route::patch('admin/enterprise-types/{enterprise_type}/deactivate', [EnterpriseTypeController::class, 'deactivate'])->name('admin.enterprise-types.deactivate');
    Route::resource('admin/enterprise-types', EnterpriseTypeController::class)->except(['show', 'destroy'])->names('admin.enterprise-types');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
