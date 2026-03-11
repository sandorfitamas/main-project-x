-- Felhasználók tábla hozzáadása a project_x adatbázishoz

USE project_x;

-- Felhasználók tábla létrehozása
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- Módosítjuk az events táblát, hogy user_id-t is tároljon
ALTER TABLE events 
ADD COLUMN user_id INT DEFAULT NULL AFTER szervező,
ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
