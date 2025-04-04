document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
  
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
      const urlParams = new URLSearchParams(window.location.search);
      const vehicleId = urlParams.get('vehicleId');
      document.getElementById('vehicleId').value = vehicleId || '';
  
      bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const booking = {
          vehicleId: document.getElementById('vehicleId').value,
          startDate: document.getElementById('startDate').value,
          endDate: document.getElementById('endDate').value
        };
        const response = await fetch('http://localhost:3000/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify(booking)
        });
        const data = await response.json();
        if (response.ok) {
          window.location.href = 'renter-dashboard.html';
        } else {
          alert(data.message || 'Failed to book vehicle');
        }
      });
    }
  });