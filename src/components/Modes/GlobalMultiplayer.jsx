"use client"

import { useEffect, useRef, useState } from "react"
import { Chess } from "chess.js"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Howl } from "howler"
import { Maximize2, Minimize2, Volume2, VolumeX, LogOut, HelpCircle, Shield, Award } from "lucide-react"
import axios from "axios"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import WaitQueue from "../WaitQueue"
import pieceImages from "../pieceImages"
import GameOverModal from "../GameOverModal"
import moveSoundFile from "../../assets/sounds/move.mp3"
import captureSoundFile from "../../assets/sounds/capture.mp3"
import checkSoundFile from "../../assets/sounds/check.mp3"
import checkmateSoundFile from "../../assets/sounds/checkmate.mp3"
import { BASE_URL } from "../../url"
import { io } from "socket.io-client"

// Initialize sound effects
const moveSound = new Howl({ src: [moveSoundFile] })
const captureSound = new Howl({ src: [captureSoundFile] })
const checkSound = new Howl({ src: [checkSoundFile] })
const checkmateSound = new Howl({ src: [checkmateSoundFile] })

// Themed board colors
const themes = {
  classic: {
    light: "#f0d9b5",
    dark: "#b58863",
    highlight: "#aed581",
    possible: "#90caf9",
    accent: "#ff9800",
  },
  forest: {
    light: "#e8f5e9",
    dark: "#388e3c",
    highlight: "#c5e1a5",
    possible: "#81c784",
    accent: "#ffeb3b",
  },
  ocean: {
    light: "#e3f2fd",
    dark: "#1976d2",
    highlight: "#bbdefb",
    possible: "#64b5f6",
    accent: "#ff5722",
  },
  night: {
    light: "#ffffff",
    dark: "#212121",
    highlight: "#636363",
    possible: "#757575",
    accent: "#f44336",
  },
  royal: {
    light: "#f3e5f5",
    dark: "#6a1b9a",
    highlight: "#ce93d8",
    possible: "#9575cd",
    accent: "#ffc107",
  },
}

