// Aurora Bank - Registration JavaScript

// Password strength checker
function checkPasswordStrength(password) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    strengthBar.className = 'strength-bar';
    
    switch (score) {
        case 0:
        case 1:
            strengthBar.classList.add('strength-weak');
            strengthText.textContent = 'Weak password';
            strengthText.style.color = '#EF4444';
            break;
        case 2:
        case 3:
            strengthBar.classList.add('strength-fair');
            strengthText.textContent = 'Fair password';
            strengthText.style.color = '#F59E0B';
            break;
        case 4:
            strengthBar.classList.add('strength-good');
            strengthText.textContent = 'Good password';
            strengthText.style.color = '#10B981';
            break;
        case 5:
            strengthBar.classList.add('strength-strong');
            strengthText.textContent = 'Strong password';
            strengthText.style.color = '#059669';
            break;
    }
}

// Form validation
function validateRegistration() {
    const fields = {
        id: document.getElementById("id").value.trim(),
        firstname: document.getElementById("firstname").value.trim(),
        lastname: document.getElementById("lastname").value.trim(),
        dateOfBirth: document.getElementById("date_of_birth").value,
        gender: document.getElementById("gender").value,
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value,
        confirmPassword: document.getElementById("confirm_password").value,
        phoneNumber: document.getElementById("phone_number").value.trim(),
        address: document.getElementById("address").value.trim(),
        zipcode: document.getElementById("zipcode").value.trim()
    };

    // Clear previous errors
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    let hasErrors = false;

    // ID validation
    if (!fields.id) {
        showFieldError('id', 'ID number is required');
        hasErrors = true;
    } else if (fields.id.length < 5 || !/^\d+$/.test(fields.id)) {
        showFieldError('id', 'ID must be at least 5 digits');
        hasErrors = true;
    }

    // Name validations
    if (!fields.firstname) {
        showFieldError('firstname', 'First name is required');
        hasErrors = true;
    }

    if (!fields.lastname) {
        showFieldError('lastname', 'Last name is required');
        hasErrors = true;
    }

    // Date validation
    if (!fields.dateOfBirth) {
        showFieldError('date_of_birth', 'Date of birth is required');
        hasErrors = true;
    } else if (new Date(fields.dateOfBirth) >= new Date()) {
        showFieldError('date_of_birth', 'Date must be in the past');
        hasErrors = true;
    }

    // Gender validation
    if (!fields.gender) {
        showFieldError('gender', 'Please select your gender');
        hasErrors = true;
    }

    // Email validation
    if (!fields.email) {
        showFieldError('email', 'Email is required');
        hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
        showFieldError('email', 'Please enter a valid email');
        hasErrors = true;
    }

    // Password validation
    if (!fields.password) {
        showFieldError('password', 'Password is required');
        hasErrors = true;
    } else if (fields.password.length < 8 || fields.password.length > 16) {
        showFieldError('password', 'Password must be 8-16 characters');
        hasErrors = true;
    } else {
        const hasUpper = /[A-Z]/.test(fields.password);
        const hasLower = /[a-z]/.test(fields.password);
        const hasDigit = /\d/.test(fields.password);
        const hasSpecial = /[^a-zA-Z0-9]/.test(fields.password);

        if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
            showFieldError('password', 'Password must contain uppercase, lowercase, digit, and special character');
            hasErrors = true;
        }
    }

    // Confirm password validation
    if (!fields.confirmPassword) {
        showFieldError('confirm_password', 'Please confirm your password');
        hasErrors = true;
    } else if (fields.confirmPassword !== fields.password) {
        showFieldError('confirm_password', 'Passwords do not match');
        hasErrors = true;
    }

    // Phone validation
    if (!fields.phoneNumber) {
        showFieldError('phone_number', 'Phone number is required');
        hasErrors = true;
    } else if (!fields.phoneNumber.startsWith("05") || fields.phoneNumber.length !== 10) {
        showFieldError('phone_number', 'Phone must start with 05 and be 10 digits');
        hasErrors = true;
    }

    // Address validation
    if (!fields.address) {
        showFieldError('address', 'Address is required');
        hasErrors = true;
    }

    // Zipcode validation
    if (!fields.zipcode) {
        showFieldError('zipcode', 'ZIP code is required');
        hasErrors = true;
    } else if (fields.zipcode.length < 5 || fields.zipcode.length > 10) {
        showFieldError('zipcode', 'ZIP code must be 5-10 characters');
        hasErrors = true;
    }

    if (!hasErrors) {
        localStorage.setItem("account_number", fields.id);
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

// API call for registration
async function SaveRegisterInfo() {
    const formData = {
        id: document.getElementById("id").value.trim(),
        first_name: document.getElementById("firstname").value.trim(),
        last_name: document.getElementById("lastname").value.trim(),
        date_of_birth: document.getElementById("date_of_birth").value,
        gender: document.getElementById("gender").value,
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value,
        phone_number: document.getElementById("phone_number").value.trim(),
        address: document.getElementById("address").value.trim(),
        zipcode: document.getElementById("zipcode").value.trim()
    };

    try {
        const response = await fetch("http://127.0.0.1:5000/api/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!data.status) {
            showGlobalError(data.text || 'Registration failed');
            return false;
        }

        return true;
    } catch (error) {
        showGlobalError('Connection error. Please try again.');
        return false;
    }
}

function showGlobalError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.marginBottom = '1rem';
    errorDiv.textContent = message;

    const form = document.getElementById('registrationForm');
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
    const registerBtn = document.getElementById('registerBtn');

    spinner.style.display = 'inline-block';
    buttonText.textContent = 'Creating Account...';
    registerBtn.disabled = true;
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    const buttonText = document.getElementById('buttonText');
    const registerBtn = document.getElementById('registerBtn');

    spinner.style.display = 'none';
    buttonText.textContent = 'Create Account';
    registerBtn.disabled = false;
}

function showSuccess() {
    const form = document.getElementById('registrationForm');
    const successAnimation = document.getElementById('successAnimation');

    form.style.display = 'none';
    successAnimation.style.display = 'block';

    setTimeout(() => {
        window.location.href = "/page/account";
    }, 3000);
}

// Main submit function
async function SubmitRegister() {
    // Remove existing errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    showLoading();

    if (!validateRegistration()) {
        hideLoading();
        return false;
    }

    const success = await SaveRegisterInfo();

    if (!success) {
        hideLoading();
        return false;
    }

    hideLoading();
    showSuccess();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Password strength checking
    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }

    // Real-time validation feedback
    const inputs = document.querySelectorAll('.form-input, .form-select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorMsg = this.closest('.form-group').querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });

        input.addEventListener('focus', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
            }
        });
    });

    // Enter key support
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            SubmitRegister();
        }
    });
});