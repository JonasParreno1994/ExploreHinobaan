<?php

use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\BannerTextController;
use App\Http\Controllers\Admin\BarangayController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DestinationController;
use App\Http\Controllers\Admin\EnterpriseController;
use App\Http\Controllers\Admin\EnterpriseTypeController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\FooterSettingController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\HeaderSettingController;
use App\Http\Controllers\Admin\LguInformationController;
use App\Http\Controllers\Admin\LocalProductController as AdminLocalProductController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SecurityIncidentController;
use App\Http\Controllers\Admin\SecurityMonitoringController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\TourismCategoryController;
use App\Http\Controllers\Admin\TouristArrivalController as AdminTouristArrivalController;
use App\Http\Controllers\Admin\TouristController as AdminTouristController;
use App\Http\Controllers\Admin\TouristVerificationController as AdminTouristVerificationController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\WhyVisitSectionController;
use App\Http\Controllers\DestinationController as PublicDestinationController;
use App\Http\Controllers\EnterpriseController as PublicEnterpriseController;
use App\Http\Controllers\EnterpriseServiceController as PublicEnterpriseServiceController;
use App\Http\Controllers\InteractiveMapController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\LocalProductController as PublicLocalProductController;
use App\Http\Controllers\LocalProductOrderController as PublicLocalProductOrderController;
use App\Http\Controllers\ReservationController as PublicReservationController;
use App\Http\Controllers\ReservationStatusController;
use App\Http\Controllers\ReviewController as PublicReviewController;
use App\Http\Controllers\TourismEnterprise\AuthenticatedSessionController as PartnerSessionController;
use App\Http\Controllers\TourismEnterprise\DailyTouristReportController as PartnerDailyTouristReportController;
use App\Http\Controllers\TourismEnterprise\DashboardController as PartnerDashboardController;
use App\Http\Controllers\TourismEnterprise\EnterpriseDocumentController as PartnerDocumentController;
use App\Http\Controllers\TourismEnterprise\EnterpriseProfileController as PartnerEnterpriseController;
use App\Http\Controllers\TourismEnterprise\EnterpriseServiceController as PartnerServiceController;
use App\Http\Controllers\TourismEnterprise\LocalProductController as PartnerLocalProductController;
use App\Http\Controllers\TourismEnterprise\LocalProductOrderController as PartnerLocalProductOrderController;
use App\Http\Controllers\TourismEnterprise\NotificationController as PartnerNotificationController;
use App\Http\Controllers\TourismEnterprise\RegisteredEnterpriseController;
use App\Http\Controllers\TourismEnterprise\ReservationController as PartnerReservationController;
use App\Http\Controllers\TourismEnterprise\TouristArrivalController as PartnerTouristArrivalController;
use App\Http\Controllers\Tourist\AccountController as TouristAccountController;
use App\Http\Controllers\Tourist\AuthenticatedSessionController as TouristSessionController;
use App\Http\Controllers\Tourist\NotificationController as TouristNotificationController;
use App\Http\Controllers\Tourist\RegisteredTouristController;
use App\Http\Controllers\Tourist\VerificationController as TouristVerificationController;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingPageController::class)->name('home');
Route::get('interactive-map', InteractiveMapController::class)->name('interactive-map');

Route::middleware('guest')->prefix('tourist')->name('tourist.')->group(function () {
    Route::get('login', [TouristSessionController::class, 'create'])->name('login');
    Route::post('login', [TouristSessionController::class, 'store'])->middleware('throttle:5,1')->name('login.store');
    Route::get('register', [RegisteredTouristController::class, 'create'])->name('register');
    Route::post('register', [RegisteredTouristController::class, 'store'])->middleware('throttle:5,1')->name('register.store');
});

Route::middleware(['auth', 'role:Tourist'])->prefix('tourist')->name('tourist.')->group(function () {
    Route::get('dashboard', [TouristAccountController::class, 'dashboard'])->name('dashboard');
    Route::get('reservations', [TouristAccountController::class, 'reservations'])->name('reservations.index');
    Route::get('reservations/{reservation}', [TouristAccountController::class, 'reservation'])->name('reservations.show');
    Route::get('profile', [TouristAccountController::class, 'profile'])->name('profile');
    Route::get('notifications', [TouristNotificationController::class, 'index'])->name('notifications.index');
    Route::patch('notifications/read-all', [TouristNotificationController::class, 'readAll'])->name('notifications.read-all');
    Route::patch('notifications/{notification}/read', [TouristNotificationController::class, 'read'])->name('notifications.read');
    Route::get('verification', [TouristVerificationController::class, 'show'])->name('verification.show');
    Route::post('verification', [TouristVerificationController::class, 'store'])->middleware(['verified', 'throttle:3,60'])->name('verification.store');
});

