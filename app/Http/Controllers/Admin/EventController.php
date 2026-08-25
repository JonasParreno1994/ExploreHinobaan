<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEventRequest;
use App\Http\Requests\Admin\UpdateEventRequest;
use App\Models\Barangay;
use App\Models\Event;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class EventController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->squish()->toString(),
            'event_type' => $request->string('event_type')->toString(),
            'barangay' => $request->string('barangay')->toString(),
            'date' => $request->string('date')->toString(),
            'status' => $request->string('status')->toString(),
        ];

        $events = Event::query()
            ->with('barangay:id,name')
            ->when($filters['search'] !== '', fn (Builder $query): Builder => $query->where(fn (Builder $query): Builder => $query
                ->whereLike('title', "%{$filters['search']}%")
                ->orWhereLike('venue', "%{$filters['search']}%")
                ->orWhereLike('organizer', "%{$filters['search']}%")))
            ->when($filters['event_type'] !== '', fn (Builder $query): Builder => $query->where('event_type', $filters['event_type']))
            ->when($filters['barangay'] !== '', fn (Builder $query): Builder => $query->where('barangay_id', $filters['barangay']))
            ->when($filters['status'] !== '', fn (Builder $query): Builder => $query->where('status', $filters['status']))
            ->when($filters['date'] === 'upcoming', fn (Builder $query): Builder => $query->whereDate('start_date', '>', today()))
            ->when($filters['date'] === 'ongoing', fn (Builder $query): Builder => $query
                ->whereDate('start_date', '<=', today())
                ->where(fn (Builder $query): Builder => $query->whereNull('end_date')->whereDate('start_date', '>=', today())->orWhereDate('end_date', '>=', today())))
            ->when($filters['date'] === 'past', fn (Builder $query): Builder => $query
                ->where(fn (Builder $query): Builder => $query->whereDate('end_date', '<', today())->orWhere(fn (Builder $query): Builder => $query->whereNull('end_date')->whereDate('start_date', '<', today()))))
            ->when($filters['date'] === 'unscheduled', fn (Builder $query): Builder => $query->whereNull('start_date'))
            ->orderByRaw('start_date is null')
            ->orderBy('start_date')
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/events/index', [
            'events' => $events,
            'barangays' => Barangay::query()->orderBy('name')->get(['id', 'name']),
            'eventTypes' => $this->eventTypes(),
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/events/create', $this->formOptions());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEventRequest $request): RedirectResponse
    {
        $featuredImage = null;
        try {
            $featuredImage = $request->file('featured_image')?->store('events/featured', 'public');
            DB::transaction(function () use ($request, $featuredImage): void {
                $data = $request->safe()->except('featured_image');
                $data['slug'] = $this->uniqueSlug($data['title']);
                $data['featured_image'] = $featuredImage;
                $data['created_by'] = $request->user()->getKey();
                Event::create($data);
            });
        } catch (Throwable $exception) {
            if ($featuredImage !== null) {
                Storage::disk('public')->delete($featuredImage);
            }
            throw $exception;
        }

        return to_route('admin.events.index')->with('success', 'Event created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event): Response
    {
        $event->load(['barangay:id,name', 'creator:id,name']);

        return Inertia::render('admin/events/show', ['event' => $event]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event): Response
    {
        return Inertia::render('admin/events/edit', ['event' => $event, ...$this->formOptions()]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEventRequest $request, Event $event): RedirectResponse
    {
        $featuredImage = $request->file('featured_image')?->store('events/featured', 'public');
        $oldFeaturedImage = $event->featured_image;
        try {
            DB::transaction(function () use ($request, $event, $featuredImage): void {
                $data = $request->safe()->except('featured_image');
                if ($data['title'] !== $event->title) {
                    $data['slug'] = $this->uniqueSlug($data['title'], $event);
                }
                if ($featuredImage !== null) {
                    $data['featured_image'] = $featuredImage;
                }
                $event->update($data);
            });
        } catch (Throwable $exception) {
            if ($featuredImage !== null) {
                Storage::disk('public')->delete($featuredImage);
            }
            throw $exception;
        }
        if ($featuredImage !== null && $oldFeaturedImage !== null) {
            Storage::disk('public')->delete($oldFeaturedImage);
        }

        return to_route('admin.events.show', $event)->with('success', 'Event updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event): RedirectResponse
    {
        $featuredImage = $event->featured_image;
        $event->delete();
        if ($featuredImage !== null) {
            Storage::disk('public')->delete($featuredImage);
        }

        return to_route('admin.events.index')->with('success', 'Event deleted successfully.');
    }

    public function publish(Event $event): RedirectResponse
    {
        $event->update(['status' => 'published']);

        return back()->with('success', 'Event published successfully.');
    }

    public function archive(Event $event): RedirectResponse
    {
        $event->update(['status' => 'archived', 'is_featured' => false]);

        return back()->with('success', 'Event archived successfully.');
    }

    public function toggleFeatured(Event $event): RedirectResponse
    {
        $event->update(['is_featured' => ! $event->is_featured]);

        return back()->with('success', $event->is_featured ? 'Event featured successfully.' : 'Event removed from featured.');
    }

    /** @return array{barangays: mixed, eventTypes: list<string>} */
    private function formOptions(): array
    {
        return [
            'barangays' => Barangay::query()->orderBy('name')->get(['id', 'name', 'status']),
            'eventTypes' => $this->eventTypes(),
        ];
    }

    /** @return list<string> */
    private function eventTypes(): array
    {
        return ['Festival', 'Cultural Event', 'Tourism Event', 'Sports Event', 'Community Event', 'Municipal Event', 'Barangay Event', 'Other'];
    }

    private function uniqueSlug(string $title, ?Event $ignoredEvent = null): string
    {
        $baseSlug = Str::slug($title) ?: 'event';
        $slug = $baseSlug;
        $suffix = 2;
        while (Event::query()->when($ignoredEvent, fn (Builder $query): Builder => $query->whereKeyNot($ignoredEvent->getKey()))->where('slug', $slug)->exists()) {
            $slug = $baseSlug.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }
}
