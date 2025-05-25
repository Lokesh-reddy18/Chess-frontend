import { useState, useEffect, lazy, Suspense } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { 
  ChevronRight, Crown, Trophy, User, 
  Cpu, Puzzle, Users, Globe, Sparkles, ArrowRight 
} from "lucide-react"
import ChessMasterLogo from "./ChessMasterLogo"

const PieceArray = lazy(() => import("./PieceArray"))
const LoadingSpinner = () => (
  <div className="w-5 h-5 border-t-2 border-blue-400 border-solid rounded-full animate-spin" aria-label="Loading"></div>
)

export default function Home() {
  const navigate = useNavigate()
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const [showPieceArray, setShowPieceArray] = useState(false)
  const [devicePerformance, setDevicePerformance] = useState("high")
  const [parallaxItems, setParallaxItems] = useState([])
  const [isHovering, setIsHovering] = useState({ login: false, signup: false, continue: false })
  const [typedText, setTypedText] = useState("")
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  const gameModes = [
    {
      title: "Play vs AI",
      icon: <Cpu className="h-6 w-6" />,
      description: "Challenge our advanced chess AI with adjustable difficulty levels.",
      path: "/against-stockfish",
      color: "bg-blue-700",
      ariaLabel: "Play against AI"
    },
    {
      title: "Random Chess",
      icon: <Sparkles className="h-6 w-6" />,
      description: "Experience chess with a twist! Randomize pieces and rules for a unique game.",
      path: "/random-play",
      color: "bg-purple-700",
      ariaLabel: "Play online matches"
    },
    {
      title: "Tactical Puzzles",
      icon: <Puzzle className="h-6 w-6" />,
      description: "Improve your skills with our curated collection of chess puzzles.",
      path: "/puzzle",
      color: "bg-green-700",
      ariaLabel: "Solve tactical puzzles"
    },
    {
      title: "Local Multiplayer",
      icon: <Users className="h-6 w-6" />,
      description: "Play face-to-face with friends on the same device.",
      path: "/local-multiplayer",
      color: "bg-yellow-700",
      ariaLabel: "Play local multiplayer"
    },
  ]

  useEffect(() => {
    document.title = "Chess Master | The Ultimate Chess Experience"
    
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = "description"
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute(
      "content",
      "Experience the ultimate chess journey with Chess Master. Challenge friends, solve puzzles, play against AI, and improve your skills."
    )
    
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = "canonical"
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = window.location.origin + "/"

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Chess Master",
      "applicationCategory": "GameApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "description": "A comprehensive chess platform for players of all skill levels.",
    }

    let scriptTag = document.querySelector("#structured-data")
    if (!scriptTag) {
      scriptTag = document.createElement("script")
      scriptTag.id = "structured-data"
      scriptTag.type = "application/ld+json"
      document.head.appendChild(scriptTag)
    }
    scriptTag.textContent = JSON.stringify(structuredData)

    const detectPerformance = () => {
      const isMobile = window.innerWidth < 768
      const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4
      setDevicePerformance(isMobile || isLowMemory ? "low" : "high")
    }

    detectPerformance()
    setIsPageLoaded(true)

    const animationTimer = setTimeout(() => {
      setShowPieceArray(true)
    }, 300)

    return () => clearTimeout(animationTimer)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!isPageLoaded) return

    const generateParallaxItems = () => {
      const pieces = ["♟︎", "♞", "♝", "♜", "♛", "♚", "♔", "♕", "♖", "♗", "♘", "♙"]
      const count = devicePerformance === "low" ? 6 : window.innerWidth < 768 ? 8 : 15
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        piece: pieces[Math.floor(Math.random() * pieces.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 1,
        speed: Math.floor(Math.random() * 4) + 1,
        opacity: Math.random() * 0.3 + 0.1,
        rotation: Math.floor(Math.random() * 360),
      }))
    }

    setParallaxItems(generateParallaxItems())
  }, [devicePerformance, isPageLoaded])

  useEffect(() => {
    if (!isPageLoaded) return

    const fullText = "CHESS MASTER"
    let index = 0
    let currentText = ""
    
    const interval = setInterval(() => {
      if (index < fullText.length) {
        currentText += fullText[index]
        setTypedText(currentText)
        index++
      } else {
        clearInterval(interval)
      }
    }, 85)
    
    return () => clearInterval(interval)
  }, [isPageLoaded])

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-gray-950 font-mono">
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
          aria-hidden="true"
        ></div>
      </div>

      {devicePerformance === "high" && isPageLoaded && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {parallaxItems.map((item) => (
            <div
              key={item.id}
              className={`absolute text-white/10 float-animation-${item.speed}`}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                fontSize: `${item.size * 2}rem`,
                opacity: item.opacity,
                transform: `rotate(${item.rotation}deg)`,
              }}
            >
              {item.piece}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 py-16 min-h-screen flex flex-col">
        <header className="w-full bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 border-b-4 border-yellow-500 shadow-lg py-6 md:py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 animate-pulse">
                <Sparkles className="h-8 w-8 text-yellow-300" />
              </div>
              <div className="absolute -top-2 -right-4 animate-pulse delay-300">
                <Sparkles className="h-6 w-6 text-yellow-300" />
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-2 pixelated drop-shadow-md">
                {typedText || "CHESS MASTER"}
              </h1>
            </div>

            <div className="h-1 w-32 mx-auto bg-yellow-500 mb-4"></div>

            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Experience the ultimate chess journey. Challenge friends, solve puzzles, and test your skills on any
              device.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">     
              <button
                onClick={() => navigate(authStatus ? "/modeselector" : "/signup")}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600
                          text-blue-900 font-bold rounded-lg transition duration-300 transform 
                          hover:scale-105 shadow-glow flex items-center justify-center"
                onMouseEnter={() => setIsHovering({ ...isHovering, signup: true })}
                onMouseLeave={() => setIsHovering({ ...isHovering, signup: false })}
                aria-label={authStatus ? "Play now" : "Start playing"}
              >
                <Trophy className="mr-2" size={18} />
                {authStatus ? "PLAY NOW" : "START PLAYING"}
                {isHovering.signup && <ChevronRight className="ml-2" size={16} />}
              </button>

              {!authStatus && (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
                            text-white font-bold rounded-lg transition duration-300 transform 
                            hover:scale-105 shadow-glow flex items-center justify-center"
                  onMouseEnter={() => setIsHovering({ ...isHovering, login: true })}
                  onMouseLeave={() => setIsHovering({ ...isHovering, login: false })}
                  aria-label="Login to your account"
                >
                  <User className="mr-2" size={18} />
                  LOGIN
                  {isHovering.login && <ChevronRight className="ml-2" size={16} />}
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-grow px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <section className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel mb-12">
              <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                <h2 className="text-2xl font-bold text-yellow-400 uppercase">Welcome to Chess Master</h2>
              </div>

              <ChessMasterLogo variant="home" />

              {showPieceArray && (
                <Suspense fallback={
                  <div className="h-16 flex justify-center items-center" aria-label="Loading piece array...">
                    <LoadingSpinner />
                  </div>
                }>
                  <div className="flex justify-center mb-6">
                    <PieceArray />
                  </div>
                </Suspense>
              )}

              <div className="mb-10">
                <p className="text-blue-100 text-center text-lg mb-8">
                  {authStatus
                    ? `Welcome back, ${userData?.username || "Player"}! Ready for a match?`
                    : "Join the Chess Master community and begin your journey to chess mastery."}
                </p>
              </div>
            </section>

            <section className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel mb-12">
              <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                <h2 className="text-2xl font-bold text-yellow-400 uppercase">Game Modes</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gameModes.map((mode, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 border-2 border-blue-600 rounded-lg overflow-hidden hover:border-yellow-500 transition-colors duration-300 cursor-pointer"
                    onClick={() => navigate(mode.path)}
                    role="button"
                    aria-label={mode.ariaLabel}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        navigate(mode.path)
                      }
                    }}
                  >
                    <div className={`${mode.color} py-2 px-4 flex items-center`}>
                      <div className="bg-gray-900 p-2 rounded-full mr-3">{mode.icon}</div>
                      <h3 className="text-xl font-bold text-white">{mode.title}</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-blue-100 mb-4">{mode.description}</p>
                      <div className="flex justify-end">
                        <button 
                          className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
                          aria-label={`Play ${mode.title} now`}
                        >
                          Play Now <ArrowRight className="ml-1 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {!authStatus && (
              <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
                            text-white font-bold rounded-lg transition duration-300 transform 
                            hover:scale-105 shadow-glow flex items-center justify-center"
                  onMouseEnter={() => setIsHovering({ ...isHovering, login: true })}
                  onMouseLeave={() => setIsHovering({ ...isHovering, login: false })}
                  aria-label="Login to your account"
                >
                  <User className="mr-2" size={18} />
                  LOGIN TO YOUR ACCOUNT
                  {isHovering.login && <ChevronRight className="ml-2" size={16} />}
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                            text-white font-bold rounded-lg transition duration-300 transform 
                            hover:scale-105 shadow-glow flex items-center justify-center"
                  onMouseEnter={() => setIsHovering({ ...isHovering, signup: true })}
                  onMouseLeave={() => setIsHovering({ ...isHovering, signup: false })}
                  aria-label="Create new account"
                >
                  <Trophy className="mr-2" size={18} />
                  CREATE NEW ACCOUNT
                  {isHovering.signup && <ChevronRight className="ml-2" size={16} />}
                </button>
              </div>
            )}

            {authStatus && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate("/profile")}
                  className="px-6 py-3 bg-gray-800 text-yellow-400 font-bold border-2 border-blue-700 rounded-lg
                            hover:bg-blue-900 transition duration-300 transform hover:scale-105 shadow-glow
                            flex items-center justify-center mx-auto"
                  aria-label="Go to profile"
                >
                  <User className="mr-2" size={18} />
                  YOUR PROFILE
                </button>
              </div>
            )}
          </div>
        </main>

        <footer className="w-full bg-gradient-to-b from-gray-900 to-gray-950 border-t-4 border-blue-800 py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-b from-blue-900 to-blue-950 border-4 border-yellow-500 rounded-lg p-6 shadow-lg text-center">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4 uppercase">Ready for the Challenge?</h2>

              <p className="text-blue-100 mb-6">
                Join thousands of players worldwide and become part of the Chess Master community!
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                {authStatus ? (
                  <button
                    onClick={() => navigate("/modeselector")}
                    className="px-8 py-4 bg-yellow-500 text-blue-900 text-xl font-bold uppercase rounded-lg 
                              hover:bg-yellow-400 transition-colors shadow-lg border-2 border-yellow-700 
                              transform hover:scale-105 transition-transform flex items-center"
                    aria-label="Continue playing"
                  >
                    <Crown className="mr-2" size={20} />
                    CONTINUE PLAYING
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-8 py-4 bg-yellow-500 text-blue-900 text-xl font-bold uppercase rounded-lg 
                              hover:bg-yellow-400 transition-colors shadow-lg border-2 border-yellow-700 
                              transform hover:scale-105 transition-transform flex items-center"
                    aria-label="Join now"
                  >
                    <Trophy className="mr-2" size={20} />
                    JOIN NOW
                  </button>
                )}
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-blue-100" aria-label="Feature highlights">
                <div className="flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" aria-hidden="true"></div>
                  <span>Free to Play</span>
                </div>
                <div className="flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" aria-hidden="true"></div>
                  <span>Global Leaderboards</span>
                </div>
                <div className="flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" aria-hidden="true"></div>
                  <span>Advanced AI</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}