<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// MySQL adatbázis kapcsolat
$host = 'localhost';
$dbname = 'project_x';
$username = 'root';  // XAMPP alapértelmezett felhasználó
$password = '';      // XAMPP alapértelmezett jelszó (üres)

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Adatbázis kapcsolódási hiba: ' . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// GET kérések kezelése
if ($method === 'GET') {
    if ($action === 'list') {
        try {
            $stmt = $pdo->query('SELECT * FROM events ORDER BY dátum ASC, idő ASC');
            $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Magyar oszlopnevek átalakítása angolra a JavaScript számára
            foreach ($events as &$event) {
                $event['title'] = $event['hely_neve'];
                $event['description'] = $event['leírás'];
                $event['rating'] = $event['értékelés'];
                $event['date'] = $event['dátum'];
                $event['time'] = $event['idő'];
                $event['location'] = $event['helyszín'];
                $event['category'] = $event['kategória'];
                $event['organizer'] = $event['szervező'];
                $event['price'] = $event['ár'];
                $event['contact_phone'] = $event['telefonszám'];
                $event['tags'] = !empty($event['címke']) ? explode(',', $event['címke']) : [];
                
                // Magyar mezők törlése
                unset($event['hely_neve'], $event['leírás'], $event['értékelés'], $event['dátum'], 
                      $event['idő'], $event['helyszín'], $event['kategória'], $event['szervező'], 
                      $event['ár'], $event['telefonszám'], $event['címke']);
            }
            
            echo json_encode(['success' => true, 'events' => $events]);
        } catch(PDOException $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    } elseif ($action === 'my-events') {
        // Csak a bejelentkezett felhasználó eseményei
        $userId = $_SESSION['user_id'] ?? null;
        
        if (!$userId) {
            echo json_encode(['success' => false, 'error' => 'Nem vagy bejelentkezve']);
            exit;
        }
        
        try {
            $stmt = $pdo->prepare('SELECT * FROM events WHERE user_id = :user_id ORDER BY dátum ASC, idő ASC');
            $stmt->execute([':user_id' => $userId]);
            $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Magyar oszlopnevek átalakítása angolra a JavaScript számára
            foreach ($events as &$event) {
                $event['title'] = $event['hely_neve'];
                $event['description'] = $event['leírás'];
                $event['rating'] = $event['értékelés'];
                $event['date'] = $event['dátum'];
                $event['time'] = $event['idő'];
                $event['location'] = $event['helyszín'];
                $event['category'] = $event['kategória'];
                $event['organizer'] = $event['szervező'];
                $event['price'] = $event['ár'];
                $event['contact_phone'] = $event['telefonszám'];
                $event['tags'] = !empty($event['címke']) ? explode(',', $event['címke']) : [];
                
                // Magyar mezők törlése
                unset($event['hely_neve'], $event['leírás'], $event['értékelés'], $event['dátum'], 
                      $event['idő'], $event['helyszín'], $event['kategória'], $event['szervező'], 
                      $event['ár'], $event['telefonszám'], $event['címke']);
            }
            
            echo json_encode(['success' => true, 'events' => $events]);
        } catch(PDOException $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    } elseif ($action === 'get_all_users') {
        // Get all users for community page
        try {
            $stmt = $pdo->query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC');
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode(['success' => true, 'users' => $users]);
        } catch(PDOException $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    } elseif ($action === 'favorites') {
        // Kedvenc események lekérése
        $userId = $_SESSION['user_id'] ?? null;
        
        if (!$userId) {
            echo json_encode(['success' => false, 'error' => 'Nem vagy bejelentkezve']);
            exit;
        }
        
        try {
            $stmt = $pdo->prepare('
                SELECT e.* 
                FROM events e
                INNER JOIN favorites f ON e.id = f.event_id
                WHERE f.user_id = :user_id
                ORDER BY f.created_at DESC
            ');
            $stmt->execute([':user_id' => $userId]);
            $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Magyar oszlopnevek átalakítása angolra a JavaScript számára
            foreach ($events as &$event) {
                $event['title'] = $event['hely_neve'];
                $event['description'] = $event['leírás'];
                $event['rating'] = $event['értékelés'];
                $event['date'] = $event['dátum'];
                $event['time'] = $event['idő'];
                $event['location'] = $event['helyszín'];
                $event['category'] = $event['kategória'];
                $event['organizer'] = $event['szervező'];
                $event['price'] = $event['ár'];
                $event['contact_phone'] = $event['telefonszám'];
                $event['tags'] = !empty($event['címke']) ? explode(',', $event['címke']) : [];
                
                // Magyar mezők törlése
                unset($event['hely_neve'], $event['leírás'], $event['értékelés'], $event['dátum'], 
                      $event['idő'], $event['helyszín'], $event['kategória'], $event['szervező'], 
                      $event['ár'], $event['telefonszám'], $event['címke']);
            }
            
            echo json_encode(['success' => true, 'events' => $events]);
        } catch(PDOException $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    } elseif ($action === 'check-session') {
        // Debug: session ellenőrzés
        echo json_encode([
            'success' => true,
            'logged_in' => isset($_SESSION['user_id']),
            'user_id' => $_SESSION['user_id'] ?? null,
            'user_name' => $_SESSION['user_name'] ?? null,
            'user_email' => $_SESSION['user_email'] ?? null
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
    }
}

// POST kérések kezelése - új esemény létrehozása
if ($method === 'POST') {
    if ($action === 'create') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $hely_neve = $input['title'] ?? '';
        $leírás = $input['description'] ?? '';
        $értékelés = $input['rating'] ?? 0.0;
        $dátum = $input['date'] ?? '';
        $idő = $input['time'] ?? '';
        $helyszín = $input['location'] ?? '';
        $imageUrl = $input['imageUrl'] ?? '';
        $kategória = $input['category'] ?? 'Egyéb';
        $szervező = $input['organizer'] ?? '';
        $címke = is_array($input['tags']) ? implode(',', $input['tags']) : '';
        
        // User ID a session-ből
        $userId = $_SESSION['user_id'] ?? null;
        
        if (empty($hely_neve) || empty($dátum) || empty($idő) || empty($helyszín)) {
            echo json_encode(['success' => false, 'error' => 'Hiányzó kötelező mezők']);
            exit;
        }
        
        try {
            $stmt = $pdo->prepare('INSERT INTO events (hely_neve, leírás, értékelés, dátum, idő, helyszín, imageUrl, kategória, szervező, user_id, címke) 
                                   VALUES (:hely_neve, :leírás, :értékelés, :dátum, :idő, :helyszín, :imageUrl, :kategória, :szervező, :user_id, :címke)');
            
            $stmt->execute([
                ':hely_neve' => $hely_neve,
                ':leírás' => $leírás,
                ':értékelés' => $értékelés,
                ':dátum' => $dátum,
                ':idő' => $idő,
                ':helyszín' => $helyszín,
                ':imageUrl' => $imageUrl,
                ':kategória' => $kategória,
                ':szervező' => $szervező,
                ':user_id' => $userId,
                ':címke' => $címke
            ]);
            
            $newId = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'id' => $newId]);
        } catch(PDOException $e) {
            echo json_encode(['success' => false, 'error' => 'Nem sikerült létrehozni az eseményt: ' . $e->getMessage()]);
        }
    } elseif ($action === 'update') {
        // Esemény módosítása
        $input = json_decode(file_get_contents('php://input'), true);
        
        $id = $input['id'] ?? '';
        $hely_neve = $input['title'] ?? '';
        $leírás = $input['description'] ?? '';
        $értékelés = $input['rating'] ?? 0.0;
        $dátum = $input['date'] ?? '';
        $idő = $input['time'] ?? '';
        $helyszín = $input['location'] ?? '';
        $imageUrl = $input['imageUrl'] ?? '';
        $kategória = $input['category'] ?? 'Egyéb';
        $szervező = $input['organizer'] ?? '';
        $címke = is_array($input['tags']) ? implode(',', $input['tags']) : '';
        
        // User ID a session-ből
        $userId = $_SESSION['user_id'] ?? null;
        
        if (!$userId) {
            echo json_encode(['success' => false, 'error' => 'Nem vagy bejelentkezve']);
            exit;
        }
        
        if (empty($id) || empty($hely_neve) || empty($dátum) || empty($idő) || empty($helyszín)) {
            echo json_encode(['success' => false, 'error' => 'Hiányzó kötelező mezők']);
            exit;
        }
        
        try {
            // Ellenőrizzük, hogy a felhasználó tulajdonosa-e az eseménynek
            $stmt = $pdo->prepare('SELECT user_id FROM events WHERE id = :id');
            $stmt->execute([':id' => $id]);
            $event = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$event || $event['user_id'] != $userId) {
                echo json_encode(['success' => false, 'error' => 'Nincs jogosultságod módosítani ezt az eseményt']);
                exit;
            }
            
            // Esemény frissítése
            $stmt = $pdo->prepare('UPDATE events SET 
                hely_neve = :hely_neve, 
                leírás = :leírás, 
                értékelés = :értékelés, 
                dátum = :dátum, 
                idő = :idő, 
                helyszín = :helyszín, 
                imageUrl = :imageUrl, 
                kategória = :kategória, 
                szervező = :szervező, 
                címke = :címke 
                WHERE id = :id');
            
            $stmt->execute([
                ':id' => $id,
                ':hely_neve' => $hely_neve,
                ':leírás' => $leírás,
                ':értékelés' => $értékelés,
                ':dátum' => $dátum,
                ':idő' => $idő,
                ':helyszín' => $helyszín,
                ':imageUrl' => $imageUrl,
                ':kategória' => $kategória,
                ':szervező' => $szervező,
                ':címke' => $címke
            ]);
            
            echo json_encode(['success' => true]);
        } catch(PDOException $e) {
            echo json_encode(['success' => false, 'error' => 'Nem sikerült módosítani az eseményt: ' . $e->getMessage()]);
        }
    } elseif ($action === 'delete') {
        // Esemény törlése
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? '';
        
        // User ID a session-ből
        $userId = $_SESSION['user_id'] ?? null;
        
        if (!$userId) {
            echo json_encode(['success' => false, 'error' => 'Nem vagy bejelentkezve']);
            exit;
        }
        
        if (empty($id)) {
            echo json_encode(['success' => false, 'error' => 'Hiányzó esemény ID']);
            exit;
        }
        
        try {
            // Ellenőrizzük, hogy a felhasználó tulajdonosa-e az eseménynek
            $stmt = $pdo->prepare('SELECT user_id FROM events WHERE id = :id');
            $stmt->execute([':id' => $id]);
            $event = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$event || $event['user_id'] != $userId) {
                echo json_encode(['success' => false, 'error' => 'Nincs jogosultságod törölni ezt az eseményt']);
                exit;
            }
            
            // Esemény törlése
            $stmt = $pdo->prepare('DELETE FROM events WHERE id = :id');
            $stmt->execute([':id' => $id]);
            
            echo json_encode(['success' => true]);
        } catch(PDOException $e) {
            echo json_encode(['success' => false, 'error' => 'Nem sikerült törölni az eseményt: ' . $e->getMessage()]);
        }
    } elseif ($action === 'add-favorite') {
        // Kedvencekhez adás
        $input = json_decode(file_get_contents('php://input'), true);
        $eventId = $input['event_id'] ?? '';
        
        $userId = $_SESSION['user_id'] ?? null;
        
        // Debug logging
        error_log("Add favorite attempt - User ID: " . var_export($userId, true) . ", Event ID: " . var_export($eventId, true));
        
        if (!$userId) {
            echo json_encode(['success' => false, 'error' => 'Nem vagy bejelentkezve']);
            exit;
        }
        
        if (empty($eventId)) {
            echo json_encode(['success' => false, 'error' => 'Hiányzó esemény ID']);
            exit;
        }
        
        try {
            $stmt = $pdo->prepare('INSERT INTO favorites (user_id, event_id) VALUES (:user_id, :event_id)');
            $result = $stmt->execute([
                ':user_id' => $userId,
                ':event_id' => $eventId
            ]);
            
            error_log("Insert result: " . var_export($result, true));
            echo json_encode(['success' => true, 'message' => 'Kedvencekhez adva']);
        } catch(PDOException $e) {
            // Log the actual error for debugging
            error_log('Favorites insert error: ' . $e->getMessage() . ' Code: ' . $e->getCode() . ' SQLSTATE: ' . $e->errorInfo[0]);
            
            // Unique constraint miatt már létezik - ez nem hiba, csak már benne van
            if ($e->getCode() == 23000) {
                echo json_encode(['success' => false, 'error' => 'SQL hiba: ' . $e->getMessage()]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Nem sikerült kedvencekhez adni: ' . $e->getMessage()]);
            }
        }
    } elseif ($action === 'remove-favorite') {
        // Kedvencekből eltávolítás
        $input = json_decode(file_get_contents('php://input'), true);
        $eventId = $input['event_id'] ?? '';
        
        $userId = $_SESSION['user_id'] ?? null;
        
        if (!$userId) {
            echo json_encode(['success' => false, 'error' => 'Nem vagy bejelentkezve']);
            exit;
        }
        
        if (empty($eventId)) {
            echo json_encode(['success' => false, 'error' => 'Hiányzó esemény ID']);
            exit;
        }
        
        try {
            $stmt = $pdo->prepare('DELETE FROM favorites WHERE user_id = :user_id AND event_id = :event_id');
            $stmt->execute([
                ':user_id' => $userId,
                ':event_id' => $eventId
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Eltávolítva a kedvencek közül']);
        } catch(PDOException $e) {
            echo json_encode(['success' => false, 'error' => 'Nem sikerült eltávolítani: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
    }
}

$pdo = null;
?>