const GlobalMultiplayer = () => {
  const user = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()

  // Game state
  const [game, setGame] = useState(new Chess())
  const [board, setBoard] = useState(null)
  const [playerColor, setPlayerColor] = useState(null)
  const [opponent, setOpponent] = useState(null)
  const [waitingForOpponent, setWaitingForOpponent] = useState(true)
  const [currentStatus, setCurrentStatus] = useState("Waiting for opponent...")
  const [moves, setMoves] = useState([])
  const [mobileMode, setMobileMode] = useState(false)
  const [promotionPiece, setPromotionPiece] = useState("q")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [gameOverMessage, setGameOverMessage] = useState("")
  const [boardInitialized, setBoardInitialized] = useState(false)
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false)
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [possibleMoves, setPossibleMoves] = useState([])
  const [theme, setTheme] = useState("royal") // Changed to royal to match other components
  const [visualHints, setVisualHints] = useState(true)
  const [lastMove, setLastMove] = useState(null)
  const [showMovesList, setShowMovesList] = useState(false)
  const [activeTab, setActiveTab] = useState("game")
  const [showHelpModal, setShowHelpModal] = useState(false)

  // Refs
  const chessboardRef = useRef(null)
  const socketRef = useRef(null)
  const gameRef = useRef(null)
  const boardContainerRef = useRef(null)

  // Play sound with check for sound enabled
  const playSound = (sound) => {
    if (soundEnabled) {
      sound.play()
    }
  }

  // Add match to history function
  const addMatchToHistory = async (userId, opponentName, status) => {
    try {
      console.log("Sending match data:", { userId, opponentName, status })
      const response = await axios.post(
        `${BASE_URL}/user/${userId}/match-history`,
        {
          opponent: opponentName,
          status,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      console.log("Match history added:", response.data)
      return response.data
    } catch (error) {
      console.error("Error adding match to history:", error.response?.data || error.message)
      // Implement retry logic
      setTimeout(() => {
        console.log("Retrying match history update...")
        addMatchToHistory(userId, opponentName, status)
      }, 3000)
      return null
    }
  }

  // Utility functions for highlighting moves
  const removeHighlights = () => {
    const squares = document.querySelectorAll(".square-55d63")
    squares.forEach((square) => {
      square.classList.remove("highlight-square", "possible-move", "last-move")
      square.style.background = ""
    })
  }

  const highlightSquare = (square, type = "highlight") => {
    const squareEl = document.querySelector(`.square-${square}`)
    if (squareEl) {
      if (type === "highlight") {
        squareEl.classList.add("highlight-square")
      } else if (type === "possible") {
        squareEl.classList.add("possible-move")
      } else if (type === "last-move") {
        squareEl.classList.add("last-move")
      }
    }
  }

  const highlightLastMove = (from, to) => {
    if (!visualHints) return

    removeHighlights()
    highlightSquare(from, "last-move")
    highlightSquare(to, "last-move")
    setLastMove({ from, to })
  }

  // Celebration effect when player wins
  const triggerWinCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ffb347", "#ffcc33", "#fff"],
    })
  }

  // Connect to socket server when component mounts
  useEffect(() => {
    if (!user) return

    // Create socket connection
    const socketUrl = BASE_URL.startsWith("http") ? BASE_URL : `http://${BASE_URL}`
    console.log("Connecting to socket server at:", socketUrl)

    const socket = io(socketUrl, {
      query: { user: JSON.stringify(user) },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    })

    socketRef.current = socket

    // Debug connection status
    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id)
    })

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error)
    })

    socket.on("waiting", (isWaiting) => {
      console.log("Waiting status:", isWaiting)
      setWaitingForOpponent(isWaiting)
    })

    socket.on("color", (color) => {
      console.log("Received color:", color)
      setPlayerColor(color)
      setWaitingForOpponent(false)
    })

    socket.on("opponent", (obtainedOpponent) => {
      console.log("Opponent received:", obtainedOpponent)
      setOpponent(obtainedOpponent)
    })

    socket.on("opponentDisconnected", (opponentName) => {
      console.log("Opponent disconnected:", opponentName || "Opponent")

      if (user) {
        // Record win due to opponent disconnection
        addMatchToHistory(user.userId, opponent?.username || "Opponent", "win").then(() => {
          console.log("Match recorded as win due to opponent disconnection")
          // Trigger celebration for win
          triggerWinCelebration()
        })
      }

      // Show game over modal
      setGameOverMessage(`You win! ${opponentName || "Opponent"} has disconnected.`)
      setIsGameOver(true)
    })

    // Initialize chess game
    const newGame = new Chess()
    setGame(newGame)
    gameRef.current = newGame

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect()
      }
      if (board) {
        board.destroy()
      }
    }
  }, [user, navigate])

  // Handle socket move events and initialize board after player color is set
  useEffect(() => {
    if (!socketRef.current || !playerColor || !gameRef.current || !chessboardRef.current) return

    // Listen for opponent moves
    socketRef.current.on("move", ({ from, to, obtainedPromotion, fen }) => {
      try {
        console.log("Received move from opponent:", from, to, obtainedPromotion)

        // If FEN is provided, use it to sync game state
        if (fen) {
          console.log("Syncing game state with FEN:", fen)
          gameRef.current.load(fen)
          if (board) {
            board.position(fen, false) // Use false to avoid animation for syncing
          }
          updateStatus()
          return
        }

        // Otherwise make the move normally
        const move = gameRef.current.move({
          from,
          to,
          promotion: obtainedPromotion || "q",
        })

        if (move) {
          console.log("Successfully applied opponent's move:", move)

          // Update board position
          if (board) {
            board.position(gameRef.current.fen(), true) // Use true for animation
          }

          // Highlight the opponent's move
          highlightLastMove(from, to)

          // Update game state
          updateStatus()
          setMoves((prevMoves) => [
            ...prevMoves,
            {
              from: move.from,
              to: move.to,
              promotion: obtainedPromotion,
              player: "opponent",
            },
          ])

          // Play sound based on move type
          if (move.captured) {
            playSound(captureSound)
          } else {
            playSound(moveSound)
          }

          if (gameRef.current.inCheck()) {
            playSound(checkSound)
          }

          if (gameRef.current.isCheckmate()) {
            playSound(checkmateSound)
          }
        } else {
          console.error("Invalid move received from opponent:", from, to, obtainedPromotion)
          // Request current game state
          socketRef.current.emit("requestGameState")
        }
      } catch (error) {
        console.error("Error processing opponent's move:", error)
        // Request current game state on error
        socketRef.current.emit("requestGameState")
      }
    })

    socketRef.current.on("gameState", (fen) => {
      try {
        console.log("Received game state:", fen)
        if (gameRef.current && fen) {
          gameRef.current.load(fen)
          if (board) {
            board.position(fen, false) // Use false to avoid animation for syncing
          }
          updateStatus()
        }
      } catch (error) {
        console.error("Error loading game state:", error)
      }
    })

    // Initialize chessboard if not already initialized and we're on the game tab
    if (!board && activeTab === "game") {
      initializeChessboard()
    }

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.off("move")
        socketRef.current.off("gameState")
      }
    }
  }, [playerColor, soundEnabled, board, boardInitialized, visualHints, activeTab])

  // Apply theme colors to the board
  useEffect(() => {
    const applyTheme = () => {
      const currentTheme = themes[theme]
      const styleSheet = document.createElement("style")
      styleSheet.id = "chess-theme"

      const css = `
        .white-1e1d7 { background-color: ${currentTheme.light} !important; }
        .black-3c85d { background-color: ${currentTheme.dark} !important; }
        .highlight-square { background-color: ${currentTheme.highlight} !important; }
        .possible-move { background-color: ${currentTheme.possible} !important; }
        .last-move { box-shadow: inset 0 0 0 4px ${currentTheme.accent} !important; }
      `

      styleSheet.textContent = css

      // Remove existing theme stylesheet if it exists
      const existingStyle = document.getElementById("chess-theme")
      if (existingStyle) {
        existingStyle.remove()
      }

      document.head.appendChild(styleSheet)
    }

    applyTheme()

    return () => {
      // Clean up theme stylesheet
      const existingStyle = document.getElementById("chess-theme")
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  }, [theme])

  // Function to initialize the chessboard
  const initializeChessboard = () => {
    try {
      // Make sure we're using a library that's available in the browser
      if (typeof window !== "undefined" && window.Chessboard) {
        // Define the board configuration with all required handlers
        const config = {
          position: "start",
          orientation: playerColor,
          draggable: !mobileMode,
          pieceTheme: (piece) => pieceImages[piece],
          onDragStart: onDragStart,
          onDrop: onDrop,
          onSnapEnd: onSnapEnd,
          onMouseoverSquare: onMouseoverSquare,
          onMouseoutSquare: onMouseoutSquare,
          snapbackSpeed: 500,
          snapSpeed: 100,
        }

        const newBoard = window.Chessboard(chessboardRef.current, config)
        setBoard(newBoard)
        setBoardInitialized(true)
        console.log("Chessboard initialized with orientation:", playerColor)

        // Handle window resize for mobile
        const handleResize = () => {
          if (newBoard) {
            newBoard.resize()
          }
        }

        window.addEventListener("resize", handleResize)

        return () => {
          window.removeEventListener("resize", handleResize)
        }
      } else {
        console.error("Chessboard library not available")
        // Add a fallback or retry mechanism
        const checkBoardInterval = setInterval(() => {
          if (window.Chessboard) {
            clearInterval(checkBoardInterval)
            initializeChessboard()
          }
        }, 1000)

        // Clear interval after 10 seconds to prevent infinite checking
        setTimeout(() => clearInterval(checkBoardInterval), 10000)
      }
    } catch (error) {
      console.error("Error initializing chessboard:", error)
    }
  }

  // Highlight legal moves
  const onMouseoverSquare = (square, piece) => {
    if (!visualHints) return

    // Get list of possible moves for this square
    const game = gameRef.current
    if (!game) return

    // Don't show moves if it's not the player's turn
    if ((playerColor === "white" && game.turn() === "b") || (playerColor === "black" && game.turn() === "w")) {
      return
    }

    const moves = game.moves({
      square: square,
      verbose: true,
    })

    // Exit if there are no moves available for this square
    if (moves.length === 0) return

    // Highlight the square they moused over
    highlightSquare(square)

    // Highlight the possible squares for this piece
    for (let i = 0; i < moves.length; i++) {
      highlightSquare(moves[i].to, "possible")
    }
  }

  const onMouseoutSquare = () => {
    if (!visualHints) return

    // Don't remove highlights if we're showing the last move
    if (lastMove) {
      removeHighlights()
      highlightSquare(lastMove.from, "last-move")
      highlightSquare(lastMove.to, "last-move")
    } else {
      removeHighlights()
    }
  }

  // Drag start handler - only allow dragging pieces if it's the player's turn
  const onDragStart = (source, piece) => {
    const game = gameRef.current
    if (!game) return false

    // Check if the game is over
    if (game.isGameOver()) return false

    // Check if it's the player's turn
    if (
      (playerColor === "white" && piece.search(/^b/) !== -1) ||
      (playerColor === "black" && piece.search(/^w/) !== -1)
    ) {
      return false
    }

    // Check if it's the player's turn based on game state
    if ((playerColor === "white" && game.turn() === "b") || (playerColor === "black" && game.turn() === "w")) {
      return false
    }

    // Show possible moves when piece is picked up
    if (visualHints) {
      removeHighlights()
      highlightSquare(source)

      const moves = game.moves({
        square: source,
        verbose: true,
      })

      for (let i = 0; i < moves.length; i++) {
        highlightSquare(moves[i].to, "possible")
      }
    }

    return true
  }

  // Drop handler - attempt to make a move when a piece is dropped
  const onDrop = (source, target) => {
    const game = gameRef.current
    if (!game) return "snapback"

    // Remove highlighted squares
    removeHighlights()

    try {
      // Check if it's the player's turn
      const playerTurn = playerColor === "white" ? "w" : "b"
      if (game.turn() !== playerTurn) {
        console.warn("Not your turn")
        return "snapback"
      }

      // Attempt to make the move
      const move = game.move({
        from: source,
        to: target,
        promotion: promotionPiece,
      })

      // If the move is invalid, return 'snapback'
      if (!move) {
        console.warn("Invalid move attempted:", source, target)
        return "snapback"
      }

      console.log("Valid move made:", move)

      // Highlight the move
      highlightLastMove(source, target)

      // Update game state
      updateStatus()

      // Send move to server with current FEN for state synchronization
      if (socketRef.current) {
        const moveData = {
          from: source,
          to: target,
          obtainedPromotion: promotionPiece,
          fen: game.fen(), // Include FEN for state synchronization
        }

        console.log("Sending move to server:", moveData)
        socketRef.current.emit("move", moveData)
      }

      // Add move to history
      setMoves((prevMoves) => [
        ...prevMoves,
        {
          from: move.from,
          to: move.to,
          promotion: promotionPiece,
          player: "player",
        },
      ])

      // Play sound based on move type
      if (move.captured) {
        playSound(captureSound)
      } else {
        playSound(moveSound)
      }

      if (game.inCheck()) {
        playSound(checkSound)
      }

      if (game.isCheckmate()) {
        playSound(checkmateSound)
      }

      return undefined // Move is valid
    } catch (error) {
      console.error("Error making move:", error)
      return "snapback"
    }
  }

  // Snap end handler - ensure board position matches game state
  const onSnapEnd = () => {
    if (board && gameRef.current) {
      board.position(gameRef.current.fen())
    }
  }

  // Update game status text
  const updateStatus = () => {
    const game = gameRef.current
    if (!game) return

    let status = ""
    const turn = game.turn() === "w" ? "White" : "Black"
    const isPlayerTurn = (playerColor === "white" && turn === "White") || (playerColor === "black" && turn === "Black")

    if (game.isCheckmate()) {
      const winner = turn === "White" ? "Black" : "White"
      status = `Game over, ${winner} wins by checkmate.`

      // Record match result
      if (user && opponent) {
        const userWon =
          (playerColor === "white" && winner === "White") || (playerColor === "black" && winner === "Black")

        console.log("Recording match result:", {
          userWon,
          playerColor,
          winner,
          user: user.userId,
          opponent: opponent.username,
        })

        addMatchToHistory(user.userId, opponent.username, userWon ? "win" : "lose").then(() => {
          // Force refresh profile data after match
          if (socketRef.current) {
            socketRef.current.emit("matchCompleted", {
              winner: userWon ? user.userId : opponent.userId,
              loser: userWon ? opponent.userId : user.userId,
            })
          }

          // Show game over modal
          setGameOverMessage(userWon ? "You win!" : "You lose!")
          setIsGameOver(true)

          // Trigger celebration if player wins
          if (userWon) {
            triggerWinCelebration()
          }
        })
      }
    } else if (game.isDraw()) {
      status = "Game over, draw."

      if (user && opponent) {
        console.log("Recording draw result")
        addMatchToHistory(user.userId, opponent.username, "draw").then(() => {
          // Force refresh profile data after match
          if (socketRef.current) {
            socketRef.current.emit("matchCompleted", {
              draw: true,
              players: [user.userId, opponent.userId],
            })
          }

          // Show game over modal
          setGameOverMessage("It's a draw!")
          setIsGameOver(true)
        })
      }
    } else {
      status = `${turn} to move${isPlayerTurn ? " (Your turn)" : ""}`
      if (game.inCheck()) {
        status += ", check!"
      }
    }

    setCurrentStatus(status)
  }

  // Calculate player rating
  const calculateRating = (wins, loses, draws) => {
    const totalGames = wins + loses + draws
    if (totalGames === 0) return 0
    const winRatio = wins / totalGames
    const baseRating = 900
    return Math.round(baseRating + winRatio * 2100)
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!boardContainerRef.current) return

    if (!fullscreen) {
      if (boardContainerRef.current.requestFullscreen) {
        boardContainerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }

    setFullscreen(!fullscreen)
  }

  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  // Toggle moves table
  const toggleMovesList = () => {
    setShowMovesList(!showMovesList)
  }

  // Toggle mobile mode
  const handleMobileModeChange = () => {
    setMobileMode((prev) => {
      const newMode = !prev

      if (newMode) {
        document.body.style.overflow = "hidden"
        document.documentElement.style.overflow = "hidden"
        document.body.style.position = "fixed"
        document.body.style.touchAction = "none"
      } else {
        document.body.style.overflow = "auto"
        document.documentElement.style.overflow = "auto"
        document.body.style.position = "static"
        document.body.style.touchAction = "auto"
      }

      // Reinitialize the board with the new draggable setting
      if (boardInitialized && board) {
        board.destroy()
        setTimeout(() => {
          initializeChessboard()
        }, 100)
      }

      return newMode
    })
  }

  // Handle promotion piece change
  const handlePromotionChange = (e) => {
    setPromotionPiece(e.target.value)
  }

  // Handle theme change
  const handleThemeChange = (e) => {
    setTheme(e.target.value)
  }

  // Toggle visual hints
  const toggleVisualHints = () => {
    setVisualHints(!visualHints)

    // Clear highlights if turning off
    if (visualHints) {
      removeHighlights()
    } else if (lastMove) {
      // Restore last move highlight if turning on
      highlightLastMove(lastMove.from, lastMove.to)
    }
  }

  // Show leave confirmation modal
  const confirmLeaveGame = () => {
    setShowLeaveConfirmation(true)
  }

  // Handle leave game
  const handleLeaveGame = () => {
    if (user && opponent) {
      // Record loss due to leaving
      addMatchToHistory(user.userId, opponent.username, "lose").then(() => {
        console.log("Match recorded as loss due to leaving")

        // Notify opponent
        if (socketRef.current) {
          socketRef.current.emit("playerLeft", {
            userId: user.userId,
            username: user.username,
            opponentId: opponent.userId,
          })
        }

        // Navigate back to mode selector
        navigate("/modeselector")
      })
    } else {
      navigate("/modeselector")
    }
  }

  // Cancel leave game
  const cancelLeaveGame = () => {
    setShowLeaveConfirmation(false)
  }

  // Handle game restart
  const handleRestart = () => {
    setIsGameOver(false)
    navigate("/modeselector")
  }

  // Help modal content
  const HelpModal = () => (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${showHelpModal ? "block" : "hidden"}`}>
      <div className="absolute inset-0 bg-black/70" onClick={() => setShowHelpModal(false)}></div>
      <div className="relative bg-gray-900 border-2 border-blue-700 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-800 -mt-6 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
          <h2 className="text-2xl font-bold text-yellow-400 uppercase">How to Play</h2>
        </div>

        <div className="space-y-4 text-blue-100">
          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-1">Online Multiplayer</h3>
            <p>Play against other players online. You'll be matched with an opponent of similar skill level.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-1">Mobile Mode</h3>
            <p>Tap a piece to select it, then tap a highlighted square to move. Perfect for touchscreens.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-1">Desktop Mode</h3>
            <p>Drag and drop pieces to make moves. Hover over pieces to see possible moves.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-1">Leaving Games</h3>
            <p>Leaving a game before it's finished will count as a loss. Please play your games to completion.</p>
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

  // If waiting for opponent, show wait queue
  if (waitingForOpponent) {
    return <WaitQueue socket={socketRef.current} />
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
              GLOBAL MULTIPLAYER
            </h1>
            <div className="h-1 w-32 mx-auto bg-yellow-500 mb-4"></div>
            <p className="text-lg text-blue-100">Challenge players from around the world</p>
          </div>
        </div>

        {/* Game Menu Tabs */}
        <nav className="bg-gray-900 border-b-2 border-blue-800 shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-2 flex justify-center overflow-x-auto">
            {["game", "settings", "help"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 mx-2 text-lg font-bold uppercase transition-all ${
                  activeTab === tab
                    ? "bg-blue-800 text-yellow-400 border-2 border-yellow-500 shadow-yellow-400/20 shadow-md"
                    : "text-blue-300 hover:bg-blue-900 border-2 border-transparent"
                }`}
              >
                {tab === "game" && "Game"}
                {tab === "settings" && "Settings"}
                {tab === "help" && "Help"}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content Area - Game Panel Style */}
        <div className="flex-grow px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Game Tab Content */}
            {activeTab === "game" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chess board container with stylish border */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                  ref={boardContainerRef}
                >
                  <div className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel">
                    <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                      <h2 className="text-2xl font-bold text-yellow-400 uppercase">Chess Board</h2>
                    </div>

                    {opponent && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-between text-center mb-4 text-lg text-white backdrop-blur-sm bg-black/30 p-3 rounded-lg"
                      >
                        <p>Opponent: {opponent.username?.split(" ")[0] || "Opponent"}</p>
                        <p>Rating: {calculateRating(opponent.wins || 0, opponent.loses || 0, opponent.draws || 0)}</p>
                      </motion.div>
                    )}

                    <div className="relative backdrop-blur-sm bg-black/30 p-4 rounded-lg border-2 border-blue-600">
                      <div className="absolute top-2 right-2 z-10 flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={toggleSound}
                          className="p-2 bg-gray-800 bg-opacity-70 rounded-full text-white hover:bg-opacity-100 transition-all"
                        >
                          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={toggleFullscreen}
                          className="p-2 bg-gray-800 bg-opacity-70 rounded-full text-white hover:bg-opacity-100 transition-all"
                        >
                          {fullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                        </motion.button>
                      </div>
                      <div ref={chessboardRef} className="mx-auto"></div>
                    </div>

                    {user && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex text-lg justify-between text-center mt-4 mb-4 text-white backdrop-blur-sm bg-black/30 p-3 rounded-lg"
                      >
                        <p>You ({user.username || "Player"})</p>
                        <p>Rating: {calculateRating(user.wins || 0, user.loses || 0, user.draws || 0)}</p>
                      </motion.div>
                    )}

                    {/* Status display */}
                    <div className="mt-4">
                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        }}
                        className="rounded-lg text-center p-3 bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white border border-white/30 shadow-lg"
                      >
                        <p className="text-xl font-semibold">{currentStatus}</p>
                      </motion.div>
                    </div>

                    {/* Help text for mobile mode */}
                    {mobileMode && (
                      <div className="mt-4 p-3 bg-black/50 text-white text-center rounded-lg border border-blue-600">
                        {selectedSquare ? "Tap a highlighted square to move" : "Tap a piece to select"}
                      </div>
                    )}

                    {/* Quick controls */}
                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={confirmLeaveGame}
                        className="bg-gradient-to-r from-red-600 to-red-400 text-white px-4 py-2 rounded-md font-semibold shadow-md flex items-center gap-2"
                      >
                        <LogOut size={18} />
                        Leave Game
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleSound}
                        className={`px-4 py-2 rounded-md font-semibold shadow-md flex items-center gap-2 ${
                          soundEnabled
                            ? "bg-gradient-to-r from-purple-600 to-purple-400 text-white"
                            : "bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300"
                        }`}
                      >
                        {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                        {soundEnabled ? "Sound On" : "Sound Off"}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowHelpModal(true)}
                        className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-md font-semibold shadow-md flex items-center gap-2"
                      >
                        <HelpCircle size={18} />
                        How to Play
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Game info and controls */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-full"
                >
                  <div className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel h-full">
                    <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                      <h2 className="text-2xl font-bold text-yellow-400 uppercase">Game Info</h2>
                    </div>

                    <div className="space-y-6">
                      {/* Game stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600 flex items-center">
                          <div className="mr-4 bg-blue-900 p-3 rounded-full border-2 border-yellow-500">
                            <Shield size={24} className="text-yellow-400" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-yellow-400">Mode</div>
                            <div className="text-blue-200">Global Multiplayer</div>
                          </div>
                        </div>

                        <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600 flex items-center">
                          <div className="mr-4 bg-blue-900 p-3 rounded-full border-2 border-yellow-500">
                            <Award size={24} className="text-yellow-400" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-yellow-400">Moves</div>
                            <div className="text-blue-200">{moves.length}</div>
                          </div>
                        </div>
                      </div>

                      {/* Promotion piece selector */}
                      <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600">
                        <h3 className="text-xl font-bold text-yellow-400 mb-3">Promotion Piece</h3>
                        <p className="text-blue-300 text-sm mb-4">Choose which piece to promote pawns to</p>
                        <select
                          value={promotionPiece}
                          onChange={handlePromotionChange}
                          className="w-full bg-gray-800 text-blue-100 p-3 rounded-md border-2 border-blue-500 focus:border-yellow-500 focus:outline-none"
                        >
                          <option value="q">Queen</option>
                          <option value="r">Rook</option>
                          <option value="b">Bishop</option>
                          <option value="n">Knight</option>
                        </select>
                      </div>

                      {/* Move history */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-yellow-400">Move History</h3>
                          <button
                            onClick={toggleMovesList}
                            className="text-white bg-blue-600/80 px-3 py-1 rounded-md text-sm border border-blue-400"
                          >
                            {showMovesList ? "Hide" : "Show"}
                          </button>
                        </div>

                        {showMovesList && (
                          <div className="bg-black/30 rounded-lg p-2 max-h-[300px] overflow-y-auto border-2 border-blue-600">
                            {moves.length > 0 ? (
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="text-white border-b border-white/20">
                                    <th className="p-2 text-left">#</th>
                                    <th className="p-2 text-left">From</th>
                                    <th className="p-2 text-left">To</th>
                                    <th className="p-2 text-left">Player</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {moves.map((move, index) => (
                                    <tr key={index} className={`text-white ${index % 2 === 0 ? "bg-white/5" : ""}`}>
                                      <td className="p-2">{index + 1}</td>
                                      <td className="p-2">{move.from}</td>
                                      <td className="p-2">{move.to}</td>
                                      <td className="p-2">{move.player === "player" ? "You" : "Opponent"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <div className="text-center py-4 text-blue-300">No moves yet</div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Mobile mode toggle */}
                      <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-yellow-400">Mobile Mode</h3>
                            <p className="text-blue-300 text-sm">Tap to select and move pieces</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <label className="relative inline-flex items-center cursor-pointer mb-1">
                              <input
                                type="checkbox"
                                checked={mobileMode}
                                onChange={handleMobileModeChange}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                            <span className="text-sm font-medium text-yellow-400">
                              {mobileMode ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 text-white text-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={confirmLeaveGame}
                          className="bg-gradient-to-r from-red-600 to-red-400 text-white px-6 py-3 rounded-lg w-full text-lg font-semibold"
                        >
                          Leave Game (Counts as Loss)
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Settings Tab Content */}
            {activeTab === "settings" && (
              <div className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel">
                <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                  <h2 className="text-2xl font-bold text-yellow-400 uppercase">Game Settings</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600">
                    <h3 className="text-xl font-bold text-yellow-400 mb-3">Board Theme</h3>
                    <p className="text-blue-300 text-sm mb-4">Choose your preferred board style</p>
                    <select
                      value={theme}
                      onChange={handleThemeChange}
                      className="w-full bg-gray-800 text-blue-100 p-3 rounded-md border-2 border-blue-500 focus:border-yellow-500 focus:outline-none"
                    >
                      <option value="classic">Classic</option>
                      <option value="forest">Forest</option>
                      <option value="ocean">Ocean</option>
                      <option value="night">Night</option>
                      <option value="royal">Royal</option>
                    </select>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-yellow-400">Visual Hints</h3>
                        <p className="text-blue-300 text-sm">Show possible moves and highlights</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <label className="relative inline-flex items-center cursor-pointer mb-1">
                          <input
                            type="checkbox"
                            checked={visualHints}
                            onChange={toggleVisualHints}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        <span className="text-sm font-medium text-yellow-400">
                          {visualHints ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-yellow-400">Sound Effects</h3>
                        <p className="text-blue-300 text-sm">Enable or disable game sounds</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <label className="relative inline-flex items-center cursor-pointer mb-1">
                          <input
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={toggleSound}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        <span className="text-sm font-medium text-yellow-400">
                          {soundEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-yellow-400">Mobile Mode</h3>
                        <p className="text-blue-300 text-sm">Tap to select and move pieces</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <label className="relative inline-flex items-center cursor-pointer mb-1">
                          <input
                            type="checkbox"
                            checked={mobileMode}
                            onChange={handleMobileModeChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        <span className="text-sm font-medium text-yellow-400">
                          {mobileMode ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Help Tab Content */}
            {activeTab === "help" && (
              <div className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel">
                <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                  <h2 className="text-2xl font-bold text-yellow-400 uppercase">How to Play</h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600">
                    <h3 className="text-xl font-bold text-yellow-400 mb-3">Online Multiplayer</h3>
                    <ul className="space-y-3 text-blue-100">
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-blue-800 flex items-center justify-center text-yellow-400 mr-3 mt-0.5 flex-shrink-0 border border-yellow-500">
                          1
                        </div>
                        <p>You'll be matched with an opponent of similar skill level.</p>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-blue-800 flex items-center justify-center text-yellow-400 mr-3 mt-0.5 flex-shrink-0 border border-yellow-500">
                          2
                        </div>
                        <p>The color you play as (White or Black) is randomly assigned.</p>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-blue-800 flex items-center justify-center text-yellow-400 mr-3 mt-0.5 flex-shrink-0 border border-yellow-500">
                          3
                        </div>
                        <p>Leaving a game early counts as a loss and affects your rating.</p>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600">
                    <h3 className="text-xl font-bold text-yellow-400 mb-3">Controls</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-blue-200 mb-2">Desktop Mode</h4>
                        <p className="text-blue-100 mb-2">
                          Click and drag pieces to make moves. Hover over pieces to see possible moves when visual hints
                          are enabled.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-blue-200 mb-2">Mobile Mode</h4>
                        <p className="text-blue-100 mb-2">
                          Tap a piece to select it, then tap a highlighted square to move. This mode is perfect for
                          touchscreens.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 border-2 border-blue-600">
                    <h3 className="text-xl font-bold text-yellow-400 mb-3">Rating System</h3>
                    <p className="text-blue-100 mb-4">
                      Your rating is calculated based on your win/loss record. Winning games against higher-rated
                      players will increase your rating more significantly.
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-green-900/50 p-2 rounded-md">
                        <div className="text-green-400 font-bold">Win</div>
                        <div className="text-blue-100">+Rating</div>
                      </div>
                      <div className="bg-yellow-900/50 p-2 rounded-md">
                        <div className="text-yellow-400 font-bold">Draw</div>
                        <div className="text-blue-100">±0 Rating</div>
                      </div>
                      <div className="bg-red-900/50 p-2 rounded-md">
                        <div className="text-red-400 font-bold">Loss</div>
                        <div className="text-blue-100">-Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action - Game Button Style */}
        <div className="w-full bg-gray-900 border-t-4 border-blue-800 py-8 px-4 mt-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-b from-blue-900 to-blue-950 border-4 border-yellow-500 rounded-lg p-6 shadow-lg">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4 uppercase">
                Playing Against: {opponent?.username || "Opponent"}
              </h2>

              <p className="text-blue-100 mb-6">Enjoy your game and may the best player win!</p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmLeaveGame}
                className="px-8 py-4 bg-red-500 text-white text-xl font-bold uppercase rounded-lg hover:bg-red-400 transition-colors shadow-lg border-2 border-red-700"
              >
                LEAVE GAME
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <HelpModal />

      {/* Game Over Modal */}
      <GameOverModal isOpen={isGameOver} message={gameOverMessage} onRestart={handleRestart} />

      {/* Leave Confirmation Modal */}
      {showLeaveConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
          >
            <h2 className="text-xl font-bold text-white mb-4">Are you sure?</h2>
            <p className="text-gray-300 mb-6">Leaving the game will count as a loss. Are you sure you want to quit?</p>
            <div className="flex justify-end space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={cancelLeaveGame}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                No, Continue Playing
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLeaveGame}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Quit Game
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default GlobalMultiplayer
