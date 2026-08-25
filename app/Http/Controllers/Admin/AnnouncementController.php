<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAnnouncementRequest;
use App\Http\Requests\Admin\UpdateAnnouncementRequest;
use App\Models\Announcement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('admin/announcements/index', [
            'announcements' => Announcement::query()->latest('publish_date')->latest('id')->paginate(10),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/announcements/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAnnouncementRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = $this->uniqueSlug($data['title']);
        Announcement::create($data);

        return to_route('admin.announcements.index')->with('success', 'Announcement created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Announcement $announcement): Response
    {
        return Inertia::render('admin/announcements/show', ['announcement' => $announcement]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Announcement $announcement): Response
    {
        return Inertia::render('admin/announcements/edit', ['announcement' => $announcement]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAnnouncementRequest $request, Announcement $announcement): RedirectResponse
    {
        $data = $request->validated();

        if ($data['title'] !== $announcement->title) {
            $data['slug'] = $this->uniqueSlug($data['title'], $announcement);
        }

        $announcement->update($data);

        return to_route('admin.announcements.index')->with('success', 'Announcement updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Announcement $announcement): RedirectResponse
    {
        $announcement->delete();

        return to_route('admin.announcements.index')->with('success', 'Announcement deleted successfully.');
    }

    private function uniqueSlug(string $title, ?Announcement $ignoredAnnouncement = null): string
    {
        $baseSlug = Str::slug($title) ?: 'announcement';
        $slug = $baseSlug;
        $suffix = 2;

        while (Announcement::query()->when($ignoredAnnouncement, fn ($query) => $query->whereKeyNot($ignoredAnnouncement->getKey()))->where('slug', $slug)->exists()) {
            $slug = $baseSlug.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }
}
