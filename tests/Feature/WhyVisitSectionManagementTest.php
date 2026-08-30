<?php

use App\Models\Role;
use App\Models\User;
use App\Models\WhyVisitSection;
use Inertia\Testing\AssertableInertia as Assert;

test('administrator can manage the why visit landing section', function () {
    $administrator = User::factory()->for(Role::factory()->create(['name' => 'Administrator']))->create();
    WhyVisitSection::factory()->create();

    $this->actingAs($administrator)
        ->get(route('admin.why-visit.edit'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/why-visit/edit')
            ->where('section.title', 'Why Visit Hinoba-an?'));

    $this->actingAs($administrator)->put(route('admin.why-visit.update'), [
        'eyebrow' => 'Discover Our Municipality',
        'title' => 'Experience Hinoba-an',
        'subtitle' => 'A destination filled with natural and cultural experiences.',
        'cards' => [
            ['title' => 'Coastal Beauty', 'description' => 'Explore beaches and peaceful coastal communities.', 'icon' => 'waves'],
            ['title' => 'Warm Hospitality', 'description' => 'Meet welcoming residents and local producers.', 'icon' => 'heart'],
        ],
        'status' => 'active',
    ])->assertRedirect()->assertSessionHasNoErrors();

    $section = WhyVisitSection::query()->firstOrFail();
    expect($section->title)->toBe('Experience Hinoba-an')
        ->and($section->cards)->toHaveCount(2)
        ->and($section->cards[0]['icon'])->toBe('waves');

    $this->get(route('home'))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->where('whyVisitSection.title', 'Experience Hinoba-an')
        ->where('whyVisitSection.cards.0.title', 'Coastal Beauty'));
});

test('why visit management validates card content', function () {
    $administrator = User::factory()->for(Role::factory()->create(['name' => 'Administrator']))->create();

    $this->actingAs($administrator)->put(route('admin.why-visit.update'), [
        'eyebrow' => 'Why Visit',
        'title' => 'Visit Hinoba-an',
        'subtitle' => '',
        'cards' => [['title' => '', 'description' => '', 'icon' => 'invalid-icon']],
        'status' => 'active',
    ])->assertSessionHasErrors(['cards.0.title', 'cards.0.description', 'cards.0.icon']);

    expect(WhyVisitSection::query()->count())->toBe(0);
});
