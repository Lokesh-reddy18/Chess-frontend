"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { login, logout } from "../store/authSlice"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trophy,
  Target,
  Calendar,
  LogOut,
  User,
  Activity,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Shield,
  HelpCircle,
} from "lucide-react"
import { BASE_URL } from "../url"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import LoadingScreen from "./Loading"
import { io } from "socket.io-client"

function Profile() {
  const userData = useSelector((state) => state.auth.userData)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [expandedMatch, setExpandedMatch] = useState(null)
  const [stats, setStats] = useState({
    totalGames: 0,
    winRate: 0,
    rating: 0,
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const calculateStats = (data) => {
    if (!data) return { totalGames: 0, winRate: 0, rating: 0 }

    const wins = data.wins || 0
    const loses = data.loses || 0
    const draws = data.draws || 0
    const totalGames = wins + loses + draws
    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0

    return {
      totalGames,
      winRate,
      rating: calculateRating(wins, loses, draws),
    }
  }

  const refreshProfileData = async () => {
    if (isRefreshing) return // Prevent multiple simultaneous refreshes

    setIsRefreshing(true)
    try {
      console.log("Refreshing profile data...")
      const res = await axios.get(`${BASE_URL}/profile`, {
        withCredentials: true,
      })

      if (!res.data) {
        throw new Error("No data received from server")
      }

      console.log("Profile data received:", res.data)

      // Update Redux state with fresh data
      dispatch(login(res.data))

      // Calculate and update stats
      const newStats = calculateStats(res.data)
      setStats(newStats)

      // Only show success message when manually refreshed, not on initial load or auto-refresh
      if (isRefreshing && !window.initialLoad) {
        toast.success("Profile updated successfully")
      }

      // Set initialLoad to false after first load
      window.initialLoad = false
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile data")

      // If unauthorized, redirect to login
      if (error.response && error.response.status === 401) {
        Cookies.remove("token", { path: "/" })
        dispatch(logout())
        navigate("/login")
      }
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Initial data load
  useEffect(() => {
    refreshProfileData()

    // If no userData in Redux, calculate initial stats when it arrives
    if (!userData) {
      return
    } else {
      setStats(calculateStats(userData))
    }
  }, [])

  // Update stats whenever userData changes
  useEffect(() => {
    if (userData) {
      setStats(calculateStats(userData))
    }
  }, [userData])

  // Set up socket connection for real-time updates
  useEffect(() => {
    if (!userData || !userData.userId) return

    // Connect to socket server
    const socket = io(BASE_URL, {
      withCredentials: true,
      query: {
        user: JSON.stringify({
          userId: userData.userId,
          username: userData.username,
        }),
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    // Listen for match history updates
    socket.on("matchHistoryUpdated", () => {
      console.log("Match history updated event received")
      refreshProfileData()
    })

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err)
    })

    // Clean up socket connection
    return () => {
      socket.disconnect()
    }
  }, [userData])

  // Add window focus event listener
  useEffect(() => {
    const handleFocus = () => {
      console.log("Window focused, refreshing data...")
      refreshProfileData()
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [])

  // Add polling for updates (less frequent to avoid overloading)
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Polling for profile updates...")
      refreshProfileData()
    }, 60000) // Check every minute instead of every 30 seconds

    return () => clearInterval(intervalId)
  }, [])

  // Add spin animation
  useEffect(() => {
    const spinSlowKeyframes = `
      @keyframes spin-slow {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `
    const styleElement = document.createElement("style")
    styleElement.innerHTML = `
      ${spinSlowKeyframes}
      .animate-spin-slow {
        animation: spin-slow 3s linear infinite;
      }
      .animate-spin-active {
        animation-play-state: running;
      }
      .animate-spin-paused {
        animation-play-state: paused;
      }
    `
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  const calculateRating = (wins, loses, draws) => {
    const totalGames = wins + loses + draws
    if (totalGames === 0) return 800

    // More sophisticated rating calculation
    const baseRating = 800
    const winPoints = 25
    const losePoints = 15
    const drawPoints = 5

    return Math.round(baseRating + wins * winPoints - loses * losePoints + draws * drawPoints)
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      // Call the backend logout endpoint
      await axios.post(
        `${BASE_URL}/user/logout`,
        {},
        {
          withCredentials: true,
        },
      )

      // Then remove the cookie and update Redux state
      Cookies.remove("token", { path: "/" })
      dispatch(logout())
      toast.success("Logged out successfully")
      navigate("/login")
    } catch (error) {
      console.error("Error during logout:", error)
      toast.error("Logout failed. Please try again.")

      // As a fallback, still try to remove the cookie and update Redux state
      Cookies.remove("token", { path: "/" })
      dispatch(logout())
      navigate("/login")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMatchDetails = (matchId) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId)
  }

  const filterMatchHistory = () => {
    if (!userData?.matchHistory || !Array.isArray(userData.matchHistory)) {
      return []
    }

    switch (activeTab) {
      case "wins":
        return userData.matchHistory.filter((match) => match.status === "win")
      case "losses":
        return userData.matchHistory.filter((match) => match.status === "lose")
      case "draws":
        return userData.matchHistory.filter((match) => match.status === "draw")
      default:
        return userData.matchHistory
    }
  }

  // Help modal content
  const HelpModal = () => (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${showHelpModal ? "block" : "hidden"}`}>
      <div className="absolute inset-0 bg-black/70" onClick={() => setShowHelpModal(false)}></div>
      <div className="relative bg-gray-900 border-2 border-blue-700 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-800 -mt-6 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
          <h2 className="text-2xl font-bold text-yellow-400 uppercase">Profile Help</h2>
        </div>

        <div className="space-y-4 text-blue-100">
          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-1">Rating System</h3>
            <p>
              Your rating is calculated based on your win/loss record. Winning games increases your rating, while losing
              games decreases it.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-1">Match History</h3>
            <p>View your past games, filtered by wins, losses, or draws. Click on any match to see more details.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-1">Stats</h3>
            <p>
              Your profile shows your total games played, win rate, and current rating. These stats are updated
              automatically after each game.
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

  if (isLoading) {
    return <LoadingScreen />
  }

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
              PLAYER PROFILE
            </h1>
            <div className="h-1 w-32 mx-auto bg-yellow-500 mb-4"></div>
            <p className="text-lg text-blue-100">View your stats and match history</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-1"
              >
                <div className="bg-gray-900 border-2 border-blue-700 rounded-lg shadow-lg game-panel h-full">
                  <div className="bg-blue-800 py-2 px-4 border-b-2 border-yellow-500">
                    <h2 className="text-2xl font-bold text-yellow-400 uppercase">Player Info</h2>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-blue-900 to-purple-900">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-full bg-blue-800 border-2 border-yellow-500 flex items-center justify-center text-4xl font-bold text-yellow-400">
                        {userData?.username?.charAt(0).toUpperCase() || <User size={32} />}
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-white capitalize">{userData?.username || "Player"}</h1>
                        <p className="text-blue-200">{userData?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Trophy className="mr-2 text-yellow-400" size={20} />
                      Player Statistics
                    </h2>

                    {/* Rating Stat */}
                    <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-blue-200">Rating</p>
                        <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded-md text-sm font-medium border border-blue-700">
                          {stats.rating}
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 mb-1 border border-blue-900">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min((stats.rating / 3000) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Beginner</span>
                        <span>Advanced</span>
                        <span>Master</span>
                      </div>
                    </div>

                    {/* Win Rate Stat */}
                    <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-blue-200">Win Rate</p>
                        <span className="px-2 py-1 bg-green-900/50 text-green-300 rounded-md text-sm font-medium border border-green-700">
                          {stats.winRate}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 mb-1 border border-green-900">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${stats.winRate}%` }}></div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600 text-center">
                        <div className="w-10 h-10 rounded-full bg-blue-900 border-2 border-yellow-500 flex items-center justify-center mx-auto mb-2">
                          <Trophy size={18} className="text-yellow-400" />
                        </div>
                        <p className="text-blue-200 text-sm mb-1">Wins</p>
                        <p className="text-2xl font-bold text-white">{userData?.wins || 0}</p>
                      </div>

                      <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600 text-center">
                        <div className="w-10 h-10 rounded-full bg-blue-900 border-2 border-yellow-500 flex items-center justify-center mx-auto mb-2">
                          <Activity size={18} className="text-yellow-400" />
                        </div>
                        <p className="text-blue-200 text-sm mb-1">Losses</p>
                        <p className="text-2xl font-bold text-white">{userData?.loses || 0}</p>
                      </div>

                      <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600 text-center">
                        <div className="w-10 h-10 rounded-full bg-blue-900 border-2 border-yellow-500 flex items-center justify-center mx-auto mb-2">
                          <Target size={18} className="text-yellow-400" />
                        </div>
                        <p className="text-blue-200 text-sm mb-1">Draws</p>
                        <p className="text-2xl font-bold text-white">{userData?.draws || 0}</p>
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600 flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-2">
                        <Shield className="text-yellow-400" size={20} />
                        <p className="text-white font-medium">Total Games</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-md font-medium border border-blue-700">
                        {stats.totalGames}
                      </span>
                    </div>

                    <div className="flex space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-300"
                      >
                        <LogOut className="mr-2" size={18} />
                        Logout
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowHelpModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-300"
                      >
                        <HelpCircle size={18} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Match History Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="bg-gray-900 border-2 border-blue-700 rounded-lg shadow-lg game-panel h-full">
                  <div className="p-4 bg-blue-800 border-b-2 border-yellow-500 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-yellow-400 uppercase flex items-center">
                      <Calendar className="mr-2" size={20} />
                      Match History
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={refreshProfileData}
                      disabled={isRefreshing}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium disabled:bg-blue-800 disabled:cursor-not-allowed"
                    >
                      <RefreshCw
                        size={16}
                        className={`${isRefreshing ? "animate-spin-active" : "animate-spin-paused"} animate-spin-slow`}
                      />
                      <span className="hidden sm:inline">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                    </motion.button>
                  </div>

                  {/* Match History Tabs */}
                  <div className="flex border-b border-gray-700">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`flex-1 py-3 text-center font-medium ${
                        activeTab === "all"
                          ? "text-blue-400 border-b-2 border-blue-400"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setActiveTab("wins")}
                      className={`flex-1 py-3 text-center font-medium ${
                        activeTab === "wins"
                          ? "text-green-400 border-b-2 border-green-400"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      Wins
                    </button>
                    <button
                      onClick={() => setActiveTab("losses")}
                      className={`flex-1 py-3 text-center font-medium ${
                        activeTab === "losses"
                          ? "text-red-400 border-b-2 border-red-400"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      Losses
                    </button>
                    <button
                      onClick={() => setActiveTab("draws")}
                      className={`flex-1 py-3 text-center font-medium ${
                        activeTab === "draws"
                          ? "text-yellow-400 border-b-2 border-yellow-400"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      Draws
                    </button>
                  </div>

                  {/* Match History Content */}
                  <div className="p-4 max-h-[500px] overflow-y-auto">
                    {!filterMatchHistory() || filterMatchHistory().length === 0 ? (
                      <div className="text-center py-12 px-4 bg-black/30 rounded-lg border-2 border-blue-600">
                        <Trophy className="mx-auto mb-4 text-yellow-400 opacity-50" size={48} />
                        <p className="text-xl font-medium text-white mb-2">No matches found</p>
                        <p className="text-blue-200">
                          {activeTab === "all"
                            ? "Play your first game to start building your history"
                            : `You don't have any ${activeTab} yet`}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filterMatchHistory()
                          .sort((a, b) => {
                            // Sort by date (newest first)
                            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0)
                            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0)
                            return dateB - dateA
                          })
                          .map((match, index) => {
                            const statusConfig = {
                              win: {
                                icon: <Trophy size={18} />,
                                bgColor: "bg-green-900",
                                textColor: "text-green-400",
                                label: "VICTORY",
                                result: `You won against ${match.opponent || "Opponent"}`,
                                ratingChange: "+25 Rating",
                                ratingColor: "text-green-400",
                              },
                              lose: {
                                icon: <Activity size={18} />,
                                bgColor: "bg-red-900",
                                textColor: "text-red-400",
                                label: "DEFEAT",
                                result: `${match.opponent || "Opponent"} defeated you`,
                                ratingChange: "-15 Rating",
                                ratingColor: "text-red-400",
                              },
                              draw: {
                                icon: <Target size={18} />,
                                bgColor: "bg-yellow-900",
                                textColor: "text-yellow-400",
                                label: "DRAW",
                                result: `Draw with ${match.opponent || "Opponent"}`,
                                ratingChange: "+0 Rating",
                                ratingColor: "text-yellow-400",
                              },
                            }

                            // Default to draw if status is invalid
                            const config = statusConfig[match.status] || statusConfig.draw

                            // Ensure we have a valid date object
                            const matchDate = match.createdAt ? new Date(match.createdAt) : new Date()
                            const isValidDate = !isNaN(matchDate.getTime())

                            return (
                              <motion.div
                                key={match._id || index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                              >
                                <div
                                  className={`rounded-lg p-3 cursor-pointer transition-all border-2 ${
                                    expandedMatch === match._id
                                      ? "bg-gray-800 border-blue-600"
                                      : "bg-gray-800/50 hover:bg-opacity-70 border-gray-700"
                                  }`}
                                  onClick={() => toggleMatchDetails(match._id)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bgColor} bg-opacity-30 ${config.textColor} border border-blue-700`}
                                      >
                                        {config.icon}
                                      </div>
                                      <div>
                                        <p className="font-medium text-white">{config.result}</p>
                                        <p className="text-xs text-blue-200">
                                          {isValidDate
                                            ? matchDate.toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                              })
                                            : "Date unavailable"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} bg-opacity-30 ${config.textColor} border border-blue-700`}
                                      >
                                        {config.label}
                                      </span>
                                      {expandedMatch === match._id ? (
                                        <ChevronUp size={18} className="text-blue-400" />
                                      ) : (
                                        <ChevronDown size={18} className="text-blue-400" />
                                      )}
                                    </div>
                                  </div>

                                  <AnimatePresence>
                                    {expandedMatch === match._id && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="pt-3 mt-3 border-t border-gray-700 grid grid-cols-2 gap-3">
                                          <div className="space-y-1">
                                            <p className="text-xs text-blue-200">Match Time</p>
                                            <p className="font-medium text-white">
                                              {isValidDate
                                                ? matchDate.toLocaleTimeString(undefined, {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                  })
                                                : "Time unavailable"}
                                            </p>
                                          </div>
                                          <div className="space-y-1">
                                            <p className="text-xs text-blue-200">Result Impact</p>
                                            <p className="font-medium">
                                              <span className={config.ratingColor}>{config.ratingChange}</span>
                                            </p>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </motion.div>
                            )
                          })}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Call to Action - Game Button Style */}
        <div className="w-full bg-gray-900 border-t-4 border-blue-800 py-8 px-4 mt-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-b from-blue-900 to-blue-950 border-4 border-yellow-500 rounded-lg p-6 shadow-lg">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4 uppercase">Ready to Play?</h2>

              <p className="text-blue-100 mb-6">Challenge players from around the world and improve your rating!</p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/modeselector")}
                className="px-8 py-4 bg-yellow-500 text-blue-900 text-xl font-bold uppercase rounded-lg hover:bg-yellow-400 transition-colors shadow-lg border-2 border-yellow-700"
              >
                PLAY NOW
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <HelpModal />
    </div>
  )
}

export default Profile
