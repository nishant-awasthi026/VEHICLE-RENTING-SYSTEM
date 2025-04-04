document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
  
    const vehicleForm = document.getElementById('vehicleForm');
    const vehicleList = document.getElementById('vehicleList');
  
    if (vehicleForm) {
      vehicleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const vehicle = {
          make: document.getElementById('make').value,
          model: document.getElementById('model').value,
          year: document.getElementById('year').value,
          type: document.getElementById('type').value,
          licensePlate: document.getElementById('licensePlate').value,
          description: document.getElementById('description').value,
          pricePerDay: document.getElementById('pricePerDay').value,
          location: document.getElementById('location').value
        };
        const response = await fetch('http://localhost:3000/vehicles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify(vehicle)
        });
        const data = await response.json();
        if (response.ok) {
          window.location.href = 'owner-dashboard.html';
        } else {
          alert(data.error || 'Failed to add vehicle');
        }
      });
    }
  
    if (vehicleList) {
      const response = await fetch('http://localhost:3000/vehicles', {
        headers: { 'Authorization': token }
      });
      const vehicles = await response.json();
      vehicles.forEach(vehicle => {
        const li = document.createElement('li');
        li.textContent = `${vehicle.Make} ${vehicle.Model} - ${vehicle.Location} ($${vehicle.PricePerDay}/day)`;
        if (window.location.pathname.includes('vehicle-search.html')) {
          const bookLink = document.createElement('a');
          bookLink.href = `booking.html?vehicleId=${vehicle.VehicleID}`;
          bookLink.textContent = ' Book';
          li.appendChild(bookLink);
        }
        vehicleList.appendChild(li);
      });
    }
  });