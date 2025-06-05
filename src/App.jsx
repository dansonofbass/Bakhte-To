import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:3000/api'

function App() {
  const [activeGame, setActiveGame] = useState(null)
  const [slots, setSlots] = useState([0, 0, 0])
  const [error, setError] = useState(null)
  const [winMessage, setWinMessage] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [discountStatus, setDiscountStatus] = useState({
    remainingClaims: 0,
    hasActiveCode: false,
    activeCodeExpiresAt: null
  })
  const [discountCode, setDiscountCode] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const [discountDetails, setDiscountDetails] = useState(null)
  const [showWinModal, setShowWinModal] = useState(false)
  const [currentWinType, setCurrentWinType] = useState(null)
  const [discountAction, setDiscountAction] = useState(null)
  const [discountPreview, setDiscountPreview] = useState(null)
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [fullDiscountDetails, setFullDiscountDetails] = useState(null)
  const [showBingoModal, setShowBingoModal] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [gameId, setGameId] = useState(null)
  const [showContinueButton, setShowContinueButton] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [cooldowns, setCooldowns] = useState({
    slots: 0
  })

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

  // Auto-hide discount code after 20 seconds
  useEffect(() => {
    if (discountCode) {
      const timer = setTimeout(() => {
        setDiscountCode(null)
        setShowDiscountModal(false)
        setDiscountDetails(null)
      }, 20000)
      return () => clearTimeout(timer)
    }
  }, [discountCode])

  // Countdown effect
  useEffect(() => {
    let timer;
    if (showDiscountModal && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    } else if (countdown === 0) {
      handleDeclineDiscount()
    }
    return () => clearInterval(timer)
  }, [showDiscountModal, countdown])

  // Cooldown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCooldowns(prev => ({
        slots: Math.max(0, prev.slots - 1)
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

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

  const generateDiscountCode = async () => {
    try {
      const response = await fetch(`${API_URL}/discount/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'temp-user' })
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate discount code')
      }
      
      const data = await response.json()
      setDiscountPreview(data)
      
      // Show BINGO first
      setShowBingoModal(true)
      
      // After 2 seconds, hide BINGO and show discount
      setTimeout(() => {
        setShowBingoModal(false)
        setShowDiscountModal(true)
        setCountdown(30) // Reset countdown
      }, 2000)
    } catch (error) {
      console.error('Error generating discount code:', error)
      setError('Failed to generate discount code')
    }
  }

  const handleClaimClick = async () => {
    try {
      const response = await fetch(`${API_URL}/discount/details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'temp-user' })
      })
      
      if (!response.ok) {
        throw new Error('Failed to get discount details')
      }
      
      const data = await response.json()
      setFullDiscountDetails(data)
      setShowClaimModal(true)
    } catch (error) {
      console.error('Error getting discount details:', error)
      setError('Failed to get discount details')
    }
  }

  const handleClaimDiscount = async () => {
    try {
      const response = await fetch(`${API_URL}/discount/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'temp-user' })
      })
      
      if (!response.ok) {
        throw new Error('Failed to claim discount')
      }
      
      const data = await response.json()
      setShowDiscountModal(false)
      setDiscountPreview(null)
      setCountdown(30)
      setShowContinueButton(true)
      setFullDiscountDetails(data)
    } catch (error) {
      console.error('Error claiming discount:', error)
      setError('Failed to claim discount')
    }
  }

  const handleDeclineDiscount = async () => {
    try {
      const response = await fetch(`${API_URL}/discount/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'temp-user' })
      })
      
      if (!response.ok) {
        throw new Error('Failed to decline discount')
      }
      
      setShowDiscountModal(false)
      setDiscountPreview(null)
      setCountdown(30)
      setShowContinueButton(true)
      setWinMessage('One chance lost today, but maybe luck is on your side! 🍀')
      setTimeout(() => setWinMessage(null), 3000)
    } catch (error) {
      console.error('Error declining discount:', error)
      setError('Failed to decline discount')
    }
  }

  const copyDiscountCode = () => {
    if (fullDiscountDetails?.code) {
      navigator.clipboard.writeText(fullDiscountDetails.code)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const continueGame = () => {
    setShowDiscountModal(false)
    setDiscountPreview(null)
    setCountdown(30)
    setShowContinueButton(false)
    setFullDiscountDetails(null)
    setCopiedCode(false)
  }

  const startCooldown = (gameType) => {
    setCooldowns(prev => ({
      ...prev,
      [gameType]: 3
    }))
  }

  const spinSlots = async () => {
    if (cooldowns.slots > 0) return

    try {
      setError(null)
      setWinMessage(null)
      setIsAnimating(true)
      startCooldown('slots')
      
      const response = await fetch(`${API_URL}/slots/spin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: 'temp-user',
          gameId
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to spin slots')
      }
      
      const data = await response.json()
      setGameId(data.gameId)
      setSlots(data.slots)
      
      if (data.isWin) {
        setShowBingoModal(true)
        setTimeout(() => {
          setShowBingoModal(false)
          generateDiscountCode()
        }, 2000)
      }
      
      setTimeout(() => setIsAnimating(false), 300)
    } catch (error) {
      console.error('Error spinning slots:', error)
      setError('Failed to spin slots. Is the server running?')
      setIsAnimating(false)
    }
  }

  const getButtonClass = (gameType) => {
    const baseClass = "w-[clamp(250px,90%,300px)] mx-auto text-pixel-white px-8 py-4 rounded font-pixel transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:border-[3px] hover:border-white active:scale-95 active:animate-shake text-[clamp(14px,2vw,16px)]"
    const isDisabled = cooldowns[gameType] > 0
    
    if (gameType === 'slots') {
      return `${baseClass} ${isDisabled ? 'bg-[#4f4f4f] opacity-80 cursor-not-allowed' : 'bg-[#133e94] hover:bg-[#c20d0d] hover:shadow-[#c20d0d]/50'}`
    }
  }

  return (
    <div className="min-h-screen h-full bg-[#0d0d0d] p-4">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center px-[3%] py-4 z-50">
        {activeGame && (
          <button 
            onClick={() => setActiveGame(null)}
            className="text-[#fcfcfc]/50 font-pixel hover:text-[#fcfcfc]/75 transition-all duration-1000 text-[clamp(12px,1.5vw,15px)]"
          >
            ← BACK TO MENU
          </button>
        )}
        <div className="flex items-center gap-2 text-[#fcfcfc]/50 hover:text-[#fcfcfc]/75 transition-all duration-1000">
          <span className="font-pixel text-[clamp(12px,1.5vw,15px)]">Danial</span>
          <div className="w-[clamp(20px,3vw,32px)] h-[clamp(20px,3vw,32px)] rounded-full bg-[#1f1f1f] flex items-center justify-center">
            <svg className="w-[clamp(12px,2vw,20px)] h-[clamp(12px,2vw,20px)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded font-pixel animate-shake">
          {error}
        </div>
      )}
      
      {winMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-[#1f1f1f]/90 text-[#fcfcfc] px-8 py-6 rounded-lg font-pixel text-2xl animate-win w-[70%] text-center">
            {winMessage}
          </div>
        </div>
      )}
      
      {/* Main Content Container */}
      <div className="w-full h-[80vh] mt-24 flex items-center justify-center">
        <div className="w-full max-w-2xl h-full flex flex-col items-center justify-center gap-[10%] py-4">
          {!activeGame ? (
            <div className="w-full text-center flex flex-col items-center justify-center">
              <h1 className="text-[#fcfcfc]/95 text-[clamp(40px,8vw,70px)] font-pixel mb-[clamp(1.5rem,4vw,3rem)] transition-all duration-1000 hover:scale-105 hover:text-[#fcfcfc] hover:opacity-100 hover:drop-shadow-[0_0_10px_#fcfcfc] hover:stroke-[#1f1f1f]">
                <span className="inline-block animate-float-slow">B</span>
                <span className="inline-block animate-float-slow delay-100">A</span>
                <span className="inline-block animate-float-slow delay-200">K</span>
                <span className="inline-block animate-float-slow delay-300">H</span>
                <span className="inline-block animate-float-slow delay-400">T</span>
                <span className="inline-block animate-float-slow delay-500">E</span>
                <span className="inline-block animate-float-slow delay-600">T</span>
                <span className="inline-block animate-float-slow delay-700">O</span>
              </h1>
              
              <div className="text-[#fcfcfc] text-[clamp(12px,1.5vw,15px)] font-pixel mb-[clamp(2rem,4vw,3rem)] leading-relaxed">
                <p className="animate-text-shine">
                  <span className="inline-block animate-shine delay-0">P</span>
                  <span className="inline-block animate-shine delay-100">l</span>
                  <span className="inline-block animate-shine delay-200">a</span>
                  <span className="inline-block animate-shine delay-300">y</span>
                  <span className="inline-block animate-shine delay-400"> </span>
                  <span className="inline-block animate-shine delay-500">t</span>
                  <span className="inline-block animate-shine delay-600">o</span>
                  <span className="inline-block animate-shine delay-700"> </span>
                  <span className="inline-block animate-shine delay-800">E</span>
                  <span className="inline-block animate-shine delay-900">a</span>
                  <span className="inline-block animate-shine delay-1000">r</span>
                  <span className="inline-block animate-shine delay-1100">n</span>
                  <span className="inline-block animate-shine delay-1200">!</span>
                </p>
                <p className="mt-6 opacity-90">
                  Join our exciting gaming platform where every play brings you closer to amazing rewards. 
                  Play your favorite games, win discount codes, and enjoy exclusive benefits.
                </p>
              </div>

              <div className="flex justify-center items-center w-full">
                <button 
                  onClick={() => setActiveGame('slots')}
                  className={getButtonClass('slots')}
                  disabled={cooldowns.slots > 0}
                >
                  {cooldowns.slots > 0 ? `SLOTS (${cooldowns.slots}s)` : 'SLOTS'}
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center">
              {activeGame === 'slots' && (
                <div className="bg-[#1f1f1f]/90 p-6 rounded animate-float w-full flex flex-col items-center">
                  <h2 className="text-[#fcfcfc] text-[clamp(16px,2vw,24px)] font-pixel text-center mb-6">SLOTS</h2>
                  <div className="flex justify-center space-x-4 mb-6">
                    {slots.map((slot, index) => (
                      <div 
                        key={index} 
                        className={`w-[clamp(60px,15vw,80px)] h-[clamp(60px,15vw,80px)] bg-[#fcfcfc] flex items-center justify-center text-[#0d0d0d] text-[clamp(24px,4vw,32px)] font-pixel border-4 border-[#1f1f1f] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#fcfcfc]/50 ${isAnimating ? 'animate-buzz' : ''}`}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center items-center w-full">
                    <button 
                      onClick={spinSlots}
                      className={getButtonClass('slots')}
                      disabled={cooldowns.slots > 0}
                    >
                      {cooldowns.slots > 0 ? `SPIN (${cooldowns.slots}s)` : 'SPIN'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-pixel-grey p-6 rounded">
            <h2 className="text-pixel-white text-xl mb-4">Login</h2>
            <p className="text-pixel-white mb-4">
              You need to be logged in to claim a discount.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowLoginModal(false)}
                className="bg-pixel-grey text-pixel-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowLoginModal(false)
                  handleWin()
                }}
                className="bg-pixel-red text-pixel-white px-4 py-2 rounded"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {showWarningModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-pixel-grey p-6 rounded">
            <h2 className="text-pixel-white text-xl mb-4">Warning</h2>
            <p className="text-pixel-white mb-4">
              You have an active discount code. Claiming a new one will invalidate the old one.
            </p>
            <p className="text-pixel-white mb-4">
              Remaining claims: {discountStatus.remainingClaims}
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowWarningModal(false)}
                className="bg-pixel-grey text-pixel-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowWarningModal(false)
                  handleWin()
                }}
                className="bg-pixel-red text-pixel-white px-4 py-2 rounded"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BINGO Modal - Shows for 2 seconds with enhanced animation */}
      {showBingoModal && (
        <div className="fixed inset-0 bg-[#0d0d0d] bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#1f1f1f] p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4 text-center">
            <h2 className="text-7xl font-bold text-white mb-4 animate-pulse scale-150 stroke-[#c20d0d] stroke-[2px] drop-shadow-[0_0_10px_#133e94] hover:stroke-[#9518a3] hover:drop-shadow-[0_0_10px_#9518a3] transition-all duration-500">
              BINGO!
            </h2>
            <div className="text-4xl text-white animate-pulse">
              You Won!
            </div>
          </div>
        </div>
      )}

      {/* Discount Modal - After BINGO */}
      {showDiscountModal && discountPreview && (
        <div className="fixed inset-0 bg-[#0d0d0d] bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#1f1f1f] p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4 flex flex-col items-center">
            <div className="text-center mb-8 w-full">
              <h2 className="text-3xl font-bold text-[#fcfcfc] mb-4">
                Your Special Discount
              </h2>
              <div className="text-6xl mb-4 animate-bounce">
                {discountPreview.reaction}
              </div>
              <p className="text-2xl font-semibold text-[#fcfcfc] mb-2">
                {discountPreview.restaurant}
              </p>
              <p className="text-xl text-[#fcfcfc] mb-4">
                {discountPreview.discount}
              </p>
              <p className="text-lg text-[#fcfcfc] mb-4">
                Time remaining: {countdown} seconds
              </p>
            </div>

            <div className="bg-[#1f1f1f] p-6 rounded-lg w-full flex flex-col items-center">
              <div className="flex flex-col gap-4 items-center w-full">
                <div className="flex gap-4 w-[clamp(250px,90%,300px)] justify-center">
                  <button
                    onClick={handleClaimDiscount}
                    className="bg-[#133e94] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:border-[3px] hover:border-white flex-1"
                  >
                    Claim Discount
                  </button>
                  <button
                    onClick={handleDeclineDiscount}
                    className="bg-[#c20d0d] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:border-[3px] hover:border-white flex-1"
                  >
                    Decline
                  </button>
                </div>
                <div className="flex justify-center items-center w-full">
                  <button
                    onClick={continueGame}
                    className="w-[clamp(250px,90%,300px)] bg-[#4f4f4f] hover:bg-[#4f4f4f]/90 px-8 py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:border-[3px] hover:border-white"
                  >
                    Continue Playing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Claimed Discount Modal */}
      {fullDiscountDetails && (
        <div className="fixed inset-0 bg-[#0d0d0d] bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#1f1f1f] p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4 flex flex-col items-center">
            <div className="text-center mb-8 w-full">
              <h2 className="text-3xl font-bold text-[#fcfcfc] mb-4">
                Code claimed successfully!
              </h2>
              <div className="bg-[#1f1f1f] p-4 rounded-lg mb-4">
                <p className="text-2xl font-mono text-[#fcfcfc]">
                  {fullDiscountDetails.code}
                </p>
              </div>
              <div className="flex flex-col gap-4 items-center w-full">
                <div className="flex justify-center items-center w-full">
                  <button
                    onClick={copyDiscountCode}
                    className="w-[clamp(250px,90%,300px)] bg-[#133e94] hover:bg-[#c20d0d] px-8 py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:border-[3px] hover:border-white"
                  >
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
                <div className="flex justify-center items-center w-full">
                  <button
                    onClick={continueGame}
                    className="w-[clamp(250px,90%,300px)] bg-[#4f4f4f] hover:bg-[#4f4f4f]/90 px-8 py-3 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:border-[3px] hover:border-white"
                  >
                    Continue Playing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App 