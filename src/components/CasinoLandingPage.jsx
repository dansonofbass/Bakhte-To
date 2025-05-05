import React, { useState } from 'react'

const CasinoLandingPage = () => {
  const [gameState, setGameState] = useState({
    slots: [0, 0, 0],
    roulette: null,
    blackjack: {
      playerCards: [],
      dealerCards: [],
      score: 0,
    }
  })

  const spinSlots = () => {
    const newSlots = gameState.slots.map(() => Math.floor(Math.random() * 3))
    setGameState({ ...gameState, slots: newSlots })
  }

  const spinRoulette = () => {
    const number = Math.floor(Math.random() * 37)
    setGameState({ ...gameState, roulette: number })
  }

  const dealBlackjack = () => {
    const newPlayerCards = [
      Math.floor(Math.random() * 10) + 1,
      Math.floor(Math.random() * 10) + 1
    ]
    const newDealerCards = [
      Math.floor(Math.random() * 10) + 1,
      Math.floor(Math.random() * 10) + 1
    ]
    setGameState({
      ...gameState,
      blackjack: {
        playerCards: newPlayerCards,
        dealerCards: newDealerCards,
        score: newPlayerCards.reduce((a, b) => a + b, 0)
      }
    })
  }

  return (
    <div className="min-h-screen bg-pixel-black font-pixel text-pixel-white p-4">
      <header className="text-center mb-8">
        <h1 className="text-2xl text-pixel-red mb-2">PIXEL CASINO</h1>
        <p className="text-pixel-grey text-sm">Press SPACE to play</p>
      </header>

      <main className="max-w-2xl mx-auto space-y-8">
        {/* Slots Game */}
        <section className="bg-pixel-grey p-4 rounded">
          <h2 className="text-pixel-white text-center mb-4">SLOTS</h2>
          <div className="flex justify-center space-x-4 mb-4">
            {gameState.slots.map((slot, index) => (
              <div key={index} className="w-16 h-16 bg-pixel-white flex items-center justify-center text-pixel-black text-2xl">
                {slot}
              </div>
            ))}
          </div>
          <button 
            onClick={spinSlots}
            className="w-full bg-pixel-red text-pixel-white py-2 rounded hover:bg-red-600 transition"
          >
            SPIN
          </button>
        </section>

        {/* Roulette Game */}
        <section className="bg-pixel-grey p-4 rounded">
          <h2 className="text-pixel-white text-center mb-4">ROULETTE</h2>
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 bg-pixel-white flex items-center justify-center text-pixel-black text-4xl">
              {gameState.roulette !== null ? gameState.roulette : '?'}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button 
              onClick={() => setGameState({ ...gameState, roulette: 'RED' })}
              className="bg-pixel-red text-pixel-white py-2 rounded"
            >
              RED
            </button>
            <button 
              onClick={() => setGameState({ ...gameState, roulette: 'BLACK' })}
              className="bg-pixel-black text-pixel-white py-2 rounded"
            >
              BLACK
            </button>
          </div>
          <button 
            onClick={spinRoulette}
            className="w-full bg-pixel-blue text-pixel-white py-2 rounded hover:bg-blue-600 transition"
          >
            SPIN
          </button>
        </section>

        {/* Blackjack Game */}
        <section className="bg-pixel-grey p-4 rounded">
          <h2 className="text-pixel-white text-center mb-4">BLACKJACK</h2>
          <div className="mb-4">
            <div className="text-center mb-2">Dealer: {gameState.blackjack.dealerCards.join(', ')}</div>
            <div className="text-center mb-2">Player: {gameState.blackjack.playerCards.join(', ')}</div>
            <div className="text-center">Score: {gameState.blackjack.score}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={dealBlackjack}
              className="bg-pixel-white text-pixel-black py-2 rounded"
            >
              DEAL
            </button>
            <button 
              onClick={() => {
                const newCard = Math.floor(Math.random() * 10) + 1
                setGameState({
                  ...gameState,
                  blackjack: {
                    ...gameState.blackjack,
                    playerCards: [...gameState.blackjack.playerCards, newCard],
                    score: gameState.blackjack.score + newCard
                  }
                })
              }}
              className="bg-pixel-white text-pixel-black py-2 rounded"
            >
              HIT
            </button>
          </div>
        </section>
      </main>

      <footer className="text-center mt-8 text-pixel-grey text-xs">
        <p>© 2024 PIXEL CASINO</p>
        <p>PRESS ESC TO EXIT</p>
      </footer>
    </div>
  )
}

export default CasinoLandingPage