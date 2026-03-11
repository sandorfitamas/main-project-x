<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120',
        ], [
            'image.required' => 'Nincs feltöltött fájl.',
            'image.image'    => 'Csak képfájlok engedélyeztek (JPG, PNG, GIF, WEBP).',
            'image.max'      => 'A fájl mérete maximum 5MB lehet.',
        ]);

        $path     = $request->file('image')->store('uploads', 'public');
        $fileName = basename($path);
        $fileUrl  = '/storage/uploads/' . $fileName;

        return response()->json([
            'success'  => true,
            'url'      => $fileUrl,
            'fileName' => $fileName,
        ]);
    }
}
