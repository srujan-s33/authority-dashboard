// DOM Elements
const loginForm = document.getElementById('loginForm');
const passwordToggle = document.getElementById('passwordToggle');
const passwordInput = document.getElementById('password');
const twoFAModal = document.getElementById('twoFAModal');
const codeInputs = document.querySelectorAll('.code-input');
const verifyCodeBtn = document.getElementById('verifyCode');
const resendCodeBtn = document.getElementById('resendCode');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const alertContainer = document.getElementById('alertContainer');

// Password visibility toggle
passwordToggle.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    
    // Update icon
    const eyeIcon = passwordToggle.querySelector('svg');
    if (type === 'text') {
        eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.39 1 12A18.45 18.45 0 0 1 5.06 5.06L17.94 17.94Z" stroke="currentColor" stroke-width="2"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4C19 4 23 12 23 12A18.5 18.5 0 0 1 19.42 18.42L9.9 4.24Z" stroke="currentColor" stroke-width="2"/>
            <path d="M1 1L23 23" stroke="currentColor" stroke-width="2"/>
        `;
    } else {
        eyeIcon.innerHTML = `
            <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
        `;
    }
});

// Login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate login process
    showAlert('Authenticating...', 'warning');
    
    setTimeout(() => {
        // Simulate successful login that requires 2FA
        showAlert('Login successful! Please complete two-factor authentication.', 'success');
        showTwoFAModal();
    }, 1500);
});

// Two-Factor Authentication Modal
function showTwoFAModal() {
    twoFAModal.classList.add('active');
    codeInputs[0].focus();
}

function hideTwoFAModal() {
    twoFAModal.classList.remove('active');
    // Clear code inputs
    codeInputs.forEach(input => input.value = '');
}

// Code input navigation
codeInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        const value = e.target.value;
        
        // Only allow numbers
        if (!/^\d$/.test(value)) {
            e.target.value = '';
            return;
        }
        
        // Move to next input
        if (value && index < codeInputs.length - 1) {
            codeInputs[index + 1].focus();
        }
        
        // Auto-verify if all inputs are filled
        const allFilled = Array.from(codeInputs).every(input => input.value);
        if (allFilled) {
            setTimeout(() => verifyCode(), 500);
        }
    });
    
    input.addEventListener('keydown', (e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !input.value && index > 0) {
            codeInputs[index - 1].focus();
        }
        
        // Handle paste
        if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            navigator.clipboard.readText().then(text => {
                const digits = text.replace(/\D/g, '').slice(0, 6);
                digits.split('').forEach((digit, i) => {
                    if (codeInputs[i]) {
                        codeInputs[i].value = digit;
                    }
                });
                if (digits.length === 6) {
                    setTimeout(() => verifyCode(), 500);
                }
            });
        }
    });
});

// Verify 2FA code
function verifyCode() {
    const code = Array.from(codeInputs).map(input => input.value).join('');
    
    if (code.length !== 6) {
        showAlert('Please enter the complete 6-digit code', 'error');
        return;
    }
    
    showAlert('Verifying code...', 'warning');
    
    setTimeout(() => {
        // Simulate verification
        if (code === '303030') { // Demo code
            showAlert('Verification successful! Welcome to the dashboard.', 'success');
            hideTwoFAModal();
            // Redirect to dashboard
            setTimeout(() => {
                showAlert('Redirecting to dashboard...', 'success');
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showAlert('Invalid code. Please try again.', 'error');
            codeInputs.forEach(input => input.value = '');
            codeInputs[0].focus();
        }
    }, 1500);
}

verifyCodeBtn.addEventListener('click', verifyCode);

// Resend code
resendCodeBtn.addEventListener('click', () => {
    showAlert('New verification code sent!', 'success');
    codeInputs.forEach(input => input.value = '');
    codeInputs[0].focus();
});

// Close modal on outside click
twoFAModal.addEventListener('click', (e) => {
    if (e.target === twoFAModal) {
        hideTwoFAModal();
    }
});

// Forgot password
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    showAlert('Password reset instructions will be sent to your email.', 'success');
});

// Alert system
function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;
    
    alertContainer.appendChild(alert);
    
    // Trigger show animation
    setTimeout(() => alert.classList.add('show'), 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close modal
    if (e.key === 'Escape' && twoFAModal.classList.contains('active')) {
        hideTwoFAModal();
    }
    
    // Enter to verify 2FA code
    if (e.key === 'Enter' && twoFAModal.classList.contains('active')) {
        verifyCode();
    }
});

// Form validation enhancement
const inputs = document.querySelectorAll('input[required]');
inputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (!input.value.trim()) {
            input.style.borderColor = 'var(--alert-red)';
        } else {
            input.style.borderColor = 'var(--gray-200)';
        }
    });
    
    input.addEventListener('input', () => {
        if (input.style.borderColor === 'var(--alert-red)' && input.value.trim()) {
            input.style.borderColor = 'var(--gray-200)';
        }
    });
});

// Initialize demo
document.addEventListener('DOMContentLoaded', () => {
    // Show welcome message
    setTimeout(() => {
        showAlert('Demo: Use any credentials to login. 2FA code: 303030', 'warning');
    }, 1000);
});