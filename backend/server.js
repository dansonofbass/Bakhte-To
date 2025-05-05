const express = require('express');
const cors = require('cors');

const app = express();
const port = 5173;  // Changed to port 5173

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5174',  // Updated to allow frontend on port 5174
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Game state
const gameState = {
  slots: [0, 0, 0],
  roulette: null,
  blackjack: {
    playerCards: [],
    dealerCards: [],
    score: 0
  }
};

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({ message: 'Server is running' });
});

// Slots endpoints
app.post('/api/slots/spin', (req, res) => {
  try {
    console.log('Received slots spin request');
    const newSlots = [
      Math.floor(Math.random() * 3),
      Math.floor(Math.random() * 3),
      Math.floor(Math.random() * 3)
    ];
    gameState.slots = newSlots;
    console.log('Sending response:', { slots: newSlots });
    res.json({ slots: newSlots });
  } catch (error) {
    console.error('Error in slots spin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Roulette endpoints
app.post('/api/roulette/spin', (req, res) => {
  try {
    console.log('Received roulette spin request');
    const number = Math.floor(Math.random() * 37);
    gameState.roulette = number;
    console.log('Sending response:', { number });
    res.json({ number });
  } catch (error) {
    console.error('Error in roulette spin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/roulette/color', (req, res) => {
  try {
    console.log('Received roulette color request:', req.body);
    const { color } = req.body;
    gameState.roulette = color;
    console.log('Sending response:', { color });
    res.json({ color });
  } catch (error) {
    console.error('Error in roulette color:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Blackjack endpoints
app.post('/api/blackjack/deal', (req, res) => {
  try {
    console.log('Received blackjack deal request');
    const newPlayerCards = [
      Math.floor(Math.random() * 10) + 1,
      Math.floor(Math.random() * 10) + 1
    ];
    const newDealerCards = [
      Math.floor(Math.random() * 10) + 1,
      Math.floor(Math.random() * 10) + 1
    ];
    
    gameState.blackjack = {
      playerCards: newPlayerCards,
      dealerCards: newDealerCards,
      score: newPlayerCards.reduce((a, b) => a + b, 0)
    };
    
    console.log('Sending response:', gameState.blackjack);
    res.json(gameState.blackjack);
  } catch (error) {
    console.error('Error in blackjack deal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/blackjack/hit', (req, res) => {
  try {
    console.log('Received blackjack hit request');
    const newCard = Math.floor(Math.random() * 10) + 1;
    gameState.blackjack.playerCards.push(newCard);
    gameState.blackjack.score += newCard;
    
    console.log('Sending response:', gameState.blackjack);
    res.json(gameState.blackjack);
  } catch (error) {
    console.error('Error in blackjack hit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('- GET  /api/test');
  console.log('- POST /api/slots/spin');
  console.log('- POST /api/roulette/spin');
  console.log('- POST /api/roulette/color');
  console.log('- POST /api/blackjack/deal');
  console.log('- POST /api/blackjack/hit');
}); 