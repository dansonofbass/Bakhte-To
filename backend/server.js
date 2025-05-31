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
  slots: [0, 0, 0]
};

// Discount code management
const discountCodes = new Map(); // Store active discount codes
const usedCodes = new Set(); // Store used discount codes
const userReactions = new Map(); // Store user reactions to discounts

// Game state management
const gameStates = new Map();

// Function to generate a random discount code
function generateDiscountCode() {
  const restaurants = [
    { name: "Restaurant A", discount: "20% off", type: "restaurant", reaction: "😋" },
    { name: "Restaurant B", discount: "15% off", type: "restaurant", reaction: "🍽️" },
    { name: "Restaurant C", discount: "25% off", type: "restaurant", reaction: "👨‍🍳" },
    { name: "Restaurant D", discount: "30% off", type: "restaurant", reaction: "🍕" },
    { name: "Restaurant E", discount: "10% off", type: "restaurant", reaction: "🍜" },
    { name: "Coffee Shop A", discount: "Free Coffee", type: "cafe", reaction: "☕" },
    { name: "Coffee Shop B", discount: "Buy 1 Get 1 Free", type: "cafe", reaction: "🥤" },
    { name: "Cinema X", discount: "2 Free Movie Tickets", type: "entertainment", reaction: "🎬" },
    { name: "Bowling Alley", discount: "Free Game", type: "entertainment", reaction: "🎳" },
    { name: "Shopping Mall", discount: "50% off on any purchase", type: "shopping", reaction: "🛍️" },
    { name: "Gym Center", discount: "1 Month Free Membership", type: "fitness", reaction: "💪" },
    { name: "Spa Center", discount: "Free Massage", type: "wellness", reaction: "💆‍♀️" }
  ];
  
  const randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
  const code = Array.from({length: 10}, () => Math.floor(Math.random() * 10)).join('');
  
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 1);
  
  return {
    code,
    restaurant: randomRestaurant.name,
    discount: randomRestaurant.discount,
    type: randomRestaurant.type,
    reaction: randomRestaurant.reaction,
    timestamp: Date.now(),
    expiresAt: expirationDate.toISOString()
  };
}

// Function to invalidate previous code for a user
function invalidatePreviousCode(userId) {
  if (discountCodes.has(userId)) {
    const oldCode = discountCodes.get(userId);
    usedCodes.add(oldCode.code);
    discountCodes.delete(userId);
  }
}

// Endpoint to generate new discount code
app.post('/api/discount/generate', (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Invalidate previous code if exists
    invalidatePreviousCode(userId);

    // Generate new code
    const newCode = generateDiscountCode();
    discountCodes.set(userId, newCode);

    // Return only the preview information
    res.json({
      restaurant: newCode.restaurant,
      discount: newCode.discount,
      type: newCode.type,
      reaction: newCode.reaction
    });
  } catch (error) {
    console.error('Error generating discount code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get full discount code details
app.post('/api/discount/details', (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const codeDetails = discountCodes.get(userId);
    if (!codeDetails) {
      return res.status(404).json({ error: 'No active discount code found' });
    }

    res.json(codeDetails);
  } catch (error) {
    console.error('Error getting discount details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to claim discount code
app.post('/api/discount/claim', (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const codeDetails = discountCodes.get(userId);
    if (!codeDetails) {
      return res.status(404).json({ error: 'No active discount code found' });
    }

    // Mark code as used
    usedCodes.add(codeDetails.code);
    discountCodes.delete(userId);

    res.json({ 
      success: true, 
      message: 'Code claimed successfully',
      code: codeDetails.code,
      restaurant: codeDetails.restaurant,
      discount: codeDetails.discount
    });
  } catch (error) {
    console.error('Error claiming discount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to decline discount code
app.post('/api/discount/decline', (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const codeDetails = discountCodes.get(userId);
    if (!codeDetails) {
      return res.status(404).json({ error: 'No active discount code found' });
    }

    // Mark code as used
    usedCodes.add(codeDetails.code);
    discountCodes.delete(userId);

    res.json({ 
      success: true, 
      message: 'Code declined successfully'
    });
  } catch (error) {
    console.error('Error declining discount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({ message: 'Server is running' });
});

// Function to generate game state
function generateGameState(gameType) {
  const state = {
    id: Date.now().toString(),
    createdAt: new Date(),
    gameType,
    isActive: true,
    // Initialize game-specific state
    slots: gameType === 'slots' ? [0, 0, 0] : undefined
  };
  
  gameStates.set(state.id, state);
  return state;
}

// Function to validate game state
function validateGameState(gameId) {
  const state = gameStates.get(gameId);
  if (!state) {
    return false;
  }
  return state.isActive;
}

// Function to generate random number between min and max
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Enhanced slots endpoint
app.post('/api/slots/spin', (req, res) => {
  try {
    const { userId } = req.body;
    let currentGameId = req.body.gameId;
    
    // Create new game state if needed
    if (!currentGameId || !validateGameState(currentGameId)) {
      const newState = generateGameState('slots');
      currentGameId = newState.id;
    }
    
    if (userId) {
      invalidatePreviousCode(userId);
    }
    
    const newSlots = [
      getRandomNumber(0, 4),
      getRandomNumber(0, 4),
      getRandomNumber(0, 4)
    ];
    
    const isWin = newSlots[0] === newSlots[1] && newSlots[1] === newSlots[2];
    
    // Update game state
    gameStates.set(currentGameId, {
      id: currentGameId,
      createdAt: new Date(),
      gameType: 'slots',
      slots: newSlots,
      isWin,
      isActive: true
    });
    
    res.json({ 
      gameId: currentGameId,
      slots: newSlots,
      isWin,
      winType: isWin ? 'BINGO' : null
    });
  } catch (error) {
    console.error('Error in slots spin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Game logic endpoints
app.post('/api/game/check-win', (req, res) => {
  try {
    const { gameType, gameData } = req.body;
    let isWin = false;
    let winType = null;

    if (gameType === 'slots') {
      isWin = gameData.slots[0] === gameData.slots[1] && gameData.slots[1] === gameData.slots[2];
      winType = isWin ? 'BINGO' : null;
    }

    res.json({ isWin, winType });
  } catch (error) {
    console.error('Error checking win:', error);
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
  console.log('- POST /api/discount/generate');
  console.log('- POST /api/discount/details');
  console.log('- POST /api/discount/claim');
  console.log('- POST /api/discount/decline');
}); 