// Aurora Bank - Transfer JavaScript

// Form validation
function validateTransferForm() {
    const recipient = document.getElementById("recipient").value.trim();
    const accountNumber = document.getElementById("accountNumber").value.trim();
    const amount = parseFloat(document.getElementById("amount").value.trim());

    // Clear previous errors
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    let hasErrors = false;

    if (!recipient) {
        showFieldError('recipient', 'Please enter the recipient\'s name');
        hasErrors = true;
    }

    if (!accountNumber || accountNumber.length < 8) {
        showFieldError('accountNumber', 'Please enter a valid account number (at least 8 characters)');
        hasErrors = true;
    }

    if (isNaN(amount) || amount <= 0) {
        showFieldError('amount', 'Please enter a valid amount greater than zero');
        hasErrors = true;
    }

    if (!hasErrors) {
        updateTransferSummary();
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

function updateTransferSummary() {
    const recipient = document.getElementById("recipient").value.trim();
    const accountNumber = document.getElementById("accountNumber").value.trim();
    const amount = parseFloat(document.getElementById("amount").value.trim());
    const description = document.getElementById("description").value.trim() || 'No description';

    document.getElementById("summaryRecipient").textContent = recipient;
    document.getElementById("summaryAccount").textContent = accountNumber;
    document.getElementById("summaryAmount").textContent = `₪${amount.toFixed(2)}`;
    document.getElementById("summaryDescription").textContent = description;

    document.getElementById("transferSummary").style.display = 'block';
}

// API call for transfer
async function checkTransfer() {
    const toName = document.getElementById("recipient").value.trim();
    const toId = document.getElementById("accountNumber").value.trim();
    const fromId = localStorage.getItem("account_number");
    const amount = parseFloat(document.getElementById("amount").value.trim());
    const description = document.getElementById("description").value.trim();

    try {
        const response = await fetch("http://127.0.0.1:5000/api/transfer", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "from_id": fromId,
                "to_id": toId,
                "recipient_name": toName,
                "amount": amount,
                "description": description
            })
        });

        const data = await response.json();
        
        if (!data.status) {
            showGlobalError(data.text || 'Transfer failed');
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

    const form = document.getElementById('transferForm');
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
    const transferBtn = document.getElementById('transferBtn');

    spinner.style.display = 'inline-block';
    buttonText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Transfer...';
    transferBtn.disabled = true;
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    const buttonText = document.getElementById('buttonText');
    const transferBtn = document.getElementById('transferBtn');

    spinner.style.display = 'none';
    buttonText.innerHTML = '<i class="fas fa-paper-plane"></i> Send Transfer';
    transferBtn.disabled = false;
}

function showSuccess() {
    const form = document.getElementById('transferForm');
    const successAnimation = document.getElementById('successAnimation');

    form.style.display = 'none';
    successAnimation.style.display = 'block';

    // Store transfer details for confirmation page
    const transferData = {
        recipient: document.getElementById("recipient").value.trim(),
        accountNumber: document.getElementById("accountNumber").value.trim(),
        amount: document.getElementById("amount").value.trim(),
        description: document.getElementById("description").value.trim() || 'No description',
        dateTime: new Date().toLocaleString()
    };

    // Store in sessionStorage for confirmation page
    sessionStorage.setItem('transferData', JSON.stringify(transferData));

    setTimeout(() => {
        window.location.href = "/page/confirmation";
    }, 2000);
}

// Main submit function
async function submitTransfer() {
    // Remove existing errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    if (!validateTransferForm()) {
        return false;
    }

    showLoading();

    const success = await checkTransfer();

    if (!success) {
        hideLoading();
        return false;
    }

    hideLoading();
    showSuccess();
}

// Real-time form updates
function setupFormListeners() {
    const inputs = ['recipient', 'accountNumber', 'amount', 'description'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', function() {
                // Clear errors when user starts typing
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                    const errorMsg = this.closest('.form-group').querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }

                // Update summary if all required fields are filled
                const recipient = document.getElementById("recipient").value.trim();
                const accountNumber = document.getElementById("accountNumber").value.trim();
                const amount = document.getElementById("amount").value.trim();

                if (recipient && accountNumber && amount && !isNaN(parseFloat(amount))) {
                    updateTransferSummary();
                } else {
                    document.getElementById("transferSummary").style.display = 'none';
                }
            });
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const accountId = localStorage.getItem("account_number");
    if (!accountId) {
        window.location.href = '/';
        return;
    }

    setupFormListeners();

    // Add enter key support
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitTransfer();
        }
    });
});