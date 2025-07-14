// Aurora Bank - Confirmation JavaScript

// Create animated particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Populate confirmation details
function populateConfirmationDetails() {
    // Try to get data from sessionStorage first (from transfer page)
    const transferData = sessionStorage.getItem('transferData');
    
    if (transferData) {
        const data = JSON.parse(transferData);
        
        document.getElementById('conf-recipient').textContent = data.recipient;
        document.getElementById('conf-account').textContent = data.accountNumber;
        document.getElementById('conf-amount').textContent = `₪${parseFloat(data.amount).toFixed(2)}`;
        document.getElementById('conf-description').textContent = data.description;
        document.getElementById('conf-datetime').textContent = data.dateTime;
        
        // Clear the session storage after use
        sessionStorage.removeItem('transferData');
    } else {
        // Fallback to current date/time if no data available
        document.getElementById('conf-recipient').textContent = 'Unknown Recipient';
        document.getElementById('conf-account').textContent = 'Unknown Account';
        document.getElementById('conf-amount').textContent = '₪0.00';
        document.getElementById('conf-description').textContent = 'No description';
        document.getElementById('conf-datetime').textContent = new Date().toLocaleString();
    }
}

// Navigation functions
function goToAccount() {
    window.location.href = '/page/account';
}

function newTransfer() {
    window.location.href = '/page/transfer';
}

// Auto redirect with countdown
function startCountdown() {
    let countdown = 5;
    const countdownElement = document.getElementById('countdown');
    
    const timer = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            goToAccount();
        }
    }, 1000);
    
    // Allow users to cancel auto-redirect by interacting with the page
    document.addEventListener('click', () => {
        clearInterval(timer);
        document.getElementById('redirectNotification').style.display = 'none';
    });
    
    document.addEventListener('keypress', () => {
        clearInterval(timer);
        document.getElementById('redirectNotification').style.display = 'none';
    });
}

// Show success notification
function showSuccessNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-check-circle"></i>
            <span>Transfer completed successfully!</span>
        </div>
    `;
    
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const accountId = localStorage.getItem("account_number");
    if (!accountId) {
        window.location.href = '/';
        return;
    }

    createParticles();
    populateConfirmationDetails();
    showSuccessNotification();
    
    // Start auto-redirect countdown
    setTimeout(() => {
        startCountdown();
    }, 1000);
});