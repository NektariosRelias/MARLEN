<?php
header("Content-Type: application/json");

$host = 'localhost';
$db   = 'TO_ONOMA_TIS_VASIS_SOU';
$user = 'TO_USERNAME_SOU';
$pass = 'O_KODIKOS_SOU';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    
    // Λήψη δεδομένων
    $data = json_decode(file_get_contents("php://input"), true);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // ΕΛΕΓΧΟΣ: Μήπως υπάρχει ήδη ραντεβού;
        $check = $pdo->prepare("SELECT id FROM appointments WHERE appointment_date = ? AND barber = ?");
        $check->execute([$data['appointment_date'], $data['barber']]);
        
        if ($check->fetch()) {
            echo json_encode(["status" => "error", "message" => "Η ώρα είναι πιασμένη!"]);
            exit;
        }

        // ΚΑΤΑΧΩΡΗΣΗ
        $stmt = $pdo->prepare("INSERT INTO appointments (name, phone, service, barber, appointment_date) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['name'], $data['phone'], $data['service'], $data['barber'], $data['appointment_date']]);
        
        echo json_encode(["status" => "success"]);
    }
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>