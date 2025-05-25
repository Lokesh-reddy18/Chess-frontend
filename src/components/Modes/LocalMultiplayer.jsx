"use client"

import { useEffect, useRef, useState } from "react"
import { Chess } from "chess.js"
import Chessboard from "chessboardjs"
import { Howl } from "howler"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Award,
  Shield,
  RotateCcw,
  Volume2,
  VolumeX,
  HelpCircle,
  Smartphone,
  Monitor,
  Settings,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Palette,
  Clock,
  History,
  X,
  Users,
} from "lucide-react"
import pieceImages from "../pieceImages"
import moveSoundFile from "../../assets/sounds/move.mp3"
import captureSoundFile from "../../assets/sounds/capture.mp3"
import checkSoundFile from "../../assets/sounds/check.mp3"
import checkmateSoundFile from "../../assets/sounds/checkmate.mp3"
import GameOverModal from "../GameOverModal"
import HelpModal from "./HelpModal"

const moveSound = new Howl({ src: [moveSoundFile] })
const captureSound = new Howl({ src: [captureSoundFile] })
const checkSound = new Howl({ src: [checkSoundFile] })
const checkmateSound = new Howl({ src: [checkmateSoundFile] })

const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

const LocalPlayer = () => {
  const chessRef = useRef(null)
  const boardRef = useRef(null)
  const [currentStatus, setCurrentStatus] = useState(null)
  const [moves, setMoves] = useState([])
  const gameRef = useRef(new Chess())
  const [promotionPiece, setPromotionPiece] = useState("q")
  const [isGameOver, setIsGameOver] = useState(false)
  const [gameOverMessage, setGameOverMessage] = useState("")
  const [mobileMode, setMobileMode] = useState(false)
  const [visualHints, setVisualHints] = useState(true)
  const [theme, setTheme] = useState("ocean")
  const [showMovesList, setShowMovesList] = useState(false)
  const [lastMove, setLastMove] = useState(null)
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [possibleMoves, setPossibleMoves] = useState([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [boardInitialized, setBoardInitialized] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const isMobile =
      window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    setMobileMode(isMobile)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = "Chess Master: Local Multiplayer | Play Chess with Friends"

    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement("meta")
      metaDescription.name = "description"
      document.head.appendChild(metaDescription)
    }
    metaDescription.content =
      "Play chess with a friend on the same device with our Local Multiplayer mode. Customize your board, adjust settings, and enjoy a face-to-face chess match."

    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement("link")
      canonicalLink.rel = "canonical"
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = window.location.origin + "/local-multiplayer"

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Game",
      name: "Chess Master - Local Multiplayer",
      description: "Play chess with a friend on the same device with our Local Multiplayer mode.",
      genre: "Board Game",
      gamePlatform: "Web Browser",
      applicationCategory: "GameApplication",
    }

    let scriptTag = document.querySelector('script[type="application/ld+json"]')
    if (!scriptTag) {
      scriptTag = document.createElement("script")
      scriptTag.type = "application/ld+json"
      document.head.appendChild(scriptTag)
    }
    scriptTag.textContent = JSON.stringify(structuredData)

    return () => {
      document.title = "Chess Master | Online Chess Training & Games"
    }
  }, [])

  const handleMobileModeToggle = () => {
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
      return newMode
    })
  }

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

  const triggerWinCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ffb347", "#ffcc33", "#fff"],
    })
  }

  const playSound = (sound) => {
    if (soundEnabled) {
      sound.play()
    }
  }

  useEffect(() => {
    const game = gameRef.current

    const onDragStart = (source, piece, position, orientation) => {
      if (game.isGameOver()) {
        return false
      }

      if ((game.turn() === "w" && piece.search(/^b/) !== -1) || (game.turn() === "b" && piece.search(/^w/) !== -1)) {
        return false
      }

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
    }

    const onDrop = (source, target) => {
      removeHighlights()

      const move = game.move({
        from: source,
        to: target,
        promotion: promotionPiece,
      })

      if (move === null) return "snapback"

      setMoves((prevMoves) => [...prevMoves, { from: move.from, to: move.to }])

      highlightLastMove(source, target)

      if (move.captured) {
        playSound(captureSound)
      } else {
        playSound(moveSound)
      }

      updateStatus()
    }

    const onMouseoverSquare = (square, piece) => {
      if (!visualHints) return

      const moves = game.moves({
        square: square,
        verbose: true,
      })

      if (moves.length === 0) return

      highlightSquare(square)

      for (let i = 0; i < moves.length; i++) {
        highlightSquare(moves[i].to, "possible")
      }
    }

    const onMouseoutSquare = (square, piece) => {
      if (!visualHints) return

      if (lastMove) {
        removeHighlights()
        highlightSquare(lastMove.from, "last-move")
        highlightSquare(lastMove.to, "last-move")
      } else {
        removeHighlights()
      }
    }

    const onSnapEnd = () => {
      boardRef.current.position(game.fen())
    }

    const config = {
      draggable: !mobileMode,
      position: "start",
      onDragStart: onDragStart,
      onDrop: onDrop,
      onMouseoverSquare: onMouseoverSquare,
      onMouseoutSquare: onMouseoutSquare,
      onSnapEnd: onSnapEnd,
      pieceTheme: (piece) => pieceImages[piece],
      snapbackSpeed: 300,
      snapSpeed: 100,
    }

    boardRef.current = Chessboard(chessRef.current, config)
    setBoardInitialized(true)
    updateStatus()

    const handleResize = () => {
      if (boardRef.current) {
        boardRef.current.resize()
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      if (boardRef.current) {
        boardRef.current.destroy()
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [mobileMode, visualHints, promotionPiece, theme, soundEnabled])

  useEffect(() => {
    const resizeBoard = () => {
      if (boardRef.current && boardInitialized) {
        const container = chessRef.current
        if (container) {
          // Make the board responsive based on container width
          const containerWidth = container.clientWidth
          const optimalSize = Math.min(containerWidth, 600)

          // Apply the size to the board
          boardRef.current.resize()
        }
      }
    }

    // Initial resize
    resizeBoard()

    // Add event listener for window resize
    window.addEventListener("resize", resizeBoard)

    // Clean up
    return () => {
      window.removeEventListener("resize", resizeBoard)
    }
  }, [boardInitialized])

  useEffect(() => {
    if (!mobileMode) {
      return
    }

    const handleMobileSquareClick = (event) => {
      event.preventDefault()

      const squareEl = event.currentTarget
      const squareClass = [...squareEl.classList].find((cls) => cls.startsWith("square-") && cls !== "square-55d63")

      if (!squareClass) return

      const clickedSquare = squareClass.replace("square-", "")
      const game = gameRef.current

      if (game.isGameOver()) return

      removeHighlights()

      if (selectedSquare) {
        if (possibleMoves.some((move) => move.to === clickedSquare)) {
          try {
            const move = game.move({
              from: selectedSquare,
              to: clickedSquare,
              promotion: promotionPiece,
            })

            boardRef.current.position(game.fen())

            move.captured ? playSound(captureSound) : playSound(moveSound)

            highlightLastMove(selectedSquare, clickedSquare)

            setMoves((prevMoves) => [...prevMoves, { from: move.from, to: move.to }])

            setSelectedSquare(null)
            setPossibleMoves([])

            updateStatus()
          } catch (error) {
            console.error("Invalid move:", error)
          }
        } else {
          const piece = game.get(clickedSquare)
          if (piece && piece.color === game.turn()) {
            selectNewSquare(clickedSquare)
          } else {
            setSelectedSquare(null)
            setPossibleMoves([])
          }
        }
      } else {
        const piece = game.get(clickedSquare)
        if (piece && piece.color === game.turn()) {
          selectNewSquare(clickedSquare)
        }
      }
    }

    const selectNewSquare = (square) => {
      const game = gameRef.current
      const moves = game.moves({
        square: square,
        verbose: true,
      })

      if (moves.length === 0) return

      setSelectedSquare(square)
      setPossibleMoves(moves)

      highlightSquare(square)

      moves.forEach((move) => {
        highlightSquare(move.to, "possible")
      })
    }

    const squares = document.querySelectorAll(".square-55d63")
    squares.forEach((square) => {
      square.addEventListener("touchend", handleMobileSquareClick)
      square.addEventListener("touchstart", (e) => e.preventDefault())
    })

    return () => {
      squares.forEach((square) => {
        square.removeEventListener("touchend", handleMobileSquareClick)
        square.removeEventListener("touchstart", (e) => e.preventDefault())
      })
    }
  }, [mobileMode, selectedSquare, possibleMoves, visualHints, promotionPiece, theme, soundEnabled])

  useEffect(() => {
    const applyTheme = () => {
      const currentTheme = {
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
      }[theme]

      const styleSheet = document.createElement("style")
      styleSheet.id = "chess-theme"

      const css = `
        .white-1e1d7 { background-color: ${currentTheme.light} !important; }
        .black-3c85d { background-color: ${currentTheme.dark} !important; }
        .highlight-square { background-color: ${currentTheme.highlight} !important; }
        .possible-move { background-color: ${currentTheme.possible} !important; }
        .last-move { box-shadow: inset 0 0 0 4px ${currentTheme.accent} !important; }
        
        /* Mobile responsiveness fixes */
        .square-55d63 {
          width: 12.5% !important;
          height: 0 !important;
          padding-bottom: 12.5% !important;
          position: relative !important;
        }
        
        .piece-417db {
          width: 100% !important;
          height: auto !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          margin: auto !important;
        }
        
        /* Responsive grid layout */
        @media (max-width: 640px) {
          .square-55d63 {
            width: 12.5% !important;
          }
        }
      `

      styleSheet.textContent = css

      const existingStyle = document.getElementById("chess-theme")
      if (existingStyle) {
        existingStyle.remove()
      }

      document.head.appendChild(styleSheet)
    }

    applyTheme()
  }, [theme])

  const handleRestart = () => {
    setIsGameOver(false)
    setGameOverMessage("")
    gameRef.current.reset()
    boardRef.current.position("start")
    setMoves([])
    setCurrentStatus("White to move")
    setSelectedSquare(null)
    setPossibleMoves([])
    removeHighlights()
    setLastMove(null)
  }

  const updateStatus = debounce(() => {
    const game = gameRef.current
    const moveColor = game.turn() === "w" ? "White" : "Black"

    if (game.isCheckmate()) {
      const winner = moveColor === "White" ? "Black" : "White"
      setIsGameOver(true)
      setGameOverMessage(`${winner} wins by checkmate!`)
      playSound(checkmateSound)

      triggerWinCelebration()
    } else if (game.isStalemate()) {
      setIsGameOver(true)
      setGameOverMessage("It's a draw! Stalemate.")
    } else if (game.isThreefoldRepetition()) {
      setIsGameOver(true)
      setGameOverMessage("It's a draw! Threefold repetition.")
    } else if (game.isInsufficientMaterial()) {
      setIsGameOver(true)
      setGameOverMessage("It's a draw! Insufficient material.")
    } else if (game.isDraw()) {
      setIsGameOver(true)
      setGameOverMessage("It's a draw!")
    } else {
      setCurrentStatus(`${moveColor} to move`)
      if (game.inCheck()) {
        setCurrentStatus(`${moveColor} is in check!`)
        playSound(checkSound)
      }
    }
  }, 100)

  return (
    <div className="relative w-screen min-h-screen bg-gray-950 font-mono overflow-x-hidden">
      {/* Background effect */}
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

      {/* Header */}
      <header className="relative z-10 w-full bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 border-b-4 border-yellow-500 shadow-lg py-4 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl md:text-3xl font-bold text-yellow-400 drop-shadow-md">LOCAL MULTIPLAYER</h1>

          {/* Mobile menu button */}
          <button
            className="md:hidden bg-blue-800 p-2 rounded-lg border border-blue-600 flex items-center justify-center shadow-lg"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Chess options"
          >
            {showMobileMenu ? (
              <Settings size={20} className="text-white mr-1" />
            ) : (
              <Settings size={20} className="text-white mr-1" />
            )}
            <span className="text-white font-bold">Settings</span>
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-20 bg-gray-900 border-b-2 border-blue-700 md:hidden"
          >
            <div className="p-4 space-y-3">
              {/* Game mode toggle */}
              <div className="bg-blue-900/50 rounded-lg p-3 border border-blue-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {mobileMode ? (
                      <Smartphone className="h-5 w-5 text-yellow-400 mr-2" />
                    ) : (
                      <Monitor className="h-5 w-5 text-blue-300 mr-2" />
                    )}
                    <span className="font-bold text-white">{mobileMode ? "Mobile Mode" : "Desktop Mode"}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mobileMode}
                      onChange={handleMobileModeToggle}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-xs text-blue-200 mt-1">
                  {mobileMode ? "Tap to select and move pieces" : "Drag and drop pieces to move"}
                </p>
              </div>

              {/* Quick settings */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 p-2 rounded-lg border border-blue-600"
                >
                  {soundEnabled ? (
                    <Volume2 className="h-5 w-5 text-blue-300 mr-1" />
                  ) : (
                    <VolumeX className="h-5 w-5 text-gray-400 mr-1" />
                  )}
                  <span className="text-sm text-white">Sound</span>
                </button>

                <button
                  onClick={() => setVisualHints(!visualHints)}
                  className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 p-2 rounded-lg border border-blue-600"
                >
                  {visualHints ? (
                    <Eye className="h-5 w-5 text-blue-300 mr-1" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400 mr-1" />
                  )}
                  <span className="text-sm text-white">Hints</span>
                </button>

                <button
                  onClick={() => setShowHelpModal(true)}
                  className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 p-2 rounded-lg border border-blue-600"
                >
                  <HelpCircle className="h-5 w-5 text-blue-300 mr-1" />
                  <span className="text-sm text-white">Help</span>
                </button>

                <button
                  onClick={handleRestart}
                  className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 p-2 rounded-lg border border-blue-600"
                >
                  <RotateCcw className="h-5 w-5 text-blue-300 mr-1" />
                  <span className="text-sm text-white">Restart</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="relative z-10 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Game status banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-3 border-2 border-blue-700 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-800 p-2 rounded-full mr-3">
                  <Clock className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Game Status</h2>
                  <p className="text-yellow-300 font-semibold">{currentStatus || "White to move"}</p>
                </div>
              </div>

              {/* Desktop controls */}
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="bg-blue-800 hover:bg-blue-700 p-2 rounded-lg border border-blue-600 text-white flex items-center"
                >
                  <Settings className="h-5 w-5 mr-1" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={handleRestart}
                  className="bg-blue-800 hover:bg-blue-700 p-2 rounded-lg border border-blue-600 text-white flex items-center"
                >
                  <RotateCcw className="h-5 w-5 mr-1" />
                  <span>Restart</span>
                </button>

                <button
                  onClick={() => setShowHelpModal(true)}
                  className="bg-blue-800 hover:bg-blue-700 p-2 rounded-lg border border-blue-600 text-white flex items-center"
                >
                  <HelpCircle className="h-5 w-5 mr-1" />
                  <span>Help</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Settings panel (desktop) */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-gray-900 rounded-lg border-2 border-blue-700 overflow-hidden shadow-lg"
              >
                <div className="bg-blue-800 py-2 px-4 border-b border-blue-700 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-yellow-400">Game Settings</h3>
                  <button onClick={() => setShowSettings(false)} className="text-white hover:text-gray-300">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Game mode */}
                  <div className="bg-gray-800 rounded-lg p-3 border border-blue-600">
                    <h4 className="text-blue-300 font-bold mb-2">Game Mode</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {mobileMode ? (
                          <Smartphone className="h-5 w-5 text-yellow-400 mr-2" />
                        ) : (
                          <Monitor className="h-5 w-5 text-blue-300 mr-2" />
                        )}
                        <span className="text-white">{mobileMode ? "Mobile Mode" : "Desktop Mode"}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mobileMode}
                          onChange={handleMobileModeToggle}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Visual hints */}
                  <div className="bg-gray-800 rounded-lg p-3 border border-blue-600">
                    <h4 className="text-blue-300 font-bold mb-2">Visual Hints</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {visualHints ? (
                          <Eye className="h-5 w-5 text-cyan-300 mr-2" />
                        ) : (
                          <EyeOff className="h-5 w-5 text-gray-400 mr-2" />
                        )}
                        <span className="text-white">{visualHints ? "Enabled" : "Disabled"}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visualHints}
                          onChange={() => setVisualHints(!visualHints)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Sound */}
                  <div className="bg-gray-800 rounded-lg p-3 border border-blue-600">
                    <h4 className="text-blue-300 font-bold mb-2">Sound Effects</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {soundEnabled ? (
                          <Volume2 className="h-5 w-5 text-purple-300 mr-2" />
                        ) : (
                          <VolumeX className="h-5 w-5 text-gray-400 mr-2" />
                        )}
                        <span className="text-white">{soundEnabled ? "Enabled" : "Disabled"}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={soundEnabled}
                          onChange={() => setSoundEnabled(!soundEnabled)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Board theme */}
                  <div className="bg-gray-800 rounded-lg p-3 border border-blue-600">
                    <h4 className="text-blue-300 font-bold mb-2">Board Theme</h4>
                    <div className="flex items-center">
                      <Palette className="h-5 w-5 text-pink-300 mr-2" />
                      <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="w-full bg-gray-700 text-white p-2 rounded-md border border-blue-500 focus:border-yellow-500 focus:outline-none"
                      >
                        <option value="classic">Classic</option>
                        <option value="forest">Forest</option>
                        <option value="ocean">Ocean</option>
                        <option value="night">Night</option>
                        <option value="royal">Royal</option>
                      </select>
                    </div>
                  </div>

                  {/* Promotion piece */}
                  <div className="bg-gray-800 rounded-lg p-3 border border-blue-600">
                    <h4 className="text-blue-300 font-bold mb-2">Promotion Piece</h4>
                    <div className="flex items-center">
                      <select
                        value={promotionPiece}
                        onChange={(e) => setPromotionPiece(e.target.value)}
                        className="w-full bg-gray-700 text-white p-2 rounded-md border border-blue-500 focus:border-yellow-500 focus:outline-none"
                      >
                        <option value="q">Queen</option>
                        <option value="r">Rook</option>
                        <option value="b">Bishop</option>
                        <option value="n">Knight</option>
                      </select>
                    </div>
                  </div>

                  {/* Move history toggle */}
                  <div className="bg-gray-800 rounded-lg p-3 border border-blue-600">
                    <h4 className="text-blue-300 font-bold mb-2">Move History</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <History className="h-5 w-5 text-blue-300 mr-2" />
                        <span className="text-white">{showMovesList ? "Visible" : "Hidden"}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showMovesList}
                          onChange={() => setShowMovesList(!showMovesList)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Chess board section - takes 3/5 of the space on large screens */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3"
            >
              <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-lg border-2 border-blue-700 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-3 px-4 border-b border-blue-700 flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="h-6 w-6 text-yellow-400 mr-2" />
                    <h2 className="text-xl font-bold text-yellow-400">Chess Board</h2>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-blue-200 mr-2">Local Multiplayer</span>
                    <div className="bg-blue-800 p-1 rounded-full">
                      <Users className="h-4 w-4 text-yellow-400" />
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {/* Chess board container */}
                  <div className="backdrop-blur-sm bg-black/30 p-2 sm:p-4 rounded-lg border-2 border-blue-600 shadow-inner">
                    <div
                      ref={chessRef}
                      style={{
                        width: "100%",
                        maxWidth: "min(100%, 600px)",
                        margin: "0 auto",
                        touchAction: mobileMode ? "manipulation" : "auto",
                      }}
                    ></div>

                    {/* Mobile mode indicator */}
                    {mobileMode && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-gradient-to-r from-blue-900/80 to-indigo-900/80 text-white text-center rounded-lg border border-blue-600 shadow-md"
                      >
                        <div className="flex items-center justify-center">
                          <Smartphone className="h-5 w-5 text-yellow-400 mr-2" />
                          <p className="font-medium">
                            {selectedSquare ? "Tap a highlighted square to move" : "Tap a piece to select"}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Quick controls for mobile */}
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRestart}
                        className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-md font-semibold shadow-md flex items-center"
                      >
                        <RotateCcw size={16} className="mr-1" />
                        Restart
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`${
                          soundEnabled
                            ? "bg-gradient-to-r from-purple-600 to-purple-500"
                            : "bg-gradient-to-r from-gray-700 to-gray-600"
                        } text-white px-4 py-2 rounded-md font-semibold shadow-md flex items-center`}
                      >
                        {soundEnabled ? <Volume2 size={16} className="mr-1" /> : <VolumeX size={16} className="mr-1" />}
                        {soundEnabled ? "Sound On" : "Sound Off"}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setVisualHints(!visualHints)}
                        className={`${
                          visualHints
                            ? "bg-gradient-to-r from-cyan-600 to-cyan-500"
                            : "bg-gradient-to-r from-gray-700 to-gray-600"
                        } text-white px-4 py-2 rounded-md font-semibold shadow-md flex items-center`}
                      >
                        {visualHints ? <Eye size={16} className="mr-1" /> : <EyeOff size={16} className="mr-1" />}
                        {visualHints ? "Hints On" : "Hints Off"}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Game info section - takes 2/5 of the space on large screens */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-lg border-2 border-blue-700 shadow-lg h-full">
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-3 px-4 border-b border-blue-700">
                  <h2 className="text-xl font-bold text-yellow-400">Game Info</h2>
                </div>

                <div className="p-4 space-y-4">
                  {/* Game stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-blue-900/80 to-indigo-900/80 rounded-lg p-3 border border-blue-600 flex items-center"
                    >
                      <div className="mr-3 bg-blue-800 p-2 rounded-full border border-yellow-500">
                        <Shield size={20} className="text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-blue-300">Mode</div>
                        <div className="text-lg font-bold text-white">Local Multiplayer</div>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-blue-900/80 to-indigo-900/80 rounded-lg p-3 border border-blue-600 flex items-center"
                    >
                      <div className="mr-3 bg-blue-800 p-2 rounded-full border border-yellow-500">
                        <Award size={20} className="text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-blue-300">Moves</div>
                        <div className="text-lg font-bold text-white">{moves.length}</div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Move history */}
                  <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 rounded-lg border border-blue-600 overflow-hidden">
                    <div className="bg-blue-900/80 py-2 px-3 border-b border-blue-700 flex justify-between items-center">
                      <div className="flex items-center">
                        <History className="h-5 w-5 text-yellow-400 mr-2" />
                        <h3 className="text-lg font-semibold text-yellow-400">Move History</h3>
                      </div>
                      <button
                        onClick={() => setShowMovesList(!showMovesList)}
                        className="text-white bg-blue-800 hover:bg-blue-700 px-2 py-1 rounded text-sm border border-blue-600 flex items-center"
                      >
                        {showMovesList ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Hide
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Show
                          </>
                        )}
                      </button>
                    </div>

                    <AnimatePresence>
                      {showMovesList && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="max-h-[200px] sm:max-h-[300px] overflow-y-auto"
                        >
                          {moves.length > 0 ? (
                            <table className="w-full border-collapse text-sm">
                              <thead>
                                <tr className="bg-blue-900/50 text-white border-b border-blue-700">
                                  <th className="p-2 text-left">#</th>
                                  <th className="p-2 text-left">From</th>
                                  <th className="p-2 text-left">To</th>
                                  <th className="p-2 text-left">Player</th>
                                </tr>
                              </thead>
                              <tbody>
                                {moves.map((move, index) => (
                                  <tr
                                    key={index}
                                    className={`text-white ${
                                      index % 2 === 0 ? "bg-blue-900/20" : "bg-blue-900/10"
                                    } hover:bg-blue-800/30`}
                                  >
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2 font-mono">{move.from}</td>
                                    <td className="p-2 font-mono">{move.to}</td>
                                    <td className="p-2">{index % 2 === 0 ? "White" : "Black"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div className="text-center py-4 text-blue-300">No moves yet</div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Game settings for desktop */}
                  <div className="hidden md:block">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Board theme */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 rounded-lg p-3 border border-blue-600"
                      >
                        <h3 className="text-lg font-semibold text-blue-300 mb-2 flex items-center">
                          <Palette className="h-5 w-5 mr-2" />
                          Board Theme
                        </h3>
                        <select
                          value={theme}
                          onChange={(e) => setTheme(e.target.value)}
                          className="w-full bg-gray-800 text-blue-100 p-2 rounded-md border border-blue-500 focus:border-yellow-500 focus:outline-none"
                        >
                          <option value="classic">Classic</option>
                          <option value="forest">Forest</option>
                          <option value="ocean">Ocean</option>
                          <option value="night">Night</option>
                          <option value="royal">Royal</option>
                        </select>
                      </motion.div>

                      {/* Promotion piece */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 rounded-lg p-3 border border-blue-600"
                      >
                        <h3 className="text-lg font-semibold text-blue-300 mb-2 flex items-center">
                          <Award className="h-5 w-5 mr-2" />
                          Promotion Piece
                        </h3>
                        <select
                          value={promotionPiece}
                          onChange={(e) => setPromotionPiece(e.target.value)}
                          className="w-full bg-gray-800 text-blue-100 p-2 rounded-md border border-blue-500 focus:border-yellow-500 focus:outline-none"
                        >
                          <option value="q">Queen</option>
                          <option value="r">Rook</option>
                          <option value="b">Bishop</option>
                          <option value="n">Knight</option>
                        </select>
                      </motion.div>
                    </div>
                  </div>

                  {/* How to play */}
                  <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 rounded-lg p-4 border border-blue-600">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2" />
                      How to Play
                    </h3>
                    <ul className="text-blue-100 text-sm space-y-2">
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <span>Two players take turns moving pieces on the same device</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <span>White moves first, followed by Black</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <span>The goal is to checkmate your opponent's king</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <span>Use mobile mode for touchscreens or desktop mode for mouse control</span>
                      </li>
                    </ul>
                    <button
                      onClick={() => setShowHelpModal(true)}
                      className="mt-3 w-full bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-md text-sm border border-blue-600"
                    >
                      View Full Rules
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 bg-gradient-to-b from-blue-900 to-blue-950 border-4 border-yellow-500 rounded-lg p-6 shadow-lg text-center"
          >
            <h2 className="text-3xl font-bold text-yellow-400 mb-4 uppercase">Play with a Friend!</h2>

            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Challenge a friend to a game of chess on the same device. Take turns making moves and see who has the
              better strategy.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRestart}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-blue-900 text-xl font-bold uppercase rounded-lg hover:bg-yellow-400 transition-colors shadow-lg border-2 border-yellow-600"
            >
              START NEW GAME
            </motion.button>
          </motion.div>
        </div>
      </main>

      <HelpModal showHelpModal={showHelpModal} setShowHelpModal={setShowHelpModal} />

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={isGameOver}
        message={gameOverMessage}
        onRestart={handleRestart}
        onPlayAgain={handleRestart}
        playAgainRequested={false}
        playAgainCountdown={0}
        opponentPlayAgainRequested={false}
        onAcceptPlayAgain={() => {}}
        onDeclinePlayAgain={() => {}}
      />
    </div>
  )
}

export default LocalPlayer
