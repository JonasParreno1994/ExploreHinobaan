<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('security_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('event_type')->index();
            $table->string('attack_type')->nullable()->index();
            $table->string('severity', 20)->index();
            $table->unsignedSmallInteger('risk_score')->default(0)->index();
            $table->string('decision', 30)->index();
            $table->string('result', 30)->index();
            $table->string('role_name')->nullable();
            $table->string('endpoint');
            $table->string('method', 10);
            $table->string('ip_address', 45)->nullable()->index();
            $table->text('user_agent')->nullable();
            $table->string('affected_resource')->nullable();
            $table->json('explanation')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('detected_at')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('security_events');
    }
};
