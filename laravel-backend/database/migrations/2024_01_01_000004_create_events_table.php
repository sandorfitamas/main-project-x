<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('rating', 3, 1)->default(0.0);
            $table->date('date');
            $table->time('time');
            $table->string('location');
            $table->string('image_url', 500)->nullable();
            $table->string('category', 50)->default('Egyéb');
            $table->string('organizer', 100)->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('tags', 255)->nullable();
            $table->string('price', 100)->nullable();
            $table->string('contact_phone', 50)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
