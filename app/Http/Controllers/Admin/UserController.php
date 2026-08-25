<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->squish()->toString();

        $users = User::query()
            ->select(['id', 'role_id', 'name', 'email', 'phone', 'status', 'email_verified_at', 'created_at'])
            ->with('role:id,name')
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'filters' => ['search' => $search],
            'users' => $users,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/users/create', [
            'roles' => $this->roles(),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        User::create($request->validated());

        return to_route('admin.users.index')->with('success', 'User created successfully.');
    }

    public function show(User $user): Response
    {
        $user->load('role:id,name');

        return Inertia::render('admin/users/show', [
            'managedUser' => [
                ...$user->only(['id', 'name', 'email', 'phone', 'status', 'email_verified_at', 'created_at', 'updated_at']),
                'role' => $user->role?->only(['id', 'name']),
            ],
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('admin/users/edit', [
            'managedUser' => $user->only(['id', 'name', 'email', 'phone', 'role_id', 'status']),
            'roles' => $this->roles(),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $validated = $request->validated();

        if (blank($validated['password'])) {
            unset($validated['password']);
        }

        $user->update($validated);

        return to_route('admin.users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($request->user()->is($user)) {
            return back()->withErrors(['user' => 'You cannot delete your own account.']);
        }

        $user->delete();

        return to_route('admin.users.index')->with('success', 'User deleted successfully.');
    }

    /**
     * @return Collection<int, Role>
     */
    private function roles(): Collection
    {
        return Role::query()->select(['id', 'name'])->orderBy('name')->get();
    }
}
