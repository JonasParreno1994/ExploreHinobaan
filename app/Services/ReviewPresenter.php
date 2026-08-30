<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;

class ReviewPresenter
{
    /** @return array{reviews: mixed, reviewSummary: array{average: float, count: int}} */
    public function for(Model $target): array
    {
        $query = $target->publishedReviews();

        return [
            'reviews' => (clone $query)->latest('reviewed_at')->limit(20)->get(['id', 'reviewable_id', 'reviewable_type', 'reviewer_name', 'rating', 'title', 'comment', 'is_verified', 'created_at']),
            'reviewSummary' => ['average' => round((float) (clone $query)->avg('rating'), 1), 'count' => (clone $query)->count()],
        ];
    }
}
