"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Trophy, X, RotateCcw, Home, Shield, Sword, ChevronRight, Clock } from "lucide-react"
import { Link } from "react-router-dom"

const GameOverModal = ({
  isOpen,
  message,
  onRestart,
  onPlayAgain,
  playAgainRequested,
  playAgainCountdown,
  opponentPlayAgainRequested,
  onAcceptPlayAgain,
  onDeclinePlayAgain,
}) => {
  useEffect(() => {
    if (isOpen) {
      const previousTitle = document.title

      if (message.toLowerCase().includes("win")) {
        document.title = "Victory! | Chess Master Game Results"
      } else if (message.toLowerCase().includes("draw")) {
        document.title = "Draw Game | Chess Master Game Results"
      } else {
        document.title = "Game Over | Chess Master Game Results"
      }

      let gameResultSchema = document.querySelector("#game-result-schema")
      if (!gameResultSchema) {
        gameResultSchema = document.createElement("script")
        gameResultSchema.id = "game-result-schema"
        gameResultSchema.type = "application/ld+json"
        document.head.appendChild(gameResultSchema)
      }

      const schemaData = {
        "@context": "https://schema.org",
        "@type": "Game",
        name: "Chess Master Online Game",
        description: "An online chess game with multiple play modes",
        gameItem: {
          "@type": "Thing",
          name: "Chess Game Result",
          description: message,
        },
      }

      gameResultSchema.textContent = JSON.stringify(schemaData)

      if (message.toLowerCase().includes("win")) {
        const duration = 3 * 1000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

        function randomInRange(min, max) {
          return Math.random() * (max - min) + min
        }

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now()

          if (timeLeft <= 0) {
            return clearInterval(interval)
          }

          const particleCount = 50 * (timeLeft / duration)

          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ["#FFD700", "#FFC107", "#FFEB3B"],
          })
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ["#4CAF50", "#8BC34A", "#CDDC39"],
          })
        }, 250)
      }

      return () => {
        document.title = previousTitle
      }
    }
  }, [isOpen, message])

  const getResultTheme = () => {
    if (message.toLowerCase().includes("win")) {
      return {
        borderColor: "border-yellow-500",
        bgColor: "bg-blue-900",
        textColor: "text-yellow-400",
        icon: <Trophy className="w-12 h-12 text-yellow-400" aria-hidden="true" />,
      }
    } else if (message.toLowerCase().includes("draw")) {
      return {
        borderColor: "border-blue-600",
        bgColor: "bg-blue-900",
        textColor: "text-blue-300",
        icon: (
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            aria-hidden="true"
          >
            <Shield className="w-12 h-12 text-blue-300" />
          </motion.div>
        ),
      }
    } else {
      return {
        borderColor: "border-red-500",
        bgColor: "bg-blue-900",
        textColor: "text-red-400",
        icon: (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            aria-hidden="true"
          >
            <Sword className="w-12 h-12 text-red-400" />
          </motion.div>
        ),
      }
    }
  }

  function getResultMessage() {
    if (message.toLowerCase().includes("win")) {
      if (message.toLowerCase().includes("computer")) {
        return "Don't worry, every loss is a learning opportunity. Try again!"
      }
      return "Congratulations on your victory! Your strategy and skill have paid off."
    } else if (message.toLowerCase().includes("draw")) {
      return "A balanced match! Both players showed great skill and determination."
    } else {
      return "Don't worry, every loss is a learning opportunity. Try again!"
    }
  }

  const resultTheme = getResultTheme()
  const resultMessage = getResultMessage()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 font-mono"
          style={{ backdropFilter: "blur(8px)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="game-over-title"
        >
          <div className="absolute inset-0 z-0 bg-black opacity-70" onClick={onRestart} />

          <motion.div
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-md w-full py-16 mx-4 bg-gray-900 border-2 border-blue-700 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="bg-blue-800 py-3 px-4 border-b-2 border-yellow-500 flex justify-between items-center">
              <h2 id="game-over-title" className="text-2xl font-bold text-yellow-400 uppercase">
                Game Over
              </h2>
              <button
                onClick={onRestart}
                className="text-gray-300 hover:text-white transition-colors duration-200"
                aria-label="Close game over modal"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div
                    className={`w-24 h-24 rounded-full border-4 ${resultTheme.borderColor} ${resultTheme.bgColor} p-2 flex items-center justify-center`}
                    aria-hidden="true"
                  >
                    {resultTheme.icon}
                  </div>
                </div>

                <h2 className={`text-3xl font-bold mb-4 uppercase tracking-wider ${resultTheme.textColor}`}>
                  {message}
                </h2>

                <div className="bg-gray-800 border-2 border-blue-600 p-4 mb-6 w-full">
                  <p className="text-blue-100">{resultMessage}</p>
                </div>

                {opponentPlayAgainRequested ? (
                  <div className="w-full mb-6">
                    <div className="bg-gray-800 border-2 border-yellow-600 p-4">
                      <h3 className="text-xl font-bold text-yellow-400 uppercase mb-2">Rematch Request</h3>
                      <p className="text-blue-100 mb-4">
                        Your opponent wants to play again! Would you like to accept their challenge?
                      </p>

                      <div className="flex gap-3">
                        <button
                          onClick={onAcceptPlayAgain}
                          className="flex-1 py-2 px-4 bg-blue-700 hover:bg-blue-600 border-2 border-yellow-500 rounded-lg text-yellow-400 font-bold flex items-center justify-center group"
                          aria-label="Accept rematch"
                        >
                          <span>Accept</span>
                          <ChevronRight
                            className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                            aria-hidden="true"
                          />
                        </button>

                        <button
                          onClick={onDeclinePlayAgain}
                          className="flex-1 py-2 px-4 bg-red-700 hover:bg-red-600 border-2 border-red-500 rounded-lg text-white font-bold flex items-center justify-center group"
                          aria-label="Decline rematch"
                        >
                          <span>Decline</span>
                          <X className="ml-1 h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : playAgainRequested ? (
                  <div className="w-full mb-6">
                    <div className="bg-gray-800 border-2 border-blue-600 p-4">
                      <h3 className="text-xl font-bold text-blue-300 uppercase mb-2">Waiting for Response</h3>
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="text-blue-400 animate-pulse" size={18} aria-hidden="true" />
                        <p className="text-blue-100">
                          Request expires in <span className="text-yellow-400 font-bold">{playAgainCountdown}</span>{" "}
                          seconds
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <button
                      onClick={() => onPlayAgain()}
                      className="py-3 px-4 bg-blue-800 hover:bg-blue-700 border-2 border-yellow-500 rounded-lg text-yellow-400 font-bold flex items-center justify-center"
                      aria-label="Play another game"
                      type="button"
                    >
                      <RotateCcw className="mr-2" size={18} aria-hidden="true" />
                      <span>Play Again</span>
                    </button>

                    <Link to="/modeselector" className="w-full" aria-label="Return to game mode selection">
                      <button
                        className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 border-2 border-blue-600 rounded-lg text-blue-100 font-bold flex items-center justify-center"
                        type="button"
                      >
                        <Home className="mr-2" size={18} aria-hidden="true" />
                        <span>Game Modes</span>
                      </button>
                    </Link>
                  </div>
                )}

                <div className="flex justify-center mt-8 space-x-4" aria-hidden="true">
                  <div className="text-4xl text-white">♟</div>
                  <div className="text-4xl text-white">♞</div>
                  <div className="text-4xl text-white">♝</div>
                  <div className="text-4xl text-white">♜</div>
                  <div className="text-4xl text-white">♛</div>
                  <div className="text-4xl text-white">♚</div>
                </div>

                <p className="text-blue-300 text-sm mt-6">Your game results have been recorded in your profile.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GameOverModal
