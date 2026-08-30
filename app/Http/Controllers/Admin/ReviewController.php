<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateReviewRequest;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $reviews = Review::query()->with(['user:id,name,email', 'reviewable'])->when($request->status, fn ($query, $status) => $query->where('status', $status))->latest()->paginate(20)->withQueryString();

        return Inertia::render('admin/reviews/index', ['reviews' => $reviews, 'filters' => $request->only('status')]);
    }

    public function update(UpdateReviewRequest $request, Review $review): RedirectResponse
    {
        $review->update([...$request->validated(), 'reviewed_by' => $request->user()->id, 'reviewed_at' => now()]);

        return back()->with('success', 'Review moderation updated.');
    }
}
