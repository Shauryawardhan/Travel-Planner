// DOM Elements
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginError = document.getElementById('login-error');
const loginSuccess = document.getElementById('login-success');
const signupError = document.getElementById('signup-error');
const signupSuccess = document.getElementById('signup-success');

// Tab switching functionality
loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  loginForm.style.display = 'block';
  signupForm.style.display = 'none';
  hideAlerts();
});

signupTab.addEventListener('click', () => {
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
  signupForm.style.display = 'block';
  loginForm.style.display = 'none';
  hideAlerts();
});

// Hide all alert messages
function hideAlerts() {
  loginError.style.display = 'none';
  loginSuccess.style.display = 'none';
  signupError.style.display = 'none';
  signupSuccess.style.display = 'none';
}

// Display an error message
function showError(element, message) {
  element.textContent = message;
  element.style.display = 'block';
}

// Display a success message
function showSuccess(element, message) {
  element.textContent = message;
  element.style.display = 'block';
}

// Login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideAlerts();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    // Send request to server
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Show error message from server
      showError(loginError, data.error || 'Login failed');
      return;
    }
    
    // Login successful
    showSuccess(loginSuccess, 'Login successful! Redirecting...');
    
    // Store user data (but not password) in session storage
    sessionStorage.setItem('user', JSON.stringify(data.user));
    
    // Redirect to dashboard after a delay
    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 1500);
    
  } catch (err) {
    showError(loginError, 'Network error. Please try again later.');
    console.error('Login error:', err);
  }
});

// Sign up form submission
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideAlerts();
  
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm-password').value;
  
  // Client-side validation
  if (password !== confirmPassword) {
    showError(signupError, 'Passwords do not match');
    return;
  }
  
  if (password.length < 6) {
    showError(signupError, 'Password must be at least 6 characters');
    return;
  }
  
  try {
    // Send request to server
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Show error message from server
      showError(signupError, data.error || 'Sign up failed');
      return;
    }
    
    // Sign up successful
    showSuccess(signupSuccess, 'Account created successfully! You can now log in.');
    
    // Clear form
    signupForm.reset();
    
    // Switch to login tab after a delay
    setTimeout(() => {
      loginTab.click();
    }, 2000);
    
  } catch (err) {
    showError(signupError, 'Network error. Please try again later.');
    console.error('Signup error:', err);
  }
});

// Check if user is already logged in
function checkAuthStatus() {
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (user) {
    // User is logged in, redirect to dashboard
    window.location.href = '/dashboard.html';
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', checkAuthStatus);