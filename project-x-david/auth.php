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
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Adatbázis kapcsolódási hiba']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Regisztráció
if ($method === 'POST' && $action === 'register') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    
    // Validáció
    if (empty($name) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'error' => 'Minden mező kitöltése kötelező']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'error' => 'Érvénytelen email cím']);
        exit;
    }
    
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'error' => 'A jelszónak legalább 6 karakter hosszúnak kell lennie']);
        exit;
    }
    
    // Ellenőrizzük, hogy létezik-e már az email
    try {
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email');
        $stmt->execute([':email' => $email]);
        
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'error' => 'Ez az email cím már regisztrálva van']);
            exit;
        }
        
        // Jelszó hash-elése
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Felhasználó létrehozása
        $stmt = $pdo->prepare('INSERT INTO users (name, email, password) VALUES (:name, :email, :password)');
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':password' => $hashedPassword
        ]);
        
        $userId = $pdo->lastInsertId();
        
        // Session beállítása
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_name'] = $name;
        $_SESSION['user_email'] = $email;
        
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $userId,
                'name' => $name,
                'email' => $email
            ]
        ]);
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Regisztráció sikertelen']);
    }
}

// Bejelentkezés
elseif ($method === 'POST' && $action === 'login') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'error' => 'Email és jelszó megadása kötelező']);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare('SELECT id, name, email, password FROM users WHERE email = :email');
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user || !password_verify($password, $user['password'])) {
            echo json_encode(['success' => false, 'error' => 'Helytelen email vagy jelszó']);
            exit;
        }
        
        // Session beállítása
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];
        
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email']
            ]
        ]);
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Bejelentkezés sikertelen']);
    }
}

// Kijelentkezés
elseif ($method === 'POST' && $action === 'logout') {
    session_destroy();
    echo json_encode(['success' => true]);
}

// Aktuális felhasználó lekérése
elseif ($method === 'GET' && $action === 'current') {
    if (isset($_SESSION['user_id'])) {
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'name' => $_SESSION['user_name'],
                'email' => $_SESSION['user_email']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'user' => null]);
    }
}

else {
    echo json_encode(['success' => false, 'error' => 'Érvénytelen művelet']);
}

$pdo = null;
?>
