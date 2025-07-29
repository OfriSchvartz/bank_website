// Aurora Bank - Login JavaScript

// Form validation
function validateLogin() {
    const id = document.getElementById("id").value.trim();
    const password = document.getElementById("password").value;

    if (!id) {
        showError("Please enter your account ID");
        return false;
    }

    if (id.length < 5) {
        showError("Account ID must be at least 5 characters long");
        return false;
    }

    if (!password) {
        showError("Please enter your password");
        return false;
    }

    if (password.length < 8) {
        showError("Password must be at least 8 characters long");
        return false;
    }

    // Password complexity check
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
        showError("Password must contain uppercase, lowercase, digit, and special character");
        return false;
    }

    localStorage.setItem("account_number", id);
    return true;
}

// API call for login
async function checkLoginInfo() {
    const id = document.getElementById("id").value.trim();
    const password = document.getElementById("password").value;

    try {
        console.log("Attempting login for ID:", id); // Debug log
        
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id": id,
                "password": password
            })
        });

        console.log("Response status:", response.status); // Debug log
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Login response:", data); // Debug log
        
        if (!data.status) {
            showError(data.text || "Login failed");
            return false;
        }
        
        return true;
    } catch (error) {
        console.error("Login error:", error); // Debug log
        showError("Connection error. Please try again.");
        return false;
    }
}

// Handle remember me functionality
function handleRememberMe() {
    const rememberMe = document.getElementById('rememberMe').checked;
    const id = document.getElementById('id').value.trim();
    const password = document.getElementById('password').value;

    if (rememberMe) {
        localStorage.setItem('remembered_id', id);
        localStorage.setItem('remembered_password', password);
        localStorage.setItem('remember_me', 'true');
    } else {
        localStorage.removeItem('remembered_id');
        localStorage.removeItem('remembered_password');
        localStorage.removeItem('remember_me');
    }
}

// Load remembered credentials
function loadRememberedCredentials() {
    const rememberMe = localStorage.getItem('remember_me') === 'true';

    if (rememberMe) {
        const rememberedId = localStorage.getItem('remembered_id');
        const rememberedPassword = localStorage.getItem('remembered_password');

        if (rememberedId && rememberedPassword) {
            document.getElementById('id').value = rememberedId;
            document.getElementById('password').value = rememberedPassword;
            document.getElementById('rememberMe').checked = true;
        }
    }
}

// Show loading state
function showLoading() {
    const spinner = document.getElementById('loadingSpinner');
    const buttonText = document.getElementById('buttonText');
    const loginBtn = document.getElementById('loginBtn');

    spinner.style.display = 'inline-block';
    buttonText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    loginBtn.disabled = true;
}

// Hide loading state
function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    const buttonText = document.getElementById('buttonText');
    const loginBtn = document.getElementById('loginBtn');

    spinner.style.display = 'none';
    buttonText.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In Securely';
    loginBtn.disabled = false;
}

// Show success animation
function showSuccess() {
    const form = document.querySelector('form');
    const successCheckmark = document.getElementById('successCheckmark');
    
    form.style.opacity = '0';
    setTimeout(() => {
        form.style.display = 'none';
        successCheckmark.style.display = 'block';
        
        // Redirect after success animation
        setTimeout(() => {
            console.log("Redirecting to account page..."); // Debug log
            window.location.href = "/page/account";
        }, 1500);
    }, 300);
}

// Show error message
function showError(message) {
    console.log("Showing error:", message); // Debug log
    
    // Remove existing error
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    // Insert before form
    const form = document.querySelector('form');
    form.insertBefore(errorDiv, form.firstChild);

    // Remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Main submit function
async function submitLogin(event) {
    event.preventDefault();
    console.log("Submit login triggered"); // Debug log

    // Remove any existing errors
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    showLoading();

    try {
        // Validate form
        if (!validateLogin()) {
            console.log("Validation failed"); // Debug log
            hideLoading();
            return false;
        }

        console.log("Validation passed, checking credentials"); // Debug log

        // Check credentials
        const loginSuccess = await checkLoginInfo();
        
        if (!loginSuccess) {
            console.log("Login failed"); // Debug log
            hideLoading();
            return false;
        }

        console.log("Login successful!"); // Debug log

        // Handle remember me
        handleRememberMe();

        // Show success and redirect
        hideLoading();
        showSuccess();
        
    } catch (error) {
        console.error("Submit login error:", error); // Debug log
        hideLoading();
        showError("An unexpected error occurred. Please try again.");
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log("Login page loaded"); // Debug log
    
    loadRememberedCredentials();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', submitLogin);
        console.log("Form submit listener added"); // Debug log
    } else {
        console.error("Login form not found!"); // Debug log
    }

    // Add enter key support
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitLogin(event);
        }
    });
});