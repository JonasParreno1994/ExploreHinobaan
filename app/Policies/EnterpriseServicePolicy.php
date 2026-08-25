<?php

namespace App\Policies;

use App\Models\EnterpriseService;
use App\Models\User;

class EnterpriseServicePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role?->name === 'Tourism Enterprise';
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, EnterpriseService $enterpriseService): bool
    {
        return $enterpriseService->enterprise()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $this->viewAny($user) && $user->enterprises()->exists();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, EnterpriseService $enterpriseService): bool
    {
        return $this->view($user, $enterpriseService);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, EnterpriseService $enterpriseService): bool
    {
        return $this->view($user, $enterpriseService);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, EnterpriseService $enterpriseService): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, EnterpriseService $enterpriseService): bool
    {
        return false;
    }
}