Route::prefix('tourism-enterprise')->name('partner.')->group(function () {
    Route::get('login', [PartnerSessionController::class, 'create'])->name('login');
    Route::post('login', [PartnerSessionController::class, 'store'])->name('login.store');
    Route::get('register', [RegisteredEnterpriseController::class, 'create'])->name('register');
    Route::post('register', [RegisteredEnterpriseController::class, 'store'])->name('register.store');
});

Route::middleware(['auth', 'role:Tourism Enterprise'])->prefix('tourism-enterprise')->name('partner.')->group(function () {
    Route::get('dashboard', PartnerDashboardController::class)->name('dashboard');
    Route::get('enterprises', [PartnerEnterpriseController::class, 'index'])->name('enterprises.index');
    Route::post('enterprises/{enterprise}/payment-settings', [PartnerEnterpriseController::class, 'updatePaymentSettings'])->name('enterprises.payment-settings');
    Route::post('enterprises/{enterprise}/commerce-settings', [PartnerEnterpriseController::class, 'updateCommerceSettings'])->name('enterprises.commerce-settings');
    Route::get('documents', [PartnerDocumentController::class, 'index'])->name('documents.index');
    Route::patch('services/{enterpriseService}/archive', [PartnerServiceController::class, 'archive'])->name('services.archive');
    Route::resource('services', PartnerServiceController::class)->except(['show', 'destroy'])->parameters(['services' => 'enterpriseService']);
    Route::get('reservations', [PartnerReservationController::class, 'index'])->name('reservations.index');
    Route::get('reservations/{reservation}', [PartnerReservationController::class, 'show'])->name('reservations.show');
    Route::patch('reservations/{reservation}/status', [PartnerReservationController::class, 'updateStatus'])->name('reservations.status');
    Route::patch('reservations/{reservation}/payment', [PartnerReservationController::class, 'verifyPayment'])->name('reservations.payment');
    Route::middleware('arrival-reporting')->group(function () {
        Route::get('tourist-arrivals', [PartnerTouristArrivalController::class, 'index'])->name('tourist-arrivals.index');
        Route::get('tourist-arrivals/create', [PartnerTouristArrivalController::class, 'create'])->name('tourist-arrivals.create');
        Route::post('tourist-arrivals', [PartnerTouristArrivalController::class, 'store'])->name('tourist-arrivals.store');
        Route::get('daily-tourist-reports', [PartnerDailyTouristReportController::class, 'index'])->name('daily-reports.index');
        Route::post('daily-tourist-reports', [PartnerDailyTouristReportController::class, 'store'])->name('daily-reports.store');
    });
    Route::middleware('local-product-seller')->group(function () {
        Route::resource('products', PartnerLocalProductController::class)->except('show');
        Route::get('product-orders', [PartnerLocalProductOrderController::class, 'index'])->name('product-orders.index');
        Route::get('product-orders/{order}', [PartnerLocalProductOrderController::class, 'show'])->name('product-orders.show');
        Route::patch('product-orders/{order}', [PartnerLocalProductOrderController::class, 'update'])->name('product-orders.update');
    });
    Route::patch('notifications/read-all', [PartnerNotificationController::class, 'readAll'])->name('notifications.read-all');
    Route::patch('notifications/{notification}/read', [PartnerNotificationController::class, 'read'])->name('notifications.read');
});
Route::get('local-products', [PublicLocalProductController::class, 'index'])->name('local-products.index');
Route::get('local-products/{product:slug}', [PublicLocalProductController::class, 'show'])->name('local-products.show');
Route::post('local-product-orders', [PublicLocalProductOrderController::class, 'store'])->middleware('throttle:10,1')->name('local-product-orders.store');
Route::get('local-product-orders/success/{orderNumber}', [PublicLocalProductOrderController::class, 'success'])->name('local-product-orders.success');
Route::get('destinations/{destination:slug}', [PublicDestinationController::class, 'show'])->name('destinations.show');
Route::get('enterprises', [PublicEnterpriseController::class, 'index'])->name('enterprises.index');
Route::get('enterprises/{enterprise:slug}', [PublicEnterpriseController::class, 'show'])->name('enterprises.show');
Route::get('enterprises/{enterprise:slug}/services/{service:slug}', [PublicEnterpriseServiceController::class, 'show'])->scopeBindings()->name('enterprises.services.show');
Route::post('reservations', [PublicReservationController::class, 'store'])->middleware('throttle:10,1')->name('reservations.store');
Route::get('reservations/success/{reservationNumber}', [PublicReservationController::class, 'success'])->name('reservations.success');
Route::get('reservations/check', [ReservationStatusController::class, 'create'])->name('reservations.status.create');
Route::post('reservations/check', [ReservationStatusController::class, 'store'])->middleware('throttle:10,1')->name('reservations.status.store');
Route::get('reservations/status/{reservation}', [ReservationStatusController::class, 'show'])->middleware('signed')->name('reservations.status.show');
Route::post('reviews', [PublicReviewController::class, 'store'])->middleware('throttle:5,1')->name('reviews.store');

