const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Helper functions to read and write JSON files
const readJsonFile = (filePath) => {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Admin authentication
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  const users = readJsonFile('users.json');
  const user = users.find((u) => u.username === username && u.password === password);
  
  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

// CRUD operations for items
app.get('/items', (req, res) => {
  const items = readJsonFile('items.json');
  res.json(items);
});

app.post('/items', (req, res) => {
  const items = readJsonFile('items.json');
  const newItem = req.body;
  newItem.id = items.length ? items[items.length - 1].id + 1 : 1;
  newItem.ratings = []; // Initialize ratings as an empty array
  items.push(newItem);
  writeJsonFile('items.json', items);
  res.json(newItem);
});

app.put('/items/:id', (req, res) => {
  const items = readJsonFile('items.json');
  const index = items.findIndex((item) => item.id === parseInt(req.params.id));
  
  if (index !== -1) {
    items[index] = { ...items[index], ...req.body };
    writeJsonFile('items.json', items);
    res.json(items[index]);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

app.delete('/items/:id', (req, res) => {
  let items = readJsonFile('items.json');
  items = items.filter((item) => item.id !== parseInt(req.params.id));
  writeJsonFile('items.json', items);
  res.json({ message: 'Item deleted' });
});

// Add rating to an item
app.post('/items/:id/rate', (req, res) => {
  const items = readJsonFile('items.json');
  const item = items.find((item) => item.id === parseInt(req.params.id));
  
  if (item) {
    const rating = req.body.rating;
    if (rating >= 1 && rating <= 5) {
      item.ratings.push(rating);
      writeJsonFile('items.json', items);
      res.json(item);
    } else {
      res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Serve index.html at root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve admin.html at /admin URL
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Serve items.html at /items URL
app.get('/items', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'items.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
