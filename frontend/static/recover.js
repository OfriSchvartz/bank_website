// Aurora Bank - Password Recovery JavaScript

// Create animated particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

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

// Form validation
function validateRecoveryForm() {
    const id = document.getElementById("id").value.trim();
    const email = document.getElementById("email").value.trim();

    // Clear previous errors
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    let hasErrors = false;

    // Validate ID
    if (!id) {
        showFieldError('id', 'Please enter your account ID');
        hasErrors = true;
    } else if (id.length < 5) {
        showFieldError('id', 'Account ID must be at least 5 characters');
        hasErrors = true;
    }

    // Validate Email
    if (!email) {
        showFieldError('email', 'Please enter your email address');
        hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        hasErrors = true;
    }

    return !hasErrors;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('error');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    field.closest('.form-group').appendChild(errorDiv);
}

// Simulate password recovery (since this is a demo)
async function processRecovery() {
    const id = document.getElementById("id").value.trim();
    const email = document.getElementById("email").value.trim();

    // In a real application, this would make an API call to your backend
    // For demo purposes, we'll simulate the process
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For demo: simulate success if ID and email are provided
        // In real app, you'd verify these against your database
        if (id && email) {
            return {
                success: true,
                message: `Password reset instructions have been sent to ${email}`
            };
        } else {
            return {
                success: false,
                message: 'Account not found with the provided details'
            };
        }
    } catch (error) {
        return {
            success: false,
            message: 'Connection error. Please try again.'
        };
    }
}

function showGlobalError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.marginBottom = '1rem';
    errorDiv.textContent = message;

    const form = document.getElementById('recoveryForm');
    form.insertBefore(errorDiv, form.firstChild);

    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

function showLoading() {
    const spinner = document.getElementById('loadingSpinner');
    const buttonText = document.getElementById('buttonText');
    const recoveryBtn = document.getElementById('recoveryBtn');

    spinner.style.display = 'inline-block';
    buttonText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Instructions...';
    recoveryBtn.disabled = true;
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    const buttonText = document.getElementById('buttonText');
    const recoveryBtn = document.getElementById('recoveryBtn');

    spinner.style.display = 'none';
    buttonText.innerHTML = '<i class="fas fa-paper-plane"></i> Send Reset Instructions';
    recoveryBtn.disabled = false;
}

function showSuccess() {
    const form = document.getElementById('recoveryForm');
    const successAnimation = document.getElementById('successAnimation');

    form.style.display = 'none';
    successAnimation.style.display = 'block';

    // Auto redirect to login after 4 seconds
    setTimeout(() => {
        window.location.href = "/page/login";
    }, 4000);
}

// Main submit function
async function submitRecovery() {
    // Remove existing errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    if (!validateRecoveryForm()) {
        return false;
    }

    showLoading();

    try {
        const result = await processRecovery();
        
        if (result.success) {
            hideLoading();
            showSuccess();
        } else {
            hideLoading();
            showGlobalError(result.message);
        }
    } catch (error) {
        hideLoading();
        showGlobalError('An unexpected error occurred. Please try again.');
    }
}

// Show info notification about demo
function showDemoInfo() {
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
        background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-info-circle"></i>
            <span>Demo Mode: Password reset is simulated</span>
        </div>
    `;
    
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Clear field errors on focus
function setupFieldListeners() {
    const fields = ['id', 'email'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('focus', function() {
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                    const errorMsg = this.closest('.form-group').querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    setupFieldListeners();
    
    // Show demo info after a short delay
    setTimeout(showDemoInfo, 1000);

    // Add enter key support
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitRecovery();
        }
    });
});