<?php
header("Content-Type: application/json; charset=UTF-8");

$host = 'localhost';
$db   = 'marlen_db'; // 
$user = 'root';       // 
$pass = '';           // 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    
    // Παίρνουμε όλες τις κρατήσεις ταξινομημένες από την πιο πρόσφατη στην παλαιότερη
    $stmt = $pdo->query("SELECT * FROM appointments ORDER BY id DESC");
    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "data" => $appointments]);

} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>