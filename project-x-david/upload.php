<?php
header('Content-Type: application/json');

// Engedélyezett fájltípusok
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$maxFileSize = 5 * 1024 * 1024; // 5MB

// Upload mappa létrehozása, ha nem létezik
$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Ellenőrizzük, hogy van-e feltöltött fájl
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode([
        'success' => false,
        'error' => 'Nincs feltöltött fájl vagy hiba történt a feltöltés során.'
    ]);
    exit;
}

$file = $_FILES['image'];

// Fájl méret ellenőrzés
if ($file['size'] > $maxFileSize) {
    echo json_encode([
        'success' => false,
        'error' => 'A fájl mérete túl nagy. Maximum 5MB megengedett.'
    ]);
    exit;
}

// Fájl típus ellenőrzés
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, $allowedTypes)) {
    echo json_encode([
        'success' => false,
        'error' => 'Nem megengedett fájltípus. Csak JPG, PNG, GIF és WEBP formátumok engedélyezettek.'
    ]);
    exit;
}

// Egyedi fájlnév generálása
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$fileName = uniqid('event_', true) . '.' . $extension;
$filePath = $uploadDir . $fileName;

// Fájl mozgatása a célhelyre
if (move_uploaded_file($file['tmp_name'], $filePath)) {
    // Relatív URL visszaadása
    $fileUrl = 'uploads/' . $fileName;
    
    echo json_encode([
        'success' => true,
        'url' => $fileUrl,
        'fileName' => $fileName
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Hiba történt a fájl mentésekor.'
    ]);
}
?>
