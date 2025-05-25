"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Users, Clock, CastleIcon as ChessKnight, Wifi, WifiOff, Sparkles, HelpCircle } from "lucide-react"

const WaitQueue = ({ socket = null, length = 2 }) => {
  const [dots, setDots] = useState("")
  const [elapsed, setElapsed] = useState(0)
  const [playersWaiting, setPlayersWaiting] = useState(1)
  const [connectionStatus, setConnectionStatus] = useState(socket?.connected ? "connected" : "disconnected")
  const [retryCount, setRetryCount] = useState(0)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [tips] = useState([
    "You can change the board theme in the settings",
    "Use mobile mode on touch devices for easier play",
    "Visual hints show you possible moves",
    "Choose your promotion piece before reaching the 8th rank",
    "Leaving a game counts as a loss",
    "Your match history is saved to your profile",
    "You can mute game sounds with the volume button",
  ])
  const [currentTip, setCurrentTip] = useState(0)

  // Memoized event handlers to prevent recreation on every render
  const handleWaitingCount = useCallback((count) => {
    console.log("Players waiting:", count)
    setPlayersWaiting(count)
  }, [])

  const handleConnect = useCallback(() => {
    console.log("Socket connected")
    setConnectionStatus("connected")
    setRetryCount(0)
    socket?.emit("getWaitingCount")
  }, [socket])

  const handleDisconnect = useCallback(() => {
    console.log("Socket disconnected")
    setConnectionStatus("disconnected")
  }, [])

  const handleConnectError = useCallback((error) => {
    console.error("Connection error:", error)
    setConnectionStatus("error")
  }, [])

  useEffect(() => {
    // Animated dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 500)

    // Elapsed time counter
    const elapsedInterval = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)

    // Rotate tips every 5 seconds
    const tipsInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
    }, 5000)

    // Set up socket listeners if socket exists
    if (socket) {
      console.log("WaitQueue: Socket connected, listening for updates")
      socket.on("waitingCount", handleWaitingCount)
      socket.on("connect", handleConnect)
      socket.on("disconnect", handleDisconnect)
      socket.on("connect_error", handleConnectError)

      // Request current waiting count
      socket.emit("getWaitingCount")

      // Request updates every 5 seconds
      const waitingInterval = setInterval(() => {
        if (socket.connected) {
          socket.emit("getWaitingCount")
        }
      }, 5000)

      return () => {
        clearInterval(dotsInterval)
        clearInterval(elapsedInterval)
        clearInterval(waitingInterval)
        clearInterval(tipsInterval)
        socket.off("waitingCount", handleWaitingCount)
        socket.off("connect", handleConnect)
        socket.off("disconnect", handleDisconnect)
        socket.off("connect_error", handleConnectError)
      }
    }

    return () => {
      clearInterval(dotsInterval)
      clearInterval(elapsedInterval)
      clearInterval(tipsInterval)
    }
  }, [socket, handleWaitingCount, handleConnect, handleDisconnect, handleConnectError, tips.length])

  // Implement retry logic with backoff
  useEffect(() => {
    if (connectionStatus === "error" && retryCount < 5 && socket) {
      const timeout = Math.min(1000 * 2 ** retryCount, 30000)
      console.log(`Retrying connection in ${timeout / 1000} seconds...`)

      const retryTimer = setTimeout(() => {
        console.log("Attempting to reconnect...")
        socket.connect()
        setRetryCount((prev) => prev + 1)
      }, timeout)

      return () => clearTimeout(retryTimer)
    }
  }, [connectionStatus, retryCount, socket])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" + secs : secs}`
  }

  // Calculate remaining players needed
  const playersNeeded = Math.max(0, length - playersWaiting)

  // Help modal content
  const HelpModal = () => (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${showHelpModal ? "block" : "hidden"}`}>
      <div className="absolute inset-0 bg-black/70" onClick={() => setShowHelpModal(false)}></div>
      <div className="relative bg-gray-900 border-2 border-blue-700 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-800 -mt-6 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
          <h2 className="text-2xl font-bold text-yellow-400 uppercase">Matchmaking Info</h2>
        </div>

        <div className="space-y-4 text-blue-100">
          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-1">How Matchmaking Works</h3>
            <p>
              Our system pairs you with players of similar skill level. The longer you wait, the wider the skill range
              becomes to ensure you find a match.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-1">Connection Issues</h3>
            <p>
              If you experience connection problems, the system will automatically try to reconnect. If problems
              persist, try refreshing the page.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-1">Rating Impact</h3>
            <p>
              Matches found through the queue will affect your rating. Winning against higher-rated players will
              increase your rating more significantly.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowHelpModal(false)}
          className="mt-6 w-full bg-yellow-500 text-blue-900 font-bold py-2 rounded-md hover:bg-yellow-400"
        >
          Got it!
        </button>
      </div>
    </div>
  )

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
              FINDING OPPONENT
            </h1>
            <div className="h-1 w-32 mx-auto bg-yellow-500 mb-4"></div>
            <p className="text-lg text-blue-100">Please wait while we match you with another player</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow px-4 py-8 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <div className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel">
              <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                <h2 className="text-2xl font-bold text-yellow-400 uppercase">Matchmaking Queue</h2>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Left side - Chess Knight Icon */}
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
                      <ChessKnight className="w-16 h-16 text-white" />

                      {/* Orbiting sparkles */}
                      <motion.div
                        className="absolute"
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        style={{ transformOrigin: "center center" }}
                      >
                        <motion.div
                          className="absolute"
                          style={{ left: 0, top: -40 }}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                          }}
                        >
                          <Sparkles className="text-blue-300 w-5 h-5" />
                        </motion.div>
                      </motion.div>

                      <motion.div
                        className="absolute"
                        animate={{
                          rotate: [0, -360],
                        }}
                        transition={{
                          duration: 10,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        style={{ transformOrigin: "center center" }}
                      >
                        <motion.div
                          className="absolute"
                          style={{ right: -40, top: 0 }}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            delay: 0.5,
                          }}
                        >
                          <Sparkles className="text-purple-300 w-5 h-5" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Right side - Queue Info */}
                <div className="flex-grow">
                  <div className="text-center md:text-left mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Waiting for {playersNeeded} more player{playersNeeded !== 1 ? "s" : ""} to join{dots}
                    </h3>
                    <p className="text-blue-200">
                      You'll be automatically matched with an opponent as soon as one becomes available.
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center mb-2 border-2 border-yellow-500">
                        <Users className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div className="text-lg font-bold text-yellow-400">Players Needed</div>
                      <div className="text-2xl font-bold text-white">{playersNeeded}</div>
                    </div>

                    <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center mb-2 border-2 border-yellow-500">
                        <Clock className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div className="text-lg font-bold text-yellow-400">Wait Time</div>
                      <div className="text-2xl font-bold text-white">{formatTime(elapsed)}</div>
                    </div>

                    <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600 flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center mb-2 border-2 border-yellow-500`}
                      >
                        {connectionStatus === "connected" ? (
                          <Wifi className="w-6 h-6 text-yellow-400" />
                        ) : (
                          <WifiOff className="w-6 h-6 text-yellow-400" />
                        )}
                      </div>
                      <div className="text-lg font-bold text-yellow-400">Connection</div>
                      <div className="text-2xl font-bold text-white capitalize">
                        {connectionStatus === "connected" ? "Online" : "Offline"}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden mb-6 border border-blue-700">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-purple-600"
                      animate={{
                        width: ["0%", "100%", "0%"],
                        x: ["0%", "0%", "100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        ease: "easeInOut",
                      }}
                    />
                  </div>

                  {/* Tips Section */}
                  <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600 mb-4">
                    <h3 className="text-xl font-bold text-yellow-400 mb-2">Chess Tip:</h3>
                    <motion.p
                      key={currentTip}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-blue-100"
                    >
                      {tips[currentTip]}
                    </motion.p>
                  </div>

                  {/* Connection Error Message */}
                  {connectionStatus !== "connected" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="bg-red-900/30 p-4 rounded-lg border-2 border-red-700 text-red-300 flex items-center"
                    >
                      <WifiOff className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>
                        Connection issue detected. Please check your internet connection or try refreshing the page.
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Help Button */}
              <div className="mt-6 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowHelpModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-md font-semibold shadow-md flex items-center gap-2"
                >
                  <HelpCircle size={18} />
                  How Matchmaking Works
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <HelpModal />
    </div>
  )
}

export default WaitQueue
