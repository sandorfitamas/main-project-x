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
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('suspended_until')->nullable()->after('is_admin');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->timestamp('suspended_until')->nullable()->after('contact_phone');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('suspended_until');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('suspended_until');
        });
    }
};
