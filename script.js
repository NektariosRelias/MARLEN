// Ωράριο καταστήματος ανά ημέρα (0 = Κυριακή, 1 = Δευτέρα, κ.λπ.)
const schedules = {
    1: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "20:30"], // Δευτέρα: 9πμ - 9μμ
    2: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "20:30"], // Τρίτη: 9πμ - 9μμ
    3: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "20:30"], // Τετάρτη: 9πμ - 9μμ
    4: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "20:30"], // Πέμπτη: 9πμ - 9μμ
    5: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "20:30"], // Παρασκευή: 9πμ - 9μμ
    6: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "16:30"], // Σάββατο: 9πμ - 5μμ
    0: [] // Κυριακή: Κλειστά
};

// Όταν ο χρήστης αλλάζει ημερομηνία, γεμίζουν αυτόματα οι ώρες
document.getElementById('date_val').addEventListener('change', function() {
    const selectedDateStr = this.value;
    const timeSelect = document.getElementById('time_val');
    const statusMsg = document.getElementById('status');
    
    // Καθαρισμός προηγούμενων ωρών
    timeSelect.innerHTML = "";

    if (!selectedDateStr) {
        timeSelect.innerHTML = '<option value="">Επίλεξε πρώτα ημερομηνία</option>';
        return;
    }

    // Εύρεση ημέρας εβδομάδας (0-6)
    const dateObj = new Date(selectedDateStr);
    const dayOfWeek = dateObj.getDay(); 

    const availableHours = schedules[dayOfWeek];

    // Έλεγχος αν είναι κλειστά (π.χ. Κυριακή)
    if (!availableHours || availableHours.length === 0) {
        statusMsg.className = "error";
        statusMsg.innerText = "❌ Το κατάστημα είναι κλειστά αυτή τη μέρα!";
        timeSelect.innerHTML = '<option value="">Κλειστά</option>';
        return;
    } else {
        statusMsg.innerText = "";
    }

    // Δημιουργία επιλογών ώρας
    let optionsHtml = '<option value="">-- Επιλέξτε Ώρα --</option>';
    availableHours.forEach(hour => {
        optionsHtml += `<option value="${hour}">${hour}</option>`;
    });
    timeSelect.innerHTML = optionsHtml;
});

// Όταν ο χρήστης πατάει το κουμπί επιβεβαίωσης
document.getElementById('submitBtn').addEventListener('click', async function() {
    const n = document.getElementById('name').value.trim();
    const p = document.getElementById('phone').value.trim();
    const s = document.getElementById('service').value;
    const b = document.getElementById('barber').value;
    const d = document.getElementById('date_val').value;
    const t = document.getElementById('time_val').value;
    const statusMsg = document.getElementById('status');

    if (!n || !p || !d || !t) {
        statusMsg.className = "error";
        statusMsg.innerText = "⚠️ Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία!";
        return;
    }

    const fullDateTime = d + ' ' + t;

    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: n, 
                phone: p, 
                service: s,
                barber: b,
                appointment_date: fullDateTime 
            })
        });

        const result = await response.json();

        if (result.status === "success") {
            statusMsg.className = "success";
            statusMsg.innerText = "✅ Το ραντεβού κλείστηκε επιτυχώς!";
            
            // Καθαρισμός φόρμας
            document.getElementById('name').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('date_val').value = '';
            document.getElementById('time_val').innerHTML = '<option value="">Επίλεξε πρώτα ημερομηνία</option>';
        } else {
            statusMsg.className = "error";
            statusMsg.innerText = "❌ " + result.message;
        }
    } catch (error) {
        statusMsg.className = "error";
        statusMsg.innerText = "❌ Παρουσιάστηκε σφάλμα σύνδεσης με τον server.";
    }
});