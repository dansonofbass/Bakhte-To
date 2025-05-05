import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5173/api'

function App() {
  const [activeGame, setActiveGame] = useState(null)
  const [slots, setSlots] = useState([0, 0, 0])
  const [roulette, setRoulette] = useState(null)
  const [blackjack, setBlackjack] = useState({
    playerCards: [],
    dealerCards: [],
    score: 0
  })
  const [error, setError] = useState(null)
  const [winMessage, setWinMessage] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Handle message dismissal
  useEffect(() => {
    const handleDismiss = () => {
      if (winMessage || error) {
        setWinMessage(null)
        setError(null)
      }
    }

    // Add event listeners for click and keypress
    document.addEventListener('click', handleDismiss)
    document.addEventListener('keydown', handleDismiss)

    // Cleanup
    return () => {
      document.removeEventListener('click', handleDismiss)
      document.removeEventListener('keydown', handleDismiss)
    }
  }, [winMessage, error])

  useEffect(() => {
    const testServer = async () => {
      try {
        const response = await fetch(`${API_URL}/test`)
        if (!response.ok) {
          throw new Error('Server is not responding')
        }
        console.log('Server is running')
      } catch (error) {
        console.error('Server connection error:', error)
        setError('Server is not running. Please start the backend server.')
      }
    }
    testServer()
  }, [])

  const spinSlots = async () => {
    try {
      setError(null)
      setWinMessage(null)
      setIsAnimating(true)
      console.log('Spinning slots...')
      const response = await fetch(`${API_URL}/slots/spin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Slots response:', data)
      setSlots(data.slots)
      

      if (data.slots[0] === data.slots[1] && data.slots[1] === data.slots[2]) {
        setWinMessage('JACKPOT! TRIPLE MATCH!')
      }
      setTimeout(() => setIsAnimating(false), 300)
    } catch (error) {
      console.error('Error spinning slots:', error)
      setError('Failed to spin slots. Is the server running?')
      setIsAnimating(false)
    }
  }

  const spinRoulette = async () => {
    try {
      setError(null)
      setWinMessage(null)
      setIsAnimating(true)
      console.log('Spinning roulette...')
      const response = await fetch(`${API_URL}/roulette/spin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Roulette response:', data)
      setRoulette(data.number)
      

      if (data.number === 0) {
        setWinMessage('LUCKY ZERO!')
      } else if (data.number % 2 === 0) {
        setWinMessage('EVEN WIN!')
      } else {
        setWinMessage('ODD WIN!')
      }
      setTimeout(() => setIsAnimating(false), 300)
    } catch (error) {
      console.error('Error spinning roulette:', error)
      setError('Failed to spin roulette. Is the server running?')
      setIsAnimating(false)
    }
  }

  const setRouletteColor = async (color) => {
    try {
      setError(null)
      console.log('Setting roulette color:', color)
      const response = await fetch(`${API_URL}/roulette/color`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ color }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Roulette color response:', data)
      setRoulette(data.color)
    } catch (error) {
      console.error('Error setting roulette color:', error)
      setError('Failed to set roulette color. Is the server running?')
    }
  }

  const dealBlackjack = async () => {
    try {
      setError(null)
      setWinMessage(null)
      console.log('Dealing blackjack...')
      const response = await fetch(`${API_URL}/blackjack/deal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Blackjack deal response:', data)
      setBlackjack(data)
      

      if (data.score === 21) {
        setWinMessage('BLACKJACK!')
      }
    } catch (error) {
      console.error('Error dealing blackjack:', error)
      setError('Failed to deal blackjack. Is the server running?')
    }
  }

  const hitBlackjack = async () => {
    try {
      setError(null)
      setWinMessage(null)
      console.log('Hitting blackjack...')
      const response = await fetch(`${API_URL}/blackjack/hit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Blackjack hit response:', data)
      setBlackjack(data)
      

      if (data.score === 21) {
        setWinMessage('BLACKJACK!')
      } else if (data.score > 21) {
        setWinMessage('BUST!')
      }
    } catch (error) {
      console.error('Error hitting blackjack:', error)
      setError('Failed to hit blackjack. Is the server running?')
    }
  }

  return (
    <div className="min-h-screen bg-pixel-black p-4 flex items-center justify-center">
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded font-pixel animate-shake">
          {error}
        </div>
      )}
      
      {winMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-pixel-grey/70 text-pixel-white px-8 py-6 rounded-lg font-pixel text-3xl animate-win">
            {winMessage}
          </div>
        </div>
      )}
      
      {!activeGame ? (
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-pixel-red text-4xl font-pixel mb-12 animate-float">
            <span className="inline-block animate-bounce">B</span>
            <span className="inline-block animate-bounce delay-100">A</span>
            <span className="inline-block animate-bounce delay-200">K</span>
            <span className="inline-block animate-bounce delay-300">H</span>
            <span className="inline-block animate-bounce delay-400">T</span>
            <span className="inline-block animate-bounce delay-500">E</span>
            <span className="inline-block animate-bounce delay-600">T</span>
            <span className="inline-block animate-bounce delay-700">O</span>
          </h1>
          <div className="space-y-6 max-w-md mx-auto">
            <button 
              onClick={() => setActiveGame('slots')}
              className="w-full bg-pixel-red text-pixel-white px-8 py-4 rounded font-pixel hover:bg-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 active:scale-95 active:animate-shake"
            >
              SLOTS
            </button>
            <button 
              onClick={() => setActiveGame('roulette')}
              className="w-full bg-pixel-blue text-pixel-white px-8 py-4 rounded font-pixel hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 active:scale-95 active:animate-shake"
            >
              ROULETTE
            </button>
            <button 
              onClick={() => setActiveGame('blackjack')}
              className="w-full bg-pixel-white text-pixel-black px-8 py-4 rounded font-pixel hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-white/50 active:scale-95 active:animate-shake"
            >
              BLACKJACK
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl w-full mx-auto">
          <button 
            onClick={() => setActiveGame(null)}
            className="mb-4 text-pixel-grey font-pixel hover:text-pixel-white transition-all duration-300 hover:scale-105 active:scale-95"
          >
            ← BACK TO MENU
          </button>

          {activeGame === 'slots' && (
            <div className="bg-pixel-grey p-6 rounded animate-float">
              <h2 className="text-pixel-white text-2xl font-pixel text-center mb-6 animate-glow">SLOTS</h2>
              <div className="flex justify-center space-x-4 mb-6">
                {slots.map((slot, index) => (
                  <div 
                    key={index} 
                    className={`w-20 h-20 bg-pixel-white flex items-center justify-center text-pixel-black text-3xl font-pixel border-4 border-pixel-black transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/50 ${isAnimating ? 'animate-buzz' : ''}`}
                  >
                    {slot}
                  </div>
                ))}
              </div>
              <button 
                onClick={spinSlots}
                className="w-full bg-pixel-red text-pixel-white py-4 rounded font-pixel hover:bg-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 active:scale-95 active:animate-shake"
              >
                SPIN
              </button>
            </div>
          )}

          {activeGame === 'roulette' && (
            <div className="bg-pixel-grey p-6 rounded animate-float">
              <h2 className="text-pixel-white text-2xl font-pixel text-center mb-6 animate-glow">ROULETTE</h2>
              <div className="flex justify-center mb-6">
                <div className={`w-32 h-32 bg-pixel-white flex items-center justify-center text-pixel-black text-4xl font-pixel border-4 border-pixel-black transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/50 ${isAnimating ? 'animate-buzz' : ''}`}>
                  {roulette !== null ? roulette : '?'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button 
                  onClick={() => setRouletteColor('RED')}
                  className="bg-pixel-red text-pixel-white py-4 rounded font-pixel hover:bg-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 active:scale-95 active:animate-shake"
                >
                  RED
                </button>
                <button 
                  onClick={() => setRouletteColor('BLACK')}
                  className="bg-pixel-black text-pixel-white py-4 rounded font-pixel hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-black/50 active:scale-95 active:animate-shake"
                >
                  BLACK
                </button>
              </div>
              <button 
                onClick={spinRoulette}
                className="w-full bg-pixel-blue text-pixel-white py-4 rounded font-pixel hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 active:scale-95 active:animate-shake"
              >
                SPIN
              </button>
            </div>
          )}

          {activeGame === 'blackjack' && (
            <div className="bg-pixel-grey p-6 rounded animate-float">
              <h2 className="text-pixel-white text-2xl font-pixel text-center mb-6 animate-glow">BLACKJACK</h2>
              <div className="space-y-4 mb-6">
                <div className={`bg-pixel-black p-4 rounded transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/50 ${isAnimating ? 'animate-buzz' : ''}`}>
                  <p className="text-pixel-white font-pixel text-center">Dealer: {blackjack.dealerCards.join(', ')}</p>
                </div>
                <div className={`bg-pixel-black p-4 rounded transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/50 ${isAnimating ? 'animate-buzz' : ''}`}>
                  <p className="text-pixel-white font-pixel text-center">Player: {blackjack.playerCards.join(', ')}</p>
                  <p className="text-pixel-white font-pixel text-center mt-2">Score: {blackjack.score}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={dealBlackjack}
                  className="bg-pixel-white text-pixel-black py-4 rounded font-pixel hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-white/50 active:scale-95 active:animate-shake"
                >
                  DEAL
                </button>
                <button 
                  onClick={hitBlackjack}
                  className="bg-pixel-white text-pixel-black py-4 rounded font-pixel hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-white/50 active:scale-95 active:animate-shake"
                >
                  HIT
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App 