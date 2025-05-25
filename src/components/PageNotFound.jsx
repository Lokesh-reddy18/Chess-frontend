"use client"

import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Home, ArrowLeft, HelpCircle } from 'lucide-react'
import { motion } from "framer-motion"
import ChessMasterLogo from "./ChessMasterLogo"

const NotFound = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const [currentPiece, setCurrentPiece] = useState(0)
  
  // Chess pieces in unicode
  const chessPieces = ["♚", "♛", "♜", "♝", "♞", "♟"]
  
  // Handle mouse movement to create subtle parallax effect
  const handleMouseMove = (e) => {
    if (!mounted) return
    
    const { clientX, clientY } = e
    const moveX = (clientX - window.innerWidth / 2) / 50
    const moveY = (clientY - window.innerHeight / 2) / 50
    
    setPosition({ x: moveX, y: moveY })
  }
  
  // Cycle through different chess pieces
  useEffect(() => {
    window.scrollTo(0, 0)
    setMounted(true)
    
    const interval = setInterval(() => {
      setCurrentPiece((prev) => (prev + 1) % chessPieces.length)
    }, 3000)
    
    return () => {
      clearInterval(interval)
      setMounted(false)
    }
  }, [])

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-gray-950 font-mono">
      {/* Chess board background with perspective */}
      <div className="fixed inset-0 z-0 perspective-1000">
        <div
          className="absolute inset-0 transform-style-3d rotate-x-60 scale-150"
          style={{
            backgroundImage: `linear-gradient(to right, transparent 0%, transparent 12.5%, #222 12.5%, #222 25%, 
                             transparent 25%, transparent 37.5%, #222 37.5%, #222 50%,
                             transparent 50%, transparent 62.5%, #222 62.5%, #222 75%,
                             transparent 75%, transparent 87.5%, #222 87.5%, #222 100%)`,
            backgroundSize: "200px 100px",
            opacity: 0.15,
          }}
        ></div>
      </div>

      {/* Game UI Container */}
      <div className="relative z-10 py-8 md:py-16 min-h-screen flex flex-col">
        {/* Game Header Banner */}
        <div className="w-full bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 border-b-4 border-yellow-500 shadow-lg py-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2 pixelated drop-shadow-md">
              PAGE NOT FOUND
            </h1>
            <div className="h-1 w-32 mx-auto bg-yellow-500 mb-4"></div>
            <p className="text-lg text-blue-100">This move is invalid</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow px-4 py-12 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <div className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel">
              <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                <h2 className="text-2xl font-bold text-yellow-400 uppercase">404 Error</h2>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Left side - Chess Piece */}
                <div className="flex-shrink-0">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                    className="w-32 h-32 mx-auto relative"
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/50 to-purple-600/50 blur-xl" />
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center relative">
                      <span className="text-6xl text-white">
                        {chessPieces[currentPiece]}
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Right side - Error Info */}
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    The page you're looking for has been captured or doesn't exist.
                  </h3>
                  
                  <p className="text-blue-200 mb-6">
                    This move is invalid. Please try a different approach or return to the home page.
                  </p>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                    <Link
                      to="/"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-md flex items-center justify-center transition-all"
                    >
                      <Home size={18} className="mr-2" />
                      Back to Home
                    </Link>
                    
                    <button
                      onClick={() => window.history.back()}
                      className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-6 py-3 rounded-md flex items-center justify-center transition-all"
                    >
                      <ArrowLeft size={18} className="mr-2" />
                      Go Back
                    </button>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-8 bg-black/30 rounded-lg p-4 border-2 border-blue-600">
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  <HelpCircle size={20} />
                  <h3 className="text-lg font-bold">Need Help?</h3>
                </div>
                <p className="text-blue-100">
                  If you believe this is an error, please check the URL or contact support for assistance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full bg-gray-900 border-t-4 border-blue-800 py-8 px-4 mt-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-b from-blue-900 to-blue-950 border-4 border-yellow-500 rounded-lg p-6 shadow-lg">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4 uppercase">Return to Game</h2>

              <p className="text-blue-100 mb-6">
                Ready to get back to the action? Return to the main menu to continue your chess journey.
              </p>

              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-yellow-500 text-blue-900 text-xl font-bold uppercase rounded-lg hover:bg-yellow-400 transition-colors shadow-lg border-2 border-yellow-700"
                >
                  MAIN MENU
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating chess pieces */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute text-2xl text-gray-600 opacity-40 z-10"
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
            transform: `translate(${position.x * (i + 1)}px, ${position.y * (i + 1)}px) rotate(${i * 45}deg)`,
            animation: `float ${5 + i}s ease-in-out infinite alternate`,
          }}
          aria-hidden="true"
        >
          {chessPieces[i % chessPieces.length]}
        </div>
      ))}
    </div>
  )
}

export default NotFound