Route::middleware(['auth', 'role:Administrator,Tourism Staff'])->group(function () {
    Route::get('dashboard', AdminDashboardController::class)->name('dashboard');

    Route::resource('admin/users', UserController::class)->names('admin.users');
    Route::get('admin/tourists', [AdminTouristController::class, 'index'])->name('admin.tourists.index');
    Route::get('admin/tourists/{tourist}', [AdminTouristController::class, 'show'])->name('admin.tourists.show');
    Route::patch('admin/tourists/{tourist}/status', [AdminTouristController::class, 'updateStatus'])
        ->middleware('role:Administrator')
        ->name('admin.tourists.status');
    Route::get('admin/tourist-arrivals', [AdminTouristArrivalController::class, 'index'])->name('admin.tourist-arrivals.index');
    Route::get('admin/tourist-verifications', [AdminTouristVerificationController::class, 'index'])->name('admin.tourist-verifications.index');
    Route::get('admin/tourist-verifications/{touristVerification}', [AdminTouristVerificationController::class, 'show'])->name('admin.tourist-verifications.show');
    Route::get('admin/tourist-verifications/{touristVerification}/documents/{document}', [AdminTouristVerificationController::class, 'document'])->whereIn('document', ['front', 'back', 'selfie'])->name('admin.tourist-verifications.document');
    Route::patch('admin/tourist-verifications/{touristVerification}', [AdminTouristVerificationController::class, 'update'])->name('admin.tourist-verifications.update');
    Route::patch('admin/daily-tourist-reports/{dailyTouristReport}', [AdminTouristArrivalController::class, 'updateReport'])->name('admin.daily-tourist-reports.update');
    Route::resource('admin/roles', RoleController::class)->only(['index', 'store', 'destroy'])->names('admin.roles');
    Route::get('admin/audit-logs', AuditLogController::class)->name('admin.audit-logs.index');
    Route::get('admin/reviews', [AdminReviewController::class, 'index'])->name('admin.reviews.index');
    Route::patch('admin/reviews/{review}', [AdminReviewController::class, 'update'])->name('admin.reviews.update');
    Route::get('admin/security-monitoring', SecurityMonitoringController::class)
        ->middleware('role:Administrator')
        ->name('admin.security-monitoring.index');
    Route::patch('admin/security-incidents/{securityIncident}', [SecurityIncidentController::class, 'update'])
        ->middleware('role:Administrator')
        ->name('admin.security-incidents.update');
    Route::patch('admin/barangays/{barangay}/activate', [BarangayController::class, 'activate'])->name('admin.barangays.activate');
    Route::patch('admin/barangays/{barangay}/deactivate', [BarangayController::class, 'deactivate'])->name('admin.barangays.deactivate');
    Route::resource('admin/barangays', BarangayController::class)->except('destroy')->names('admin.barangays');
    Route::resource('admin/lgu-information', LguInformationController::class)->except('destroy')->names('admin.lgu-information');
    Route::resource('admin/banners', BannerController::class)->names('admin.banners');
    Route::get('admin/local-products', [AdminLocalProductController::class, 'index'])->name('admin.local-products.index');
    Route::patch('admin/local-products/{product}', [AdminLocalProductController::class, 'update'])->name('admin.local-products.update');
    Route::patch('admin/local-products/{product}/feature', [AdminLocalProductController::class, 'feature'])->name('admin.local-products.feature');
    Route::get('admin/text', [BannerTextController::class, 'index'])->name('admin.text.index');
    Route::put('admin/text', [BannerTextController::class, 'update'])->name('admin.text.update');
    Route::resource('admin/gallery', GalleryController::class)->names('admin.gallery');
    Route::resource('admin/footer-settings', FooterSettingController::class)->names('admin.footer-settings');
    Route::get('admin/settings', SettingsController::class)->name('admin.settings');
    Route::get('admin/header-settings/create', [HeaderSettingController::class, 'create'])->name('admin.header-settings.create');
    Route::post('admin/header-settings', [HeaderSettingController::class, 'store'])->name('admin.header-settings.store');
    Route::get('admin/header-settings/{headerSetting}/edit', [HeaderSettingController::class, 'edit'])->name('admin.header-settings.edit');
    Route::put('admin/header-settings/{headerSetting}', [HeaderSettingController::class, 'update'])->name('admin.header-settings.update');
    Route::resource('admin/announcements', AnnouncementController::class)->names('admin.announcements');
    Route::get('admin/why-visit', [WhyVisitSectionController::class, 'edit'])->name('admin.why-visit.edit');
    Route::put('admin/why-visit', [WhyVisitSectionController::class, 'update'])->name('admin.why-visit.update');
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
