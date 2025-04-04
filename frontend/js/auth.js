document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
  
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const response = await fetch('http://localhost:3000/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.token);
          const decoded = JSON.parse(atob(data.token.split('.')[1])); // Decode JWT payload
          window.location.href = decoded.role === 'Owner' ? 'owner-dashboard.html' : 'renter-dashboard.html';
        } else {
          alert(data.message);
        }
      });
    }
  
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const role = document.getElementById('role').value;
        const response = await fetch('http://localhost:3000/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, email, phone, role })
        });
        const data = await response.json();
        if (response.ok) {
          window.location.href = 'login.html';
        } else {
          alert(data.error);
        }
      });
    }
  });