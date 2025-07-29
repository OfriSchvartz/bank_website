// Aurora Bank - Account Dashboard JavaScript

// Utility functions
function formatCurrency(amount) {
    return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatDateTime(date) {
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

function updateLastUpdatedTime() {
    const now = new Date();
    document.getElementById("lastUpdated").textContent = `Last updated: ${formatDateTime(now)}`;
}

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

function showNotification(message, type = 'success') {
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
    `;

    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Data functions
function showTransactions(transactions) {
    const tbody = document.getElementById("transactionsBody");
    tbody.innerHTML = "";

    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <p>No transactions found</p>
                </td>
            </tr>
        `;
        return;
    }

    transactions.reverse().forEach(transaction => {
        const row = document.createElement('tr');
        const isPositive = transaction.amount > 0;
        const typeClass = `type-${transaction.type.toLowerCase()}`;
        
        row.innerHTML = `
            <td>${formatDateTime(transaction.date)}</td>
            <td>${transaction.description || 'No description'}</td>
            <td class="transaction-amount ${isPositive ? 'amount-positive' : 'amount-negative'}">
                ${isPositive ? '+' : ''}₪${formatCurrency(Math.abs(transaction.amount))}
            </td>
            <td><span class="transaction-type ${typeClass}">${transaction.type}</span></td>
        `;
        
        tbody.appendChild(row);
    });
}

async function updateUserData() {
    try {
        const response = await fetch("/api/get_user_data", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id": localStorage.getItem("account_number")
            })
        });

        const data = await response.json();

        if (!data.status) {
            showNotification(data.text || 'Failed to load account data', 'error');
            return false;
        }

        // Update balance
        document.getElementById("balanceAmount").textContent = formatCurrency(data.balance);
        
        // Update user name if provided
        if (data.user_name) {
            document.getElementById("welcomeMessage").textContent = `Welcome, ${data.user_name}`;
            document.getElementById("welcomeTitle").textContent = `Welcome Back, ${data.user_name.split(' ')[0]}`;
            
            // Update avatar with initials
            const initials = data.user_name.split(' ').map(n => n[0]).join('').toUpperCase();
            document.getElementById("userAvatar").textContent = initials;
        }

        // Update transactions
        showTransactions(data.transactions);
        updateLastUpdatedTime();

        return true;
    } catch (error) {
        showNotification('Connection error. Please try again.', 'error');
        return false;
    }
}

// Modal actions
function showWithdrawModal() {
    showModal('withdrawModal');
}

function showDepositModal() {
    showModal('depositModal');
}

function goToTransfer() {
    window.location.href = '/page/transfer';
}

// Transaction handlers
async function handleWithdraw(event) {
    event.preventDefault();
    
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const description = document.getElementById('withdrawDescription').value || 'ATM Withdrawal';

    if (!amount || amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }

    showLoading();
    closeModal('withdrawModal');

    try {
        const response = await fetch("/api/withdraw", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id": localStorage.getItem("account_number"),
                "amount": amount,
                "description": description
            })
        });

        const data = await response.json();

        if (!data.status) {
            showNotification(data.text || 'Withdrawal failed', 'error');
        } else {
            showNotification(`Successfully withdrew ₪${formatCurrency(amount)}`, 'success');
            document.getElementById("balanceAmount").textContent = formatCurrency(data.balance);
            showTransactions(data.transactions);
            updateLastUpdatedTime();
        }
    } catch (error) {
        showNotification('Connection error. Please try again.', 'error');
    }

    hideLoading();
    
    // Reset form
    document.getElementById('withdrawAmount').value = '';
    document.getElementById('withdrawDescription').value = '';
}

async function handleDeposit(event) {
    event.preventDefault();
    
    const amount = parseFloat(document.getElementById('depositAmount').value);
    const description = document.getElementById('depositDescription').value || 'Cash Deposit';

    if (!amount || amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }

    showLoading();
    closeModal('depositModal');

    try {
        const response = await fetch("/api/deposit", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id": localStorage.getItem("account_number"),
                "amount": amount,
                "description": description
            })
        });

        const data = await response.json();

        if (!data.status) {
            showNotification(data.text || 'Deposit failed', 'error');
        } else {
            showNotification(`Successfully deposited ₪${formatCurrency(amount)}`, 'success');
            document.getElementById("balanceAmount").textContent = formatCurrency(data.balance);
            showTransactions(data.transactions);
            updateLastUpdatedTime();
        }
    } catch (error) {
        showNotification('Connection error. Please try again.', 'error');
    }

    hideLoading();
    
    // Reset form
    document.getElementById('depositAmount').value = '';
    document.getElementById('depositDescription').value = '';
}

function logout() {
    // Clear stored data
    localStorage.removeItem('account_number');
    localStorage.removeItem('remembered_id');
    localStorage.removeItem('remembered_password');
    localStorage.removeItem('remember_me');
    
    // Show logout message and redirect
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = '/';
    }, 1000);
}

// Initialize page
window.addEventListener('DOMContentLoaded', async function() {
    const accountId = localStorage.getItem("account_number");
    if (!accountId) {
        window.location.href = '/';
        return;
    }

    document.getElementById("accountNumber").textContent = accountId;
    await updateUserData();

    // Close modals when clicking outside
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('show');
        }
    });

    // Add keyboard escape to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                modal.classList.remove('show');
            });
        }
    });
});
async function showAllTransactions() {
    showModal('allTransactionsModal');
    
    try {
        const response = await fetch("/api/get_user_data", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id": localStorage.getItem("account_number")
            })
        });

        const data = await response.json();

        if (!data.status) {
            showAllTransactionsError('Failed to load transactions');
            return;
        }

        // Show all transactions in the modal
        showAllTransactionsData(data.transactions);
        
    } catch (error) {
        showAllTransactionsError('Connection error. Please try again.');
    }
}

function showAllTransactionsData(transactions) {
    const tbody = document.getElementById("allTransactionsBody");
    tbody.innerHTML = "";

    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <p>No transactions found</p>
                </td>
            </tr>
        `;
        return;
    }

    // Show all transactions (reversed for newest first)
    transactions.reverse().forEach(transaction => {
        const row = document.createElement('tr');
        const isPositive = transaction.amount > 0;
        const typeClass = `type-${transaction.type.toLowerCase()}`;
        
        row.innerHTML = `
            <td>${formatDateTime(transaction.date)}</td>
            <td>${transaction.description || 'No description'}</td>
            <td class="transaction-amount ${isPositive ? 'amount-positive' : 'amount-negative'}">
                ${isPositive ? '+' : ''}₪${formatCurrency(Math.abs(transaction.amount))}
            </td>
            <td><span class="transaction-type ${typeClass}">${transaction.type}</span></td>
        `;
        
        tbody.appendChild(row);
    });
}

function showAllTransactionsError(message) {
    const tbody = document.getElementById("allTransactionsBody");
    tbody.innerHTML = `
        <tr>
            <td colspan="4" class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </td>
        </tr>
    `;
}