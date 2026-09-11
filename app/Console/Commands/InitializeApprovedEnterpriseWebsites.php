<?php

namespace App\Console\Commands;

use App\Models\Enterprise;
use App\Services\EnterpriseWebsiteManager;
use Illuminate\Console\Command;

class InitializeApprovedEnterpriseWebsites extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'enterprise-websites:initialize';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create the CMS foundation for approved tourism enterprises without overwriting existing websites';

    /**
     * Execute the console command.
     */
    public function handle(EnterpriseWebsiteManager $manager): int
    {
        $initialized = 0;
        $existing = 0;

        Enterprise::query()
            ->where('application_status', 'approved')
            ->with('enterpriseType:id,name,status,website_modules')
            ->lazyById()
            ->each(function (Enterprise $enterprise) use ($manager, &$initialized, &$existing): void {
                $websiteExists = $enterprise->microsite()->exists();

                $manager->initializeFoundation($enterprise);

                $websiteExists ? $existing++ : $initialized++;
            });

        $this->info("Initialized {$initialized} website(s); {$existing} existing website(s) preserved.");

        return self::SUCCESS;
    }
}
