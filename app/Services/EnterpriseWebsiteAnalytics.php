<?php

namespace App\Services;

use App\Models\EnterpriseWebsiteEvent;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;

class EnterpriseWebsiteAnalytics
{
    /** @return array{totals: array<string, int>, most_viewed: array<int, array<string, mixed>>} */
    public function summarize(?int $enterpriseId, CarbonImmutable $from, CarbonImmutable $to): array
    {
        $query = EnterpriseWebsiteEvent::query()
            ->when($enterpriseId, fn (Builder $query, int $id): Builder => $query->where('enterprise_id', $id))
            ->whereBetween('created_at', [$from, $to]);
        $counts = (clone $query)->selectRaw('event_type, count(*) as aggregate')->groupBy('event_type')->pluck('aggregate', 'event_type');
        $totals = collect(['profile_view', 'reservation_click', 'booking_conversion', 'direction_click', 'contact_click', 'social_click', 'content_view'])
            ->mapWithKeys(fn (string $event): array => [$event => (int) ($counts[$event] ?? 0)])->all();
        $totals['unique_visitors'] = (clone $query)->distinct()->count('visitor_hash');
        $mostViewed = (clone $query)->where('event_type', 'content_view')
            ->selectRaw('target_type, target_label, count(*) as views')
            ->groupBy('target_type', 'target_label')->orderByDesc('views')->limit(5)->get()->toArray();

        return ['totals' => $totals, 'most_viewed' => $mostViewed];
    }
}
