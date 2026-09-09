<?php

namespace App\Console\Commands;

use App\Models\EnterpriseDocument;
use App\Models\LocalProductOrder;
use App\Models\Reservation;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class MigrateSensitiveUploadsToPrivateStorage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sensitive-files:migrate-to-private {--dry-run : Report files without moving them}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Move enterprise documents and customer payment proofs from public to private storage';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $moved = 0;
        $alreadyPrivate = 0;
        $missing = 0;

        $sources = [
            [EnterpriseDocument::query(), 'file_path'],
            [Reservation::query()->whereNotNull('payment_proof_path'), 'payment_proof_path'],
            [LocalProductOrder::query()->whereNotNull('payment_proof_path'), 'payment_proof_path'],
        ];

        foreach ($sources as [$query, $column]) {
            $query->select(['id', $column])->lazyById()->each(function ($record) use ($column, &$moved, &$alreadyPrivate, &$missing): void {
                $path = $record->{$column};

                if (Storage::disk('local')->exists($path)) {
                    $alreadyPrivate++;

                    return;
                }

                if (! Storage::disk('public')->exists($path)) {
                    $missing++;
                    $this->warn("Missing file: {$path}");

                    return;
                }

                if (! $this->option('dry-run')) {
                    $this->moveToPrivate($path);
                }

                $moved++;
            });
        }

        $action = $this->option('dry-run') ? 'Would move' : 'Moved';
        $this->info("{$action} {$moved} file(s); {$alreadyPrivate} already private; {$missing} missing.");

        return self::SUCCESS;
    }

    private function moveToPrivate(string $path): void
    {
        $stream = Storage::disk('public')->readStream($path);
        if ($stream === null) {
            throw new RuntimeException("Unable to read public file: {$path}");
        }

        try {
            if (! Storage::disk('local')->writeStream($path, $stream)) {
                throw new RuntimeException("Unable to write private file: {$path}");
            }
        } finally {
            if (is_resource($stream)) {
                fclose($stream);
            }
        }

        if (! Storage::disk('local')->exists($path)) {
            throw new RuntimeException("Private file verification failed: {$path}");
        }

        Storage::disk('public')->delete($path);
    }
}
