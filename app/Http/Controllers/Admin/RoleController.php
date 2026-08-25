<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRoleRequest;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/roles/index', [
            'roles' => Role::query()
                ->select(['id', 'name', 'description', 'created_at'])
                ->latest('id')
                ->paginate(10),
        ]);
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        Role::create($request->validated());

        return to_route('admin.roles.index')->with('success', 'Role created successfully.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        $role->delete();

        return to_route('admin.roles.index')->with('success', 'Role deleted successfully.');
    }
}
