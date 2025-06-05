const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Slots endpoint
app.post('/api/slots/spin', (req, res) => {
  const slots = [
    Math.floor(Math.random() * 7),
    Math.floor(Math.random() * 7),
    Math.floor(Math.random() * 7)
  ];
  
  const isWin = slots[0] === slots[1] && slots[1] === slots[2];
  
  res.json({
    slots,
    isWin,
    gameId: Date.now()
  });
});

// Discount endpoints
app.post('/api/discount/generate', (req, res) => {
  const restaurants = [
    { name: 'Pizza Place', discount: '20% OFF', reaction: '🍕' },
    { name: 'Burger Joint', discount: '15% OFF', reaction: '🍔' },
    { name: 'Sushi Bar', discount: '25% OFF', reaction: '🍱' }
  ];
  
  const randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
  
  res.json({
    restaurant: randomRestaurant.name,
    discount: randomRestaurant.discount,
    reaction: randomRestaurant.reaction
  });
});

app.post('/api/discount/claim', (req, res) => {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  res.json({
    code,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });
});

app.post('/api/discount/decline', (req, res) => {
  res.json({ message: 'Discount declined' });
});

app.post('/api/discount/details', (req, res) => {
  res.json({
    code: 'TEST123',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 