<?php

namespace App\Policies;

use App\Models\EnterpriseWebsite;
use App\Models\User;

class EnterpriseWebsitePolicy
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
    public function view(User $user, EnterpriseWebsite $enterpriseWebsite): bool
    {
        return $this->ownsApprovedEnterprise($user, $enterpriseWebsite);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role?->name === 'Tourism Enterprise';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, EnterpriseWebsite $enterpriseWebsite): bool
    {
        return $this->ownsApprovedEnterprise($user, $enterpriseWebsite);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, EnterpriseWebsite $enterpriseWebsite): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, EnterpriseWebsite $enterpriseWebsite): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, EnterpriseWebsite $enterpriseWebsite): bool
    {
        return false;
    }

    public function publish(User $user, EnterpriseWebsite $enterpriseWebsite): bool
    {
        return $this->ownsApprovedEnterprise($user, $enterpriseWebsite);
    }

    private function ownsApprovedEnterprise(User $user, EnterpriseWebsite $enterpriseWebsite): bool
    {
        return $enterpriseWebsite->enterprise->user_id === $user->id
            && $enterpriseWebsite->enterprise->application_status === 'approved'
            && $enterpriseWebsite->enterprise->enterpriseType?->status === 'active';
    }
}
