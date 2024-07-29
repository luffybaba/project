document.addEventListener('DOMContentLoaded', () => {
    const itemList = document.getElementById('item-list');
    
    // Fetch and display items
    const fetchItems = () => {
      fetch('/items')
        .then(response => response.json())
        .then(items => {
          itemList.innerHTML = '';
          items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
              <h3>${item.name}</h3>
              <p>${item.description}</p>
              <p>Ratings: ${item.ratings.join(', ') || 'No ratings yet'}</p>
              <form class="rating-form" data-id="${item.id}">
                <input type="number" min="1" max="5" placeholder="Rate 1-5" required>
                <button type="submit">Rate</button>
              </form>
            `;
            itemList.appendChild(itemDiv);
          });
  
          document.querySelectorAll('.rating-form').forEach(form => {
            form.addEventListener('submit', (e) => {
              e.preventDefault();
              const rating = form.querySelector('input').value;
              const itemId = form.getAttribute('data-id');
              fetch(`/items/${itemId}/rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating: parseInt(rating) })
              }).then(() => fetchItems());
            });
          });
        });
    };
  
    fetchItems();
  
    // Admin login
    const loginForm = document.getElementById('login-form');
    const adminPanel = document.getElementById('admin-panel');
  
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
  
        fetch('/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            loginForm.style.display = 'none';
            adminPanel.style.display = 'block';
            fetchItems();
          } else {
            alert('Invalid credentials');
          }
        });
      });
    }
  
    // Add new item
    const addItemForm = document.getElementById('add-item-form');
    
    if (addItemForm) {
      addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('item-name').value;
        const description = document.getElementById('item-description').value;
  
        fetch('/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description })
        }).then(() => {
          addItemForm.reset();
          fetchItems();
        });
      });
    }
  });
  