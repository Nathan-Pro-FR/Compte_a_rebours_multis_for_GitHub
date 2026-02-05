let countdownInterval;
let targetDate;

/**
 * Change la date cible en fonction de la sélection de l'utilisateur
 */
function changeTarget() {
    const selector = document.getElementById('eventSelector');
    const selectedDate = selector.value;
    targetDate = new Date(selectedDate + "T00:00:00").getTime();
    
    // On réinitialise l'intervalle pour éviter les bugs visuels
    clearInterval(countdownInterval);
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

/**
 * Met à jour l'affichage du compte à rebours et de la barre de progression
 */
function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    // --- Calcul du Pourcentage (Base de référence : 1er Septembre) ---
    let currentYear = new Date().getFullYear();
    // Si nous sommes avant Septembre, l'année scolaire a débuté l'année civile précédente
    if (new Date().getMonth() < 8) currentYear--; 
    const startDate = new Date(currentYear, 8, 1).getTime(); 

    const totalDuration = targetDate - startDate;
    let percentage = ((now - startDate) / totalDuration) * 100;
    percentage = Math.max(0, Math.min(100, percentage)); // Sécurité : entre 0 et 100

    // --- Mise à jour visuelle de la barre (Changement de couleur Bleu -> Rose) ---
    // On fait varier la teinte HSL entre 200 (Bleu) et 320 (Fuchsia)
    const hue = 200 + (percentage * 1.2); 
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = percentage.toFixed(2) + '%';
        progressBar.style.backgroundColor = `hsl(${hue}, 100%, 75%)`;
        progressBar.style.boxShadow = `0 0 15px hsl(${hue}, 100%, 70%)`;
    }

    const percentageElement = document.getElementById('percentageText');
    if (percentageElement) {
        percentageElement.innerText = `L'objectif est complété à ${percentage.toFixed(2)}% ✨ !`;
    }

    // --- Calcul des jours, heures, minutes, secondes ---
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (diff <= 0) {
        // Affichage quand la date est atteinte
        daysEl.innerText = "00";
        hoursEl.innerText = "00";
        minutesEl.innerText = "00";
        secondsEl.innerText = "00";
        if (percentageElement) percentageElement.innerText = "C'est le moment ! 🎉";
        return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    // Injection des valeurs avec format "00"
    daysEl.innerText = d.toString().padStart(2, '0');
    hoursEl.innerText = h.toString().padStart(2, '0');
    minutesEl.innerText = m.toString().padStart(2, '0');
    secondsEl.innerText = s.toString().padStart(2, '0');
}

// Initialisation immédiate au chargement
changeTarget();